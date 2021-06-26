import { promisify } from "util";
import * as crypto from "crypto";
import { Request } from "express";
import { IUser } from "./userSchemaModel";
import { smtpTransport } from "../../server";
import { forgotPWMail, resetPWMail } from "./mailsResetPW";

export async function generateToken(): Promise<string> {
	const buf = await promisify(crypto.randomBytes)(20);
	return buf.toString("hex");
}

export function userExists(user: IUser, req: Request): boolean {
	if (!user) {
		req.session.messages.push("noUser");
		req.session.save();
		return false;
	}
	return true;
}

export function assignTokenToUser(user: IUser, token: string): Promise<IUser> {
	user.resetPasswordToken = token;
	user.resetPasswordExpires = Date.now() + 3600000;

	return user.save();
}

export async function sendForgotPWMail(user: IUser, token: string, req: Request): Promise<void> {
	const mailOptions = {
		...forgotPWMail(req.headers.host, token),
		to: user.email,
	};
	await smtpTransport.sendMail(mailOptions);
	req.session.messages.push("emailSent");
}

export async function assignNewPWAndRemoveToken(user: IUser, newPW: string): Promise<IUser> {
	user.PW = newPW;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	return user.save();
}

export async function sendResetPWMail(user: IUser, req: Request): Promise<void> {
	const mailOptions = {
		...resetPWMail,
		to: user.email,
	};
	await smtpTransport.sendMail(mailOptions);
	req.session.messages.push("PWModified");
}
