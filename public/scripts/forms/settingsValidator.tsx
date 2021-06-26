import { Ref, StateUpdater } from "preact/hooks";
import { DialogsState } from "../utilities/dialogs.js";
import { fetchPOST } from "../utilities/fetch.jsx";

let form: HTMLFormElement;
function getAllInputs() {
	const body = {};

	Array.from(form.querySelectorAll("input")).forEach(input => {
		if (input.type === "submit") return;
		if (input.value === null || input.value === "") return;
		if (input.type !== "password" && input.value === input.placeholder) return;
		body[input.name] = input.value;
	});

	return body;
}

if (location.href === "/settings") {
	window.onbeforeunload = (e) => {
		if (Object.keys(getAllInputs()).length > 0) {
			e.preventDefault();
			e.returnValue = "";
		}
	};
}

export function areSettingsModified(formRef: Ref<HTMLFormElement>): boolean {
	form = formRef.current;
	const body = getAllInputs();
	if (Object.keys(body).length > 0) return true;
	window.location.href = "/profile?settingsChanged=true";
}

function errorHappened(error: HTMLHeadingElement, PW: HTMLInputElement, errorText = "Une erreur inattendue s'est produite. Veuillez réessayer plus tard") {
	error.innerText = errorText;
	error.style.display = "block";
	PW.value = "";
	return errorText;
}

export async function verifyPWAndSendNewParams(dialogsState: DialogsState, overlay: HTMLDivElement, setConfirmPWOverlayVisible: StateUpdater<boolean>, setExistingUserErrorVisible: StateUpdater<boolean>): Promise<void> {
	const error = overlay.querySelector(".error") as HTMLHeadingElement;
	const body = getAllInputs();
	const oldPW = document.querySelector("input#oldPW");

	fetchPOST(dialogsState, "/verifyPW", {
		PW: oldPW.value,
	})
		.then(res => {
			if (res.ok) {
				return res.json();
			}
			errorHappened(error, oldPW);
		})
		.then(value => {
			if (value === true) {
				fetch("/settings", {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body),
				})
					.then((res) => {
						if (res.ok) {
							console.log(res.status, res.statusText);
							window.onbeforeunload = null;
							window.location.href = "/profile";
						} else if (res.status === 400) {
							setConfirmPWOverlayVisible(false);
							setExistingUserErrorVisible(true);
							scrollTo({
								top: 0,
							});
						}
						else errorHappened(error, oldPW);
					});
			}
			else if (error.style.display === "none") errorHappened(error, oldPW, "Mot de passe erroné");
		});
}
