import { NextFunction, Request, Response } from "express";
import { app } from "../server";
import { RenderParams } from "../types/server";

app.use((req, res, next) => {
	if (!req.session.messages) req.session.messages = [];
	next();
});

export const alreadyConnected = (req: Request, res: Response, next: NextFunction): void => {
	if (req.user) {
		req.session.messages.push("alreadyConnected");
		return res.redirect("/profile");
	}
	next();
};

export const notConnected = (req: Request, res: Response, next: NextFunction): void => {
	if (req.user) return next();
	req.session.messages.push("notConnected");
	req.session.returnTo = req.url;
	if (req.method === "GET") return res.redirect("/login");
	res.status(401).send();
};

export const getMessages = (req: Request, params: Record<string, unknown>): void => {
	(req.session.messages || []).forEach(message => params[message] = true);
	req.session.messages = [];
};

export const getUserWithoutPW = (req: Request): Record<string, unknown> => {
	const user = { ...req.user };
	user.PW = user.__v = user._id = undefined;
	return user;
};

export function render(req: Request, res: Response, renderParams: RenderParams): void {
	getMessages(req, renderParams.options);
	res.render("view", renderParams);
}

export function isInQuery(req: Request, qs: string): boolean {
	return req.query[qs] === "true";
}
