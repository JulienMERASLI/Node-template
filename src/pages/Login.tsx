import { useState } from "preact/hooks";

import { Email, PW, Username, Validate } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { getMessages } from "../sharedComponents/messages";

export default function Login(errors: Record<string, unknown>): JSX.Element {
	const preferedConnection = typeof localStorage !== "undefined" ? localStorage.getItem("preferedConnection") : "username";
	const [connectWithUsername, setConnect] = useState(preferedConnection ? preferedConnection === "username" : true);
	function setConnectionMethod() {
		setConnect(!connectWithUsername);
		localStorage.setItem("preferedConnection", connectWithUsername === true ? "email" : "username");
	}
	return (<>
		<NotConnectedHeader />
		{getMessages(errors)}
		<form action="/connected" method="POST">
			<h1>Se connecter</h1>
			<div>
				<button type="button" id="changeConnectionType" class="blue" onClick={() => setConnectionMethod()}>Se connecter avec {connectWithUsername === true ? "l'email" : "le pseudo"}</button>
			</div>
			{connectWithUsername ? <Username /> : <Email />}
			<PW />
			<Validate />
			<p><a href="/forgotPW">Mot de passe oublié</a></p>
			<p>C'est votre première fois ici? <a href="/register">S'inscrire</a></p>
		</form>
	</>
	);
}