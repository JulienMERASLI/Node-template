import "typed-query-selector/strict";
import React from "dom-chef";

declare global {
	interface HTMLElement {
		deleteButton: HTMLSpanElement;
		alreadySeen: boolean;
	}
}
