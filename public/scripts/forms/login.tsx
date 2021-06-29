import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { Email, PW, Username, Validate } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { ErrorMessage, InformationMessage } from "../sharedComponents/messages";

export default function Login(errors: Record<string, unknown>): JSX.Element {
	const preferedConnection = localStorage.getItem("preferedConnection");
	const [connectWithUsername, setConnect] = useState(preferedConnection ? preferedConnection === "username" : true);
	function setConnectionMethod() {
		setConnect(!connectWithUsername);
		localStorage.setItem("preferedConnection", connectWithUsername === true ? "email" : "username");
	}
	return (<>
		<NotConnectedHeader></NotConnectedHeader>
		{errors.wrongID && <ErrorMessage>Pseudo ou mot de passe erroné</ErrorMessage>}
		{errors.existingUser && <ErrorMessage>Cet utilisateur existe déjà, veuillez vous connecter</ErrorMessage>}
		{errors.notConnected && <ErrorMessage>Veuillez vous connecter pour acceder à cette page</ErrorMessage>}
		{errors.emailSent && <InformationMessage>Un email a été envoyé avec un lien pour réinitialiser votre mot de passe</InformationMessage>}
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
