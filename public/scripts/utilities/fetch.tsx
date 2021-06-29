import { alert, DialogsState, loading } from "./dialogs.js";
import { stringify } from "./utilities.js";

export function fetchPOST(url: string, body: Record<string, unknown> | unknown[]) : Promise<Response> {
	let res: Promise<Response>;
	loading(() => res = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: stringify(body),
	}));
	return res;
}

export async function alertErrorMessage(): Promise<void> {
	await alert("Une erreur inattendue s'est produite. Veuillez réessayer plus tard");
}

export async function alertBadRequestMessage(): Promise<void> {
	await alert("Veuillez vérifier votre requête");
}

export async function checkResponse<T>(res: Response, okCb: () => T, onError?: () => void): Promise<T> {
	if (res.ok) {
		return okCb();
	}
	if (res.status === 400) {
		await alertBadRequestMessage();
	} else {
		await alertErrorMessage();
	}
	onError();
}
