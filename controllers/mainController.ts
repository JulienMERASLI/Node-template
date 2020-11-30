import * as Express from "express";
import { app } from "../server";

export const notConnected = (req: Express.Request, res: Express.Response, next: Express.NextFunction): void => {
	if (!req.user) {
		req.session.messages = ["notConnected"];
		req.session.returnTo = req.url;
		return res.redirect("/login");
	}
	return next();
};

app.use((req, res, next) => {
	if (!req.session.messages) req.session.messages = [];
	next();
});

app.get("/", (req, res) => {
	res.render("index", { user: req.user });
});

app.get("/help", (req, res) => {
	res.render("help", { user: req.user });
});

app.get("/profile", notConnected, async (req, res) => {
	const params = { user: req.user };

	const messages = req.session.messages || [];
	["alreadyConnected", "PWModified", "registered", "pageNotFound", "settingsChanged"].forEach(message => {
		if (messages.find(mes => mes === message)) {
			messages.shift();
			params[message] = true;
		}
	});

	res.render("profile", params);
});
