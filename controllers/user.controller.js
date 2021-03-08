import { createController, generateRequiredSchemaItems } from "./helper"
import { UserModel } from "../models/user.schema"
import { Collection } from "../utilities/database"
import { tokenKey } from "../config"
import { pipe, zip, of } from "rxjs"
import { mergeMap } from "rxjs/operators"
import { generatePassword } from "../utilities/security"
import { sendMessage } from "../utilities/messaging"

const jwt = require('jsonwebtoken');

const user = new Collection(UserModel)

const LoginOperation = {
    response_mapper: (req, res) => {
        console.log(req)
        const user = req.user
        const token = jwt.sign({ ...user }, tokenKey)
    
        res.send({
            token,
            Name: user.Firstname + ' ' + user.LastName,
            message: 'Login Successful',
            UserLevel: req.user.UserLevel,
            _id: req.user._id
        });
    }
}
const Login_AdminOperation = {
    response_mapper: (req, res) => {
        console.log(req)
        const user = req.user
        const token = jwt.sign({ ...user }, tokenKey, { expiresIn: '1h' })
    
        if(req.user.UserLevel > 2)
            res.sendStatus(403)
        else
            res.send({
                token,
                Name: user.Firstname + ' ' + user.LastName,
                message: 'Login Successful',
                UserLevel: req.user.UserLevel,
                _id: req.user._id
            });
    }
}
const RegisterOperation = {
    request_mapper: (req) => req.body,
    processor: pipe(
        mergeMap((props) => {
            const password = props.Password
            const { salt, hash } = generatePassword(password)
            return zip(
                of(props),
                user.ADD({
                    Email: props.Email,
                    FirstName: props.FirstName,
                    LastName: props.LastName,
                    ContactNo: props.ContactNo,
                    salt,
                    hash,
                    UserLevel: props.UserLevel,
                    DateCreated: new Date(), 
                }),
                of(password)
            )
        }),
    ),
    response_mapper: (req, res) => (val) => {
        res.send({
            id: val[0]._id,
            message: "Successfully Registered User!",
        })

    }
}
const ChangePasswordOperation = {
    requestValidationSchema: generateRequiredSchemaItems([
        'body.NewPassword',
        'body.ConfirmPassword',
        'body._id'
    ]),
    request_mapper: (req) => req.body,
    processor: pipe(
        mergeMap((props) => {
            const password = props.NewPassword
            const { salt, hash } = generatePassword(password)
            return zip(
                of(props),
                user.UPDATE({
                    identifier: {
                        _id: props._id
                    },
                    data: {
                        salt: salt,
                        hash: hash
                    }
                }),
                of(password)
            )
        }),
        mergeMap((_props) => user.GET())
    ),
    response_mapper: (req, res) => (val) => {
        res.send({
            message: "Successfully Changed Password!",
        })
    }
}
const DeleteAccountOperation = {
    requestValidationSchema: generateRequiredSchemaItems([
        'query.id'
    ]),
    request_mapper: (req) => {
        if(req.query.Barangay === undefined && req.query.UserLevel === undefined) {
            return { _id: req.query.id }
        } else if(req.query.UserLevel !== undefined) {
            return { _id: req.query.id, UserLevel: req.query.UserLevel }
        } else {
            return { _id: req.query.id, UserLevel: req.query.UserLevel }
        }
    },
    processor: pipe(
        mergeMap((props) => {
            return zip( 
                of(props),
                user.DELETE_ONE(props)
            )
        }),
        mergeMap(([props,deleteduser]) => user.GET({UserLevel: props.UserLevel}))
    ),
    response_mapper: (req, res) => (val) => {
        res.send({
            message: "Successfully Deleted Account!",
            accounts: val
        })
    }
}



export const loginController = createController(LoginOperation)
export const loginAdminController = createController(Login_AdminOperation)
export const registerContoller = createController(RegisterOperation)
export const changePasswordController = createController(ChangePasswordOperation)
export const deleteAccountController = createController(DeleteAccountOperation)