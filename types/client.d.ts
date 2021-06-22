import "typed-query-selector/strict";
import { h, Fragment } from "preact";

declare global {
	interface HTMLElement {
		deleteButton: HTMLSpanElement;
		alreadySeen: boolean;
	}
}
