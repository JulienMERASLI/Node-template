import { JSX } from "preact/jsx-runtime";
import { Email, Validate } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { ErrorMessage } from "../sharedComponents/messages";

export default function ForgotPW(errors: Record<string, unknown>): JSX.Element {
	return (<>
		<NotConnectedHeader></NotConnectedHeader>
		{errors.noUser && <ErrorMessage>Aucun utilisateur n'est associé à cet email</ErrorMessage>}
		{errors.invalidToken && <ErrorMessage>URL invalide</ErrorMessage>}
		<form action="/forgotPW" method="POST">
			<h1>Mot de passe oublié</h1>
			<Email />
			<Validate />
			<p><a href="/login">Se connecter</a></p>
		</form>
	</>
	);
}
