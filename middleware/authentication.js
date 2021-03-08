import { UserModel } from "../models/user.schema"
import { tokenKey } from "../config";

const jwt = require('jsonwebtoken');

export const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (typeof (bearerHeader) !== "undefined") {
        const token = bearerHeader.split(" ")[1]
        const decodeData = jwt.decode(token, tokenKey)
        try {
            if(Date.now() >= decodeData.exp * 1000) {
                res.sendStatus(403)
            } else {
                const user = decodeData._doc
                UserModel.findById(user._id)
                    .then((res) => {
                        req.middleware_auth = res
                        next()
                    })
                    .catch((err) => {
                        res.sendStatus(403)
                    })
            }
        } catch(err) {
            res.sendStatus(403)
        }
    } else {
        res.sendStatus(403)
    }
}