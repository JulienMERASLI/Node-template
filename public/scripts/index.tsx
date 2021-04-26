/// <reference path="../../types/client.d.ts" />

import { isElementVisible } from "./utilities.js";

if (!navigator.onLine) {
	const withoutConnection = document.getElementById("withoutConnection");
	if (!withoutConnection) {
		const div = document.createElement("div");
		div.innerHTML = "<a href=\"/project?withoutConnection\" id=\"withoutConnection\">Essayer le site sans compte</a>";
		const footer = document.querySelector("footer");
		document.body.insertBefore(div, footer);
	}

	const navUl = document.querySelector("header").querySelector("nav").firstElementChild;
	Array.from(navUl.children).slice(1).forEach(a => a.remove());
}

const paragraphs = document.querySelectorAll("section.paragraph");
function showParagraphs() {
	paragraphs.forEach(section => {
		if (!section.alreadySeen) {
			const p = section.querySelector("p");
			const visible = isElementVisible(p);
			section.classList.toggle("visible", visible);
			section.alreadySeen = visible;
		}
	});
}
window.onscroll = showParagraphs;
showParagraphs();