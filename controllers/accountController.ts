/// <reference path="../types/server.d.ts" />

import * as fs from "fs/promises";
import { existsSync as exists } from "fs";
import * as passport from "passport";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import async from "async";
import * as Joi from "joi";
import { app, smtpTransport } from "../server";
import { User } from "../models/accounts/userSchemaModel";

import "../models/accounts/passportModel";
import { resetPW, forgotPW } from "../models/accounts/mailsResetPW";
import { alreadyConnected, getMessages, notConnected } from "./middlewares";

app.get("/login", alreadyConnected, (req, res) => {
	const params = {};
	getMessages(req, params);
	res.render("forms/login", params);
});

app.get("/register", alreadyConnected, (req, res) => {
	const params = {};
	getMessages(req, params);
	res.render("forms/register", params);
});

app.get("/forgotPW", alreadyConnected, (req, res) => {
	const params = {};
	getMessages(req, params);
	res.render("forms/forgotPW", params);
});

app.get("/resetPW/:token", alreadyConnected, async (req, res) => {
	const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
	if (!user) {
		req.session.messages.push("invalidToken");
		return res.redirect("/forgotPW");
	}
	res.render("forms/resetPW", { token: req.params.token });
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

app.get("/settings", notConnected, (req, res) => {
	res.render("forms/settings", { user: req.user, url: "/settings" });
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
	const userSchema = Joi.object({
		username: Joi.string()
			.pattern(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/)
			.min(2)
			.required(),
		PW: Joi.string()
			.min(4)
			.required(),
		email: Joi.string()
			.email()
			.required(),
	});
	try {
		await userSchema.validateAsync(req.body, { allowUnknown: true });
		const user = new User({ username: req.body.username, PW: req.body.PW, email: req.body.email });
		const doc = await User.find({ username: user.username }).exec();
		if (doc.length) {
			req.session.messages.push("existingUser");
			return res.redirect("/login");
		}
		if ((await User.find({ email: user.email }).exec())[0]) {
			req.session.messages.push("existingUser");
			return res.redirect("/login");
		}

		await user.save();
		let dirname: string | string[] = __dirname.split("/");
		dirname.pop();
		dirname = dirname.join("/");
		await fs.mkdir(`${dirname}/files/${user.username}`);

		req.login(user, error => {
			if (error) console.error(error);
			req.session.messages.push("registered");
			req.session.save();
			return res.redirect("/profile");
		});
	}
	catch (e) {
		req.session.messages.push("wrongDataFormat");
		req.session.save();
		return res.redirect("/register");
	}
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

app.get("/forgotPW", alreadyConnected, (req, res) => {
	const params = {};
	getMessages(req, params);
	res.render("forms/forgotPW", params);
});

app.get("/resetPW/:token", alreadyConnected, async (req, res) => {
	const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
	if (!user) {
		req.session.messages.push("invalidToken");
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
				req.session.messages.push("noUser");
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
			req.session.messages.push("emailSent");
			return res.redirect("/login");
		},
	], (err) => {
		if (err) console.error(err);
		res.redirect("/forgotPW");
	});
});

app.post("/resetPW/:token", (req, res) => {
	if (req.body.PW.length < 4) {
		req.session.messages.push("wrongDataFormat");
		req.session.save();
		return res.redirect("/resetPW");
	}
	async.waterfall([
		async (done) => {
			const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
			if (!user) {
				req.session.messages.push("invalidToken");
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
			req.session.messages.push("PWModified");
			return res.redirect("/profile");
		},
	], (err) => {
		if (err) console.error(err);
		res.redirect("/login");
	});
});
