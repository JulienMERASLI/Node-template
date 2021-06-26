import { alert, DialogsState, loading } from "./dialogs.js";
import { stringify } from "./utilities.js";

export function fetchPOST(dialogsState: DialogsState, url: string, body: Record<string, unknown> | unknown[]) : Promise<Response> {
	let res: Promise<Response>;
	loading(dialogsState, () => res = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: stringify(body),
	}));
	return res;
}

export async function alertErrorMessage(dialogsState: DialogsState): Promise<void> {
	await alert(dialogsState, "Une erreur inattendue s'est produite. Veuillez réessayer plus tard");
}

export async function alertBadRequestMessage(dialogsState: DialogsState): Promise<void> {
	await alert(dialogsState, "Veuillez vérifier votre requête");
}

export async function checkResponse<T>(dialogsState: DialogsState, res: Response, okCb: () => T, onError?: () => void): Promise<T> {
	if (res.ok) {
		return okCb();
	}
	if (res.status === 400) {
		await alertBadRequestMessage(dialogsState);
	} else {
		await alertErrorMessage(dialogsState);
	}
	onError();
}
