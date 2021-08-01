import { useRef } from "preact/hooks";

import { PWConfirmError, PWWithConfirm, Validate } from "../sharedComponents/formsElements";
import { NotConnectedHeader } from "../sharedComponents/header";
import { getMessages } from "../sharedComponents/messages";

export default function ResetPW({ token, ...errors }: { token: string } & Record<string, unknown>): JSX.Element {
	const form = useRef<HTMLFormElement>(null);
	const PWConfirmErrorRef = useRef<HTMLHeadingElement>(null);

	return (<>
		<NotConnectedHeader />
		{getMessages(errors)}
		<PWConfirmError ref={PWConfirmErrorRef} />
		<form ref={form} action={`/resetPW/${token}`} method="POST">
			<h1>Réinitialisation du mot de passe</h1>
			<PWWithConfirm isNew={true} form={form} errorMessage={PWConfirmErrorRef} />
			<Validate />
			<p><a href="/login">Se connecter</a></p>
		</form>
	</>
	);
}
