/// <reference path="../types/express.d.ts" />

import * as fs from "fs/promises";
import { existsSync as exists } from "fs";
import * as passport from "passport";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import async from "async";
import { app, smtpTransport } from "../server";
import { User } from "../models/accounts/userSchemaModel";

import "../models/accounts/passportModel";
import { resetPW, forgotPW } from "../models/accounts/mailsResetPW";
import { notConnected } from "./mainController";

const alreadyConnected = (req, res, next) => {
	if (req.user) {
		req.session.messages = ["alreadyConnected"];
		return res.redirect("/profile");
	}
	next();
};

app.get("/login", alreadyConnected, (req, res) => {
	const messages = req.session.messages || [""];
	const params = {};
	["wrongID", "existingUser", "notConnected", "emailSent"].forEach(message => {
		if (messages.find(mes => mes === message)) {
			messages.shift();
			params[message] = true;
		}
	});
	res.render("forms/login", params);
});

app.get("/register", alreadyConnected, (req, res) => {
	if (req.user) {
		req.session.messages = ["alreadyConnected"];
		return res.redirect("/profile");
	}
	res.render("forms/register");
});

app.get("/forgotPW", alreadyConnected, (req, res) => {
	const params = {};
	const messages = req.session.messages || [];
	if (messages.length > 0) {
		params[messages[0]] = true;
		messages.shift();
	}
	res.render("forms/forgotPW", params);
});

app.get("/resetPW/:token", alreadyConnected, async (req, res) => {
	const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
	if (!user) {
		req.session.messages = ["invalidToken"];
		return res.redirect("/forgotPW");
	}
	res.render("forms/resetPW", { token: req.params.token });
});

app.get("/logout", notConnected, (req, res) => {
	req.logout();
	res.redirect("/connexion");
});

app.get("/settings", notConnected, (req, res) => {
	res.render("forms/settings", { user: req.user });
});

app.post("/connected", (req, res, next) => {
	if (!req.body.username) {
		req.body.username = req.body.email;
		req.session.connectedWithEmail = true;
	}
	next();
}, passport.authenticate("local", { failureRedirect: "/login", failureMessage: "wrongID" }), (req, res) => {
	const redirect = req.session.returnTo || "/profile";
	delete req.session.returnTo;
	res.redirect(redirect);
});

app.post("/registered", async (req, res) => {
	const user = new User({ username: req.body.username, PW: req.body.PW, email: req.body.email });
	const doc = await User.find({ username: user.username }).exec();
	if (doc.length) {
		req.session.messages = ["existingUser"];
		return res.redirect("/login");
	}
	if ((await User.find({ email: user.email }).exec())[0]) {
		req.session.messages = ["existingUser"];
		return res.redirect("/login");
	}

	await user.save();
	let dirname: string | string[] = __dirname.split("/");
	dirname.pop();
	dirname = dirname.join("/");
	await fs.mkdir(`${dirname}/files/${user.username}`);
	req.login(user, error => {
		if (error) console.error(error);
		req.session.messages = ["registered"];
		req.session.save();
		return res.redirect("/profile");
	});
});

app.patch("/settings", notConnected, async (req, res) => {
	const oldUser = req.user;
	const newUser = req.body;
	if (newUser.username && oldUser.username !== newUser.username) {
		if (exists(`./files/${oldUser.username}/`)) {
			await fs.rename(`./files/${oldUser.username}/`, `./files/${newUser.username}/`);
		}
	}
	Object.keys(req.body).forEach(elem => {
		oldUser[elem] = req.body[elem];
	});
	await oldUser.save();
	res.status(200).send();
	req.session.messages.push("settingsChanged");
	req.session.save();
});

app.post("/verifyPW", notConnected, async (req, res) => {
	const { PW: formPW } = req.body;
	const { PW: userPW } = req.user;
	const samePW = await bcrypt.compare(formPW, userPW);
	res.status(200).send(samePW);
});

app.get("/forgotPW", (req, res) => {
	const params = {};
	const messages = req.session.messages || [];
	if (messages.length > 0) {
		params[messages[0]] = true;
		messages.shift();
	}
	res.render("forms/forgotPW", params);
});

app.get("/resetPW/:token", async (req, res) => {
	const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
	if (!user) {
		req.session.messages = ["invalidToken"];
		return res.redirect("/forgotPW");
	}
	res.render("forms/resetPW", { token: req.params.token });
});

app.post("/forgotPW", (req, res) => {
	async.waterfall([
		(done) => {
			crypto.randomBytes(20, (err, buf) => {
				const token = buf.toString("hex");
				done(err, token);
			});
		},
		async (token, done) => {
			const user = await User.findOne({ email: req.body.email }).exec();
			if (!user) {
				req.session.messages = ["noUser"];
				req.session.save();
				return res.redirect("/forgotPW");
			}

			user.resetPasswordToken = token;
			user.resetPasswordExpires = Date.now() + 3600000;

			const error = await user.save();
			done(error instanceof Error ? error : null, token, user);
		},
		async (token, user, done) => {
			const mailOptions = {
				...forgotPW(req.headers.host, token),
				to: user.email,
			};
			const err = await smtpTransport.sendMail(mailOptions);
			if (err instanceof Error) return done(err, "done");
			req.session.messages = ["emailSent"];
			return res.redirect("/login");
		},
	], (err) => {
		if (err) console.error(err);
		res.redirect("/forgotPW");
	});
});

app.post("/resetPW/:token", (req, res) => {
	console.log("teztpiehapfia");
	async.waterfall([
		async (done) => {
			const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
			if (!user) {
				req.session.messages = ["invalidToken"];
				return res.redirect("/forgotPW");
			}
			user.PW = req.body.PW;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();
			req.login(user, (error) => {
				done(error, user);
			});
		},
		async (user, done) => {
			const mailOptions = {
				...resetPW,
				to: user.email,
			};
			const err = await smtpTransport.sendMail(mailOptions);
			if (err instanceof Error) return done(err, "done");
			req.session.messages = ["PWModified"];
			return res.redirect("/profile");
		},
	], (err) => {
		if (err) console.error(err);
		res.redirect("/login");
	});
});
