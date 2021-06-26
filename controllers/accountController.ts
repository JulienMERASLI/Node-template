/// <reference path="../types/server.d.ts" />

import * as passport from "passport";
import * as bcrypt from "bcryptjs";
import { app } from "../server";
import { User } from "../models/accounts/userSchemaModel";
import { alreadyConnected, notConnected, render } from "./helpers";
import "../models/accounts/passportModel";
import { createFolders, createUser, validateForm } from "../models/accounts/registration";
import { modifySettings } from "../models/accounts/modifySettings";
import { assignNewPWAndRemoveToken, assignTokenToUser, generateToken, sendForgotPWMail, sendResetPWMail, userExists } from "../models/accounts/resetPW";

app.get("/login", alreadyConnected, (req, res) => {
	render(req, res, {
		title: "Connexion",
		css: "forms",
		js: "forms/login",
		options: {},
	});
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

app.get("/register", alreadyConnected, (req, res) => {
	render(req, res, {
		title: "Inscription",
		css: "forms",
		js: "forms/register",
		options: {},
	});
});

app.post("/registered", async (req, res) => {
	try {
		validateForm(req.body);
		const user = await createUser(req.body, req, res);
		if (typeof user !== "undefined") {
			await createFolders(user);

			req.login(user, error => {
				if (error) console.error(error);
				req.session.messages.push("registered");
				req.session.save();
				return res.redirect("/profile");
			});
		}
	}
	catch (err) {
		console.log(err);
		req.session.messages.push("wrongDataFormat");
		req.session.save();
		return res.redirect("/register");
	}
});

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

app.get("/settings", notConnected, (req, res) => {
	render(req, res, {
		title: "Paramètres",
		css: "forms",
		js: "forms/settings",
		options: {
			user: req.user,
		},
	});
});

app.patch("/settings", notConnected, async (req, res) => {
	const oldUser = req.user;
	const newUser = req.body;
	try {
		await modifySettings(oldUser, newUser);
	} catch {
		res.status(400).send();
	}
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
	render(req, res, {
		title: "Mot de passe oublié",
		css: "forms",
		js: "forms/forgotPW",
		options: {},
	});
});

app.post("/forgotPW", async (req, res) => {
	try {
		const token = await generateToken();
		const user = await User.findOne({ email: req.body.email }).exec();
		if (!userExists(user, req)) {
			return res.redirect("/forgotPW");
		}

		await assignTokenToUser(user, token);

		await sendForgotPWMail(user, token, req);
		return res.redirect("/login");
	} catch (err) {
		if (err) console.error(err);
		res.redirect("/forgotPW");
	}
});

app.get("/resetPW/:token", alreadyConnected, async (req, res) => {
	const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
	if (!user) {
		req.session.messages.push("invalidToken");
		return res.redirect("/forgotPW");
	}
	render(req, res, {
		title: "Réinitialisation du mot de passe",
		css: "forms",
		js: "forms/resetPW",
		options: { token: req.params.token },
	});
});

app.post("/resetPW/:token", async (req, res) => {
	if (req.body.PW.length < 4) {
		req.session.messages.push("wrongDataFormat");
		req.session.save();
		return res.redirect("/resetPW");
	}
	try {
		const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec();
		if (!user) {
			req.session.messages.push("invalidToken");
			return res.redirect("/forgotPW");
		}
		await assignNewPWAndRemoveToken(user, req.body.PW);
		req.login(user, async () => {
			await sendResetPWMail(user, req);
			return res.redirect("/profile");
		});
	} catch (err) {
		console.error(err);
		res.redirect("/login");
	}
});
