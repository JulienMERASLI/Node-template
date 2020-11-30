"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    PW: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});
UserSchema.pre("save", function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified("PW"))
        return next();
    // generate a salt
    bcrypt.genSalt(12)
        .then(function (salt) {
        bcrypt.hash(user.PW, salt)
            .then(function (hash) {
            user.PW = hash;
            next();
        })
            .catch(function (err) { return next(err); });
    })
        .catch(function (err) { return next(err); });
});
exports.User = mongoose.model("User", UserSchema);
