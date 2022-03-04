import Joi from "joi";
import { ActionFunction, Link, LoaderFunction, useActionData } from "remix";
import bcrypt from "bcryptjs";
import { FormWithLoading, Password, Validate } from "~/components/formElements";
import { Messages } from "~/components/messages";
import { db } from "~/utils/db.server";
import { sendResetPWMail } from "~/utils/mails.server";
import { createUserSession, login, redirectWithMessage } from "~/utils/session.server";
import { badRequest } from "../login";

export const loader: LoaderFunction = async ({ request, params: { token } }) => {
	if (typeof token === "undefined") return redirectWithMessage(request, "unexpectedError", "/forgotPW");
	const user = await db.user.findUnique({
		where: { resetPasswordToken: token },
	});
	if (!user || (user.resetPasswordExpires as bigint) < Date.now()) return redirectWithMessage(request, "invalidToken", "/forgotPW");
	return null;
};

export function validatePassword(password: FormDataEntryValue | null): password is string {
	const schema = Joi.string()
		.min(4);
	const { error } = schema.validate(password);
	return typeof error === "undefined";
}

export const action: ActionFunction = async ({ request, params: { token } }) => {
	if (typeof token === "undefined") return badRequest({ unexpectedError: true });
	const form = await request.formData();
	const password = form.get("PW");
	const passwordConfirm = form.get("PWConfirm");

	if (!validatePassword(password) || !validatePassword(passwordConfirm)) return badRequest({ wrongDataFormat: true });
	if (password !== passwordConfirm) return badRequest({ passwordMismatch: true });
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await db.user.update({
		where: { resetPasswordToken: token },
		data: {
			resetPasswordToken: null,
			resetPasswordExpires: null,
			password: passwordHash,
		},
	});
	login({ usernameOrEmail: user.username, password }, "username");

	const session = await sendResetPWMail(user, request);
	return createUserSession(user.id, "/profile", session);
};

export default function () {
	const messages = useActionData<Messages>();

	return (
		<>
			<Messages messages={messages} />
			<FormWithLoading method="post">
				<h1>Réinitialisation du mot de passe</h1>
				<Password isNew={true} />
				<Password confirm={true} isNew={true} />
				<Validate />
				<p><Link to="/login">Se connecter</Link></p>
			</FormWithLoading>
		</>
	);
}
