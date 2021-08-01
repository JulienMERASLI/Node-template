import { createContext } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { IUser } from "../../models/accounts/userSchemaModel";
import { Email, PWConfirmError, PWWithConfirm, Username, Validate, PWMatchContext } from "../sharedComponents/formsElements";
import { ConnectedHeader } from "../sharedComponents/header";
import { ErrorMessage } from "../sharedComponents/messages";
import { Overlay, OverlayContainer, OverlayContext } from "../sharedComponents/overlay";
import { addOnBeforeUnload, areSettingsModified, verifyPWAndSendNewParams } from "../forms/settingsValidator";
import { Dialogs } from "../sharedComponents/dialogs";

export const ConfirmPWOverlayVisibleContext = createContext<OverlayContext>({
	visible: false,
	setVisible: () => true,
});

export default function Settings({ user }: { user: IUser }): JSX.Element {
	const form = useRef<HTMLFormElement>(null);
	const PWConfirmErrorRef = useRef<HTMLHeadingElement>(null);
	const [confirmPWOverlayVisible, setConfirmPWOverlayVisible] = useState(false);
	const [PWMatch, setPWMatch] = useState(false);
	const [existingUserErrorVisible, setExistingUserErrorVisible] = useState(false);
	useEffect(() => {
		addOnBeforeUnload();
		return () => window.onbeforeunload = null;
	}, []);

	return (
		<ConfirmPWOverlayVisibleContext.Provider value={{
			visible: confirmPWOverlayVisible,
			setVisible: setConfirmPWOverlayVisible,
		}}>
			<main>
				<ConnectedHeader />
				<PWConfirmError ref={PWConfirmErrorRef} />
				<ErrorMessage style={{ display: existingUserErrorVisible ? "block" : "none" }}>Cet utilisateur existe déjà, veuillez modifier votre pseudo ou votre email.</ErrorMessage>
				<PWMatchContext.Provider value={setPWMatch}>
					<form id="modifyForm" ref={form}>
						<h1>Modifier les paramètres du compte</h1>
						<Username isRequired={false} placeholder={user.username} />
						<PWWithConfirm isRequired={false} form={form} errorMessage={PWConfirmErrorRef} placeholder={true} />
						<Email isRequired={false} placeholder={user.email} />
						<Validate onClick={() => PWMatch && areSettingsModified(form) && setConfirmPWOverlayVisible(true)} />
						<p><a href="/profile">Annuler</a></p>
					</form>
				</PWMatchContext.Provider>
			</main>
			<OverlayContainer>

				<Overlay
					id="confirmPWOverlay"
					title="Veuillez entrer votre ancien mot de passe"
					level={3}
					validateOnClick={overlay => verifyPWAndSendNewParams(overlay, setConfirmPWOverlayVisible, setExistingUserErrorVisible)}
					closeOnValidate={false}
					beforeOpening={(overlay) => {
						const error = overlay.querySelector(".error") as HTMLHeadingElement;
						error.style.display = "none";
					}}
					context={ConfirmPWOverlayVisibleContext}>
					<ErrorMessage level={4} style={{ display: "none" }}>Mot de passe erroné</ErrorMessage>
					<div class="inputContainer">
						<input type="password" id="oldPW" name="oldPW" placeholder="Ancien mot de passe" />
					</div>
				</Overlay>
				<Dialogs />
			</OverlayContainer>
		</ConfirmPWOverlayVisibleContext.Provider>
	);
}
