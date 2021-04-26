import "typed-query-selector/strict";
import "dom-chef";

declare global {
	interface HTMLElement {
		deleteButton: HTMLSpanElement;
		alreadySeen: boolean;
	}
}
