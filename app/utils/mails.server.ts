import { User } from "@prisma/client";
import * as nodemailer from "nodemailer";
import { Session } from "remix";
import { addMessage } from "./session.server";

const smtpTransport = nodemailer.createTransport({
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

const forgotPWMail = (host: string | null, token: string): { from: string, subject: string, text: string } => ({
	from: process.env.EMAIL as string,
	subject: "Réinitialisation de votre mot de passe - Template",
	text: `Bonjour,
Vous avez demandé une réinitialisation de votre mot de passe pour votre template.
Pour cela, veuillez cliquer sur ce lien et entrer votre nouveau mot de passe.
https://${host}/forgotPW/${token} 
Ce lien expire dans 1 heure.`,
});

export const resetPWMail = {
	from: process.env.EMAIL,
	subject: "Votre mot de passe a bien été modifié - Template",
	text: `Bonjour,
Votre mot de passe a bien été modifié pour votre template`,
};

export async function sendForgotPWMail(user: User, token: string, request: Request): Promise<nodemailer.SentMessageInfo> {
	const mailOptions = {
		...forgotPWMail(request.headers.get("Host"), token),
		to: user.email,
	};
	return smtpTransport.sendMail(mailOptions);
}

export async function sendResetPWMail(user: User, request: Request): Promise<Session> {
	const mailOptions = {
		...resetPWMail,
		to: user.email,
	};
	await smtpTransport.sendMail(mailOptions);
	return addMessage(request, "PWModified", true) as Promise<Session>;
}
