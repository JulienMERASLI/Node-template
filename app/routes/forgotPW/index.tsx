import { ActionFunction, Link, useActionData } from "remix";
import util from "util";
import crypto from "crypto";
import { User } from "@prisma/client";
import { Email, FormWithLoading, Validate } from "~/components/formElements";
import { db } from "~/utils/db.server";
import { redirectWithMessage } from "~/utils/session.server";
import { badRequest } from "../login";
import { sendForgotPWMail } from "~/utils/mails.server";
import { Messages } from "~/components/messages";

export async function generateToken(): Promise<string> {
	const buf = await util.promisify(crypto.randomBytes)(20);
	return buf.toString("hex");
}

export function assignTokenToUser(user: User, token: string): Promise<User> {
	return db.user.update({
		where: { id: user.id },
		data: {
			resetPasswordExpires: Date.now() + 3600000,
			resetPasswordToken: token,
		},
	});
}

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const email = form.get("email");
	if (typeof email !== "string") return badRequest({ wrongDataFormat: true });
	const user = await db.user.findUnique({
		where: { email },
	});
	if (!user) return badRequest({ noUser: true });
	let token: string;
	let userWithToken: User | null;

	do {
		token = await generateToken();
		userWithToken = await db.user.findFirst({
			where: { resetPasswordToken: token },
		});
	} while (userWithToken);

	await assignTokenToUser(user, token);

	await sendForgotPWMail(user, token, request);
	return redirectWithMessage(request, "emailSent", "/login");
};

export default function () {
	const messages = useActionData<Messages>();
	return (
		<>
			<Messages messages={messages} />
			<FormWithLoading method="post">
				<h1>Mot de passe oublié</h1>
				<Email />
				<Validate />
				<p><Link to="/login">Se connecter</Link></p>
			</FormWithLoading>
		</>
	);
}
