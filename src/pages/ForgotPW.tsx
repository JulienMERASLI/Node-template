import { Email, Validate } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { getMessages } from "../sharedComponents/messages";

export default function ForgotPW(errors: Record<string, unknown>): JSX.Element {
	return (<>
		<NotConnectedHeader />
		{getMessages(errors)}
		<form action="/forgotPW" method="POST">
			<h1>Mot de passe oublié</h1>
			<Email />
			<Validate />
			<p><a href="/login">Se connecter</a></p>
		</form>
	</>
	);
}
