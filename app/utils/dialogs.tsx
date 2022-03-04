import { createContext, useState } from "react";

import { State } from "~/components/overlay";

const contextNames = ["alertVisible", "alertText", "promptVisible", "promptText", "promptDefaultValue", "confirmVisible", "confirmText", "loadingVisible"] as const;
type ContextNames = typeof contextNames[number];
type InferFromName<T extends string> = T extends `${string}Visible` ? boolean : string
export type DialogsStateElement<K extends string> = State<InferFromName<K>, "value">;
export type DialogsState = {
	[K in ContextNames]: DialogsStateElement<K>;
}

export const DialogsStateContext = createContext({} as DialogsState);
let dialogsState: DialogsState;
export function createDialogsState(): DialogsState {
	const state = {} as Record<string, Record<string, unknown>>;
	contextNames.forEach(context => {
		const contextState = useState(context.includes("Visible") ? false : (context.includes("Cb") ? () => null : ""));
		state[context] = {};
		state[context].value = contextState[0];
		state[context].setValue = contextState[1];
	});
	dialogsState = state as DialogsState;
	return dialogsState;
}
type PossibleTypes = string | number | boolean;
export let closeAlert: () => void;
export function alert(message: PossibleTypes = ""): Promise<void> {
	return new Promise(resolve => {
		dialogsState.alertText.setValue(message.toString());
		dialogsState.alertVisible.setValue(true);
		closeAlert = () => resolve();
	});
}

export let closePrompt: (value: string | null) => void;
export function prompt(message: PossibleTypes = "", defaultValue: PossibleTypes = ""): Promise<string | null> {
	return new Promise(resolve => {
		dialogsState.promptText.setValue(message.toString());
		dialogsState.promptDefaultValue.setValue(defaultValue.toString());
		dialogsState.promptVisible.setValue(true);
		closePrompt = (value) => resolve(value);
	});
}

export let closeConfirm: (value: boolean) => void;
export function confirm(message: PossibleTypes = ""): Promise<boolean> {
	return new Promise(resolve => {
		dialogsState.confirmText.setValue(message.toString());
		dialogsState.confirmVisible.setValue(true);
		closeConfirm = (value) => resolve(value);
	});
}

export function toggleLoading(open: boolean): void {
	dialogsState.loadingVisible.setValue(open);
}
export async function loading(cb: () => void): Promise<void> {
	toggleLoading(true);
	await Promise.resolve(cb());
	toggleLoading(false);
}
