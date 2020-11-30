"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passportLocal = require("passport-local");
var LocalStrategy = passportLocal.Strategy;
var passport = require("passport");
var bcrypt = require("bcryptjs");
var userSchemaModel_1 = require("./userSchemaModel");
var server_1 = require("../../server");
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
    userSchemaModel_1.User.findById(id)
        .then(function (user) { return cb(null, user); })
        .catch(function (err) { return cb(err); });
});
passport.use(new LocalStrategy({ usernameField: "username", passwordField: "PW", passReqToCallback: true }, function (req, username, PW, cb) {
    function callback(users) {
        var user = users[0];
        if (!user) {
            return cb(null, false, { message: "Incorrect username." });
        }
        bcrypt.compare(PW, user.PW).then(function (v) {
            if (v) {
                return cb(null, user);
            }
            return cb(null, false, { message: "Incorrect password." });
        });
    }
    if (req.session.connectedWithEmail === true) {
        userSchemaModel_1.User.find({ email: username })
            .then(function (users) { return callback(users); })
            .catch(function (err) { return cb(err); });
        req.session.connectedWithEmail = undefined;
    }
    else {
        userSchemaModel_1.User.find({ username: username })
            .then(function (users) { return callback(users); })
            .catch(function (err) { return cb(err); });
    }
}));
server_1.app.use(passport.initialize());
server_1.app.use(passport.session());
