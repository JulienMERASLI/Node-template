import { User } from "@prisma/client";
import Joi from "joi";
import { ActionFunction, Link, LinksFunction, LoaderFunction, MetaFunction, Session, useActionData } from "remix";
import { Username, Email, Validate, Password, FormWithLoading } from "~/components/formElements";
import { NotConnectedHeader } from "~/components/header";
import { Messages } from "~/components/messages";

import formStyles from "~/styles/forms.css";
import { db } from "~/utils/db.server";
import { addMessage, alreadyConnected, createUserSession, redirectWithMessage, register } from "~/utils/session.server";
import { badRequest } from "./login";

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: formStyles,
}];
export const meta: MetaFunction = () => ({ title: "Inscription" });

export function validateForm(body: Record<string, unknown>, required = true): body is User {
	const userSchema = Joi.object({
		username: Joi.string()
			.pattern(/^[A-Za-z0-9]+(?:[_][A-Za-z0-9]+)*$/)
			.min(2),
		password: Joi.string()
			.min(4),
		passwordConfirm: Joi.string()
			.min(4),
		email: Joi.string()
			.email(),
	});

	const { error } = userSchema.validate(body, { allowUnknown: true, presence: required ? "required" : "optional" });
	return typeof error === "undefined";
}

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	let username = form.get("username");
	let password = form.get("PW");
	let passwordConfirm = form.get("PWConfirm");
	let email = form.get("email");

	const fields = { username, password, passwordConfirm, email };

	if (!validateForm(fields)) return badRequest({ wrongDataFormat: true });
	({ username, password, passwordConfirm, email } = fields);
	if (password !== passwordConfirm) return badRequest({ passwordMismatch: true });
	const userExists = await db.user.findFirst({
		where: { username: username.toString() },
	});

	if (userExists) {
		return redirectWithMessage(request, "existingUser", "/login");
	}
	const user = await register(fields);
	if (!user) {
		return badRequest({ unexpectedError: true });
	}
	const session = await addMessage(request, "registered", true) as Session;
	return createUserSession(user.id, "/profile", session);
};

export const loader: LoaderFunction = ({ request }) => alreadyConnected(request);

export default function Register() {
	const messages = useActionData<Messages>();
	return (
		<>
			<NotConnectedHeader />
			<Messages messages={messages} />
			<FormWithLoading method="post">
				<h1 >S'inscrire</h1>
				<Username />
				<Password />
				<Password confirm={true} />
				<Email />
				<Validate />
				<p>Vous avez déjà un compte? <Link to="/login">Se connecter</Link></p>
			</FormWithLoading>
		</>
	);
}
