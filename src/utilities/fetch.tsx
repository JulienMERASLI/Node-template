import { alert, loading } from "./dialogs";
import { stringify } from "./utilities";

export function fetchPOST(url: string, body: Record<string, unknown> | unknown[]) : Promise<Response> {
	let res: Promise<Response> | undefined;
	loading(() => res = fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: stringify(body),
	}));
	return res as Promise<Response>;
}

export async function alertErrorMessage(): Promise<void> {
	await alert("Une erreur inattendue s'est produite. Veuillez réessayer plus tard");
}

export async function alertBadRequestMessage(): Promise<void> {
	await alert("Veuillez vérifier votre requête");
}

export async function checkResponse<T>(res: Response, okCb: () => T, onError?: () => void): Promise<T | void> {
	if (res.ok) {
		return okCb();
	}
	if (res.status === 400) {
		await alertBadRequestMessage();
	} else {
		await alertErrorMessage();
	}
	onError?.();
}
