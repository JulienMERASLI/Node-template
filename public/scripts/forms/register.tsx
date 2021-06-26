import { useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { Username, Email, Validate, PWWithConfirm, PWConfirmError } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { ErrorMessage } from "../sharedComponents/messages";

export default function Register(errors: Record<string, unknown>): JSX.Element {
	const form = useRef<HTMLFormElement>(null);
	const PWConfirmErrorRef = useRef<HTMLHeadingElement>(null);

	return (<>
		<NotConnectedHeader></NotConnectedHeader>
		{errors.wrongDataFormat && <ErrorMessage>Veuillez respecter le format des champs</ErrorMessage>}
		<PWConfirmError ref={PWConfirmErrorRef} />
		<form action="/registered" method="post" ref={form}>
			<h1 >S'inscrire</h1>
			<Username />
			<PWWithConfirm form={form} errorMessage={PWConfirmErrorRef} />
			<Email />
			<Validate />
			<p>Vous avez déjà un compte? <a href="/login">Se connecter</a></p>
		</form>
	</>);
}
