import { createContext } from "preact";
import { StateUpdater, useState } from "preact/hooks";
import { dialogsState } from "../sharedComponents/dialogs";

const contextNames = ["alertVisible", "alertText", "promptVisible", "promptText", "promptDefaultValue", "confirmVisible", "confirmText", "loadingVisible"] as const;
type ContextNames = typeof contextNames[number];
type InferFromName<T extends string> = T extends `${string}Visible` ? boolean : string

export type DialogsState = {
	[K in ContextNames]: {
		value: InferFromName<K>,
		setValue: StateUpdater<InferFromName<K>>
	}
}

export const DialogsStateContext = createContext({} as DialogsState);

export function createDialogsState(): DialogsState {
	const state = {} as Record<string, Record<string, unknown>>;
	contextNames.forEach(context => {
		const contextState = useState(context.includes("Visible") ? false : (context.includes("Cb") ? () => null : ""));
		state[context] = {};
		state[context].value = contextState[0];
		state[context].setValue = contextState[1];
	});
	return state as DialogsState;
}

export let closeAlert: () => void;
export function alert(message: unknown = ""): Promise<void> {
	return new Promise(resolve => {
		dialogsState.alertText.setValue(message.toString());
		dialogsState.alertVisible.setValue(true);
		closeAlert = () => resolve();
	});
}

export let closePrompt: (value: string) => void;
export function prompt(message: unknown = "", defaultValue: unknown = ""): Promise<string> {
	return new Promise(resolve => {
		dialogsState.promptText.setValue(message.toString());
		dialogsState.promptDefaultValue.setValue(defaultValue.toString());
		dialogsState.promptVisible.setValue(true);
		closePrompt = (value) => resolve(value);
	});
}

export let closeConfirm: (value: boolean) => void;
export function confirm(message: unknown = ""): Promise<boolean> {
	return new Promise(resolve => {
		dialogsState.confirmText.setValue(message.toString());
		dialogsState.confirmVisible.setValue(true);
		closeConfirm = (value) => resolve(value);
	});
}

export async function loading(cb: () => void): Promise<void> {
	dialogsState.loadingVisible.setValue(true);
	await Promise.resolve(cb());
	dialogsState.loadingVisible.setValue(false);
}
