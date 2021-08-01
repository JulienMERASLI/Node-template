import { useRef } from "preact/hooks";

import { Username, Email, Validate, PWWithConfirm, PWConfirmError } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { getMessages } from "../sharedComponents/messages";

export default function Register(errors: Record<string, unknown>): JSX.Element {
	const form = useRef<HTMLFormElement>(null);
	const PWConfirmErrorRef = useRef<HTMLHeadingElement>(null);
	return (<>
		<NotConnectedHeader />
		{getMessages(errors)}
		<PWConfirmError ref={PWConfirmErrorRef} />
		<form action="/registered" method="post" ref={form}>
			<h1 >S'inscrire</h1>
			<Username />
			<PWWithConfirm form={form} errorMessage={PWConfirmErrorRef!} />
			<Email />
			<Validate />
			<p>Vous avez déjà un compte? <a href="/login">Se connecter</a></p>
		</form>
	</>);
}
