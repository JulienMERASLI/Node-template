import { closeOverlay, showOverlay } from "./overlay.js";

const alertText = document.getElementById("alertText");
export function alert(message: unknown = ""): Promise<void> {
	return new Promise(resolve => {
		alertText.innerText = message.toString();
		const main = document.querySelector("main");
		showOverlay("alertOverlay", main, true, () => resolve());
	});
}

const promptText = document.getElementById("promptText");
const promptInput = document.querySelector("input#promptInput");
export function prompt(message: unknown = "", defaultValue: unknown = ""): Promise<string> {
	return new Promise(resolve => {
		promptText.innerText = message.toString();
		promptInput.value = defaultValue.toString();
		const main = document.querySelector("main");
		const promptOverlay = document.getElementById("promptOverlay");
		const cancel = promptOverlay.querySelector("button.cancel");
		showOverlay("promptOverlay", main, true, () => resolve(promptInput.value));
		promptInput.focus();
		cancel.onclick = () => {
			closeOverlay(promptOverlay, main);
			resolve("");
		};
	});
}

const confirmText = document.getElementById("confirmText");
export function confirm(message: unknown): Promise<boolean> {
	return new Promise(resolve => {
		confirmText.innerText = message.toString();
		const main = document.querySelector("main");
		const confirmOverlay = document.getElementById("confirmOverlay");
		const cancel = confirmOverlay.querySelector("button.cancel");
		setTimeout(() => {
			showOverlay("confirmOverlay", main, true, () => resolve(true));
			cancel.onclick = () => {
				closeOverlay(confirmOverlay, main);
				resolve(false);
			};
		}, 0);
	});
}

export async function loading(cb: () => void, removeContainer = true): Promise<void> {
	const main = document.querySelector("main");
	showOverlay("loadingOverlay", main, false, null);
	await Promise.resolve(cb());
	closeOverlay(document.getElementById("loadingOverlay"), main, removeContainer);
}
