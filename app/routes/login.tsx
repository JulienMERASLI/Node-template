import {
	useActionData,
	json,
	useSearchParams,
	LoaderFunction,
	Link,
	MetaFunction,
	useLoaderData,
} from "remix";
import { useEffect, useState } from "react";
import type { ActionFunction, LinksFunction } from "remix";

import { alreadyConnected, createUserSession, getMessages, login } from "~/utils/session.server";
import formStyles from "~/styles/forms.css";
import { Messages } from "~/components/messages";
import { Email, FormWithLoading, Password, Username, Validate } from "~/components/formElements";
import { NotConnectedHeader } from "~/components/header";
import { OverlayContainer } from "~/components/overlay";
import { Dialogs } from "~/components/dialogs";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: formStyles }];
export const meta: MetaFunction = () => ({ title: "Connexion" });

export const badRequest = (errors: Messages, inMessages = false) => json(inMessages ? { messages: errors } : errors, { status: 400 });
export const action: ActionFunction = async ({
	request,
}) => {
	const form = await request.formData();
	const username = form.get("username");
	const email = form.get("email");
	const password = form.get("PW");
	const returnTo = form.get("returnTo");
	const connectionMethod = form.get("connectionMethod");
	if (
		(typeof username !== "string" && typeof email !== "string")
		|| typeof password !== "string"
		|| typeof returnTo !== "string"
		|| typeof connectionMethod !== "string"
	) {
		return badRequest({ wrongDataFormat: true });
	}
	const user = await login({ usernameOrEmail: (username || email) as string, password }, connectionMethod);
	if (typeof user === "string") {
		return badRequest({ [user]: true });
	}
	return createUserSession(user.id, returnTo);
};

type LoaderData = {
	messages: Messages;
}
export const loader: LoaderFunction = async ({ request }) => {
	const isAlreadyConnected = await alreadyConnected(request);
	if (isAlreadyConnected) return isAlreadyConnected;
	const messages = await getMessages(request);
	return { messages };
};

export default function Login() {
	const messages = {
		...useActionData<Messages>(),
		...useLoaderData<LoaderData>().messages,
	};

	const [searchParams] = useSearchParams();

	const [connectWithUsername, setConnect] = useState(true);
	function setConnectionMethod() {
		setConnect(!connectWithUsername);
		localStorage.setItem("preferedConnection", connectWithUsername === true ? "email" : "username");
	}
	useEffect(() => {
		const preferedConnection = localStorage.getItem("preferedConnection") ?? "username";
		setConnect(preferedConnection ? preferedConnection === "username" : true);
	}, []);
	return (<>
		<NotConnectedHeader />
		<Messages messages={messages} />
		<main>
			<FormWithLoading method="post">
				<h1>Se connecter</h1>
				<div>
					<button type="button" id="changeConnectionType" className="blue" onClick={() => setConnectionMethod()}>Se connecter avec {connectWithUsername === true ? "l'email" : "le pseudo"}</button>
				</div>
				<input type="hidden" name="connectionMethod" value={connectWithUsername === true ? "username" : "email"} />
				<input type="hidden" name="returnTo" value={searchParams.get("returnTo") ?? "/profile"} />
				{connectWithUsername ? <Username /> : <Email />}
				<Password />
				<Validate />
				<p><Link to="/forgotPW">Mot de passe oublié</Link></p>
				<p>C'est votre première fois ici? <Link to="/register">S'inscrire</Link></p>
			</FormWithLoading>
		</main>
		<OverlayContainer>
			<Dialogs />
		</OverlayContainer>
	</>
	);
}
