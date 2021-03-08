import { validPassword } from "../utilities/security"
import { UserModel } from "../models/user.schema"

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use('local', new LocalStrategy((username, password, done) => {
    UserModel.findOne({
        Email: username
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, {
                message: "User not found"
            });
        }

        if (!validPassword(user, password)) {
            return done(null, false, {
                message: 'Password is wrong'
            });
        }

        return done(null, user)
    })
}))

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});
