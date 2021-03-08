import { 
    loginController,
    loginAdminController,
    registerContoller,
    changePasswordController,
    deleteAccountController
} from '../controllers/user.controller'
import passport from 'passport'
import { verifyToken } from "../middleware/authentication"

const express = require("express")
const router = new express.Router()

router.post('/login', passport.authenticate('local'), loginController)
router.post('/loginadmin', passport.authenticate('local'), loginAdminController)
router.post('/register', registerContoller)
router.put('/changepassword', verifyToken, changePasswordController)
router.delete('/', verifyToken, deleteAccountController)

module.exports = router