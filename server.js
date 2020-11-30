"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smtpTransport = exports.server = exports.app = void 0;
var express = require("express");
require("express-async-errors");
exports.app = express();
var fs = require("fs/promises");
var http = require("http");
exports.server = http.createServer(exports.app);
var dotenv = require("dotenv");
dotenv.config();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var node_fetch_1 = require("node-fetch");
var expressSession = require("express-session");
var path = require("path");
var morgan = require("morgan");
var helmet = require("helmet");
var nodemailer = require("nodemailer");
process.on("unhandledRejection", function (reason, promise) {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});
fs.mkdir(__dirname + "/files/").catch(function (err) {
    if (err && (err.errno !== -17 && err.errno !== -4075))
        console.error(err);
});
["log", "warn", "error", "dir"].forEach(function (methodName) {
    var originalMethod = console[methodName];
    console[methodName] = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var initiator = "unknown place";
        try {
            throw new Error();
        }
        catch (e) {
            if (typeof e.stack === "string") {
                var isFirst = true;
                for (var _a = 0, _b = e.stack.split("\n"); _a < _b.length; _a++) {
                    var line = _b[_a];
                    var matches = line.match(/^\s+at\s+(.*)/);
                    if (matches) {
                        if (!isFirst) {
                            initiator = matches[1];
                            break;
                        }
                        isFirst = false;
                    }
                }
            }
        }
        originalMethod.apply(console, __spreadArrays(args, ["\n", "  at " + initiator]));
    };
});
var session = expressSession({
    secret: "Phoe",
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: false,
    },
});
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(function () { return console.log("connection to database succesful"); })
    .catch(function (err) { return console.error(err); });
exports.app.use(express.static(path.join(__dirname, "/public")));
exports.app.set("view engine", "ejs");
exports.app.use(morgan("dev"));
exports.app.use(bodyParser.json({ limit: "50mb" }));
exports.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
exports.app.use(session);
exports.app.use(helmet());
exports.smtpTransport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
var port = process.env.PORT || 8005;
exports.server.listen(port, function () { return console.log("listening to port " + port); });
setInterval(function () {
    node_fetch_1.default("https://phoe.azurewebsites.net/");
}, 1000 * 60 * 10);
require("./controllers/accountController");
require("./controllers/mainController");
exports.app.use(function (req, res, next) {
    req.session.messages.push("pageNotFound");
    req.session.save();
    res.redirect("/profile");
    next();
});
