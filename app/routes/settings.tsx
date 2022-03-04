import { createContext, useRef, useState, useEffect } from "react";
import { ActionFunction, Link, LinksFunction, LoaderFunction, MetaFunction, redirect, useActionData, useFetcher, useOutletContext, useSubmit } from "remix";
import { OutletContext } from "remix.env";
import bcrypt from "bcryptjs";
import { Dialogs } from "~/components/dialogs";
import { Username, Email, Validate, Password, FormWithLoading } from "~/components/formElements";
import { ConnectedHeader } from "~/components/header";
import { Messages } from "~/components/messages";
import { OverlayContext, OverlayContainer, Overlay } from "~/components/overlay";
import { db } from "~/utils/db.server";
import { getUser, notConnected, redirectWithMessage } from "~/utils/session.server";
import { badRequest } from "./login";
import { validateForm } from "./register";
import formStyles from "~/styles/forms.css";
import { toggleLoading } from "~/utils/dialogs";

export const ConfirmPWOverlayVisibleContext = createContext<OverlayContext>({
	visible: false,
	setVisible: () => true,
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: formStyles }];
export const meta: MetaFunction = () => ({ title: "Paramètres" });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	let username = form.get("username");
	let password = form.get("PW");
	const passwordConfirm = form.get("PWConfirm");
	let email = form.get("email");
	const passwordMatch = form.get("passwordMatch") === "true";

	if (password !== passwordConfirm) return badRequest({ passwordMismatch: true });
	const fields = { username, password, email };
	if (Object.values(fields).every(field => field === "")) return redirect("/profile");
	const fieldsToChange = Object.entries(fields).reduce((fieldsNonEmpty, [key, value]) => {
		if (value === "") return fieldsNonEmpty;
		return {
			...fieldsNonEmpty,
			[key]: value,
		};
	}, {});

	if (!validateForm(fieldsToChange, false)) return badRequest({ wrongDataFormat: true });
	({ username, password, email } = {
		...fields,
		...fieldsToChange,
	});
	const user = await getUser(request);
	if (!user) return badRequest({ notConnected: true });

	if (email !== "" && email !== user.email) {
		const existingUser = await db.user.findUnique({
			where: { email },
		});
		if (existingUser) return badRequest({ existingEmail: true });
	}
	if (username !== "" && username !== user.username) {
		const existingUser = await db.user.findUnique({
			where: { username },
		});
		if (existingUser) return badRequest({ existingUsername: true });
	}
	if (password !== "") {
		const passwordHash = await bcrypt.hash(password, 10);
		fieldsToChange.password = passwordHash;
	}
	if (!passwordMatch) return {};
	await db.user.update({
		where: { id: user.id },
		data: fieldsToChange,
	});
	return redirectWithMessage(request, "settingsChanged", "/profile");
};

export const loader: LoaderFunction = ({ request }) => notConnected(request);

export default function () {
	const [confirmPWOverlayVisible, setConfirmPWOverlayVisible] = useState(false);
	const [passwordMatch, setPasswordMatch] = useState(false);
	const submit = useSubmit();
	const form = useRef<HTMLFormElement>(null);
	const actionData = useActionData();
	const { user } = useOutletContext<OutletContext>();
	const messages = useActionData<Messages>();
	const confirmPWFetcher = useFetcher();
	useEffect(() => {
		if (typeof actionData !== "undefined" && Object.keys(actionData).length === 0) {
			setConfirmPWOverlayVisible(true);
		}
	}, [actionData]);
	useEffect(() => {
		if (passwordMatch) {
			window.onbeforeunload = null;
			submit(form.current);
		}
	}, [passwordMatch]);

	useEffect(() => {
		if (confirmPWFetcher.type === "done") {
			setPasswordMatch(confirmPWFetcher.data.isPasswordCorrect);
		}
	}, [confirmPWFetcher]);

	useEffect(() => {
		toggleLoading(confirmPWFetcher.state === "submitting");
	}, [confirmPWFetcher]);

	return (
		<ConfirmPWOverlayVisibleContext.Provider value={{
			visible: confirmPWOverlayVisible,
			setVisible: setConfirmPWOverlayVisible,
		}}>
			<main>
				<ConnectedHeader />
				<Messages messages={messages} />
				<FormWithLoading id="modifyForm" method="post" ref={form}>
					<h1>Modifier les paramètres du compte</h1>
					<input type="hidden" name="passwordMatch" value={passwordMatch.toString()} />
					<Username isRequired={false} placeholder={user.username} />
					<Password isRequired={false} placeholder={true} />
					<Password confirm={true} isRequired={false} placeholder={true} />
					<Email isRequired={false} placeholder={user.email} />
					<Validate />
					<p><Link to="/profile">Annuler</Link></p>
				</FormWithLoading>
			</main>
			<OverlayContainer>

				<Overlay
					id="confirmPWOverlay"
					title="Veuillez entrer votre ancien mot de passe"
					level={3}
					noValidate={true}
					closeOnValidate={false}
					context={ConfirmPWOverlayVisibleContext}>
					<Messages messages={confirmPWFetcher?.data?.messages} level={4} />
					<div className="inputContainer">
						<confirmPWFetcher.Form method="post" action="/verifyPW" id="confirmPWForm">
							<input type="password" id="oldPW" name="oldPW" placeholder="Ancien mot de passe" />
							<input type="submit" value="Valider" className="validate rounded" />
						</confirmPWFetcher.Form>
					</div>
				</Overlay>
				<Dialogs />
			</OverlayContainer>
		</ConfirmPWOverlayVisibleContext.Provider>
	); }
