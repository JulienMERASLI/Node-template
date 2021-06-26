import { Request, Response } from "express";
import * as Joi from "joi";
import * as fs from "fs/promises";
import { IUser, User } from "./userSchemaModel";

export function validateForm(body: IUser): Promise<void> {
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

	return userSchema.validateAsync(body, { allowUnknown: true });
}

async function isUserNonExistant(user: IUser, req: Request, res: Response) {
	const queryResult = await User.find({ username: user.username }).exec();
	if (queryResult.length) {
		req.session.messages.push("existingUser");
		return res.redirect("/login");
	}
	if ((await User.find({ email: user.email }).exec())[0]) {
		req.session.messages.push("existingUser");
		return res.redirect("/login");
	}
	return true;
}

export async function createUser(body: IUser, req: Request, res: Response): Promise<IUser | void> {
	const user = new User({ username: body.username, PW: body.PW, email: body.email });
	if (await isUserNonExistant(user, req, res)) {
		await user.save();
		return user;
	}
}

export async function createFolders(user: IUser): Promise<void> {
	await fs.mkdir(`./files/${user.username}`);
	await fs.mkdir(`./files/${user.username}/projects`);
}
