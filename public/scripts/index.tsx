/// <reference path="../../types/client.d.ts" />
import { useState, useEffect } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
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

function App({ test }: { test: string }): JSX.Element {
	// Create the count state.
	const [count, setCount] = useState(0);
	// Create the counter (+1 every second).
	useEffect(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000);
		return () => clearTimeout(timer);
	}, [count, setCount]);
	// Return the App component.
	return (
		<div className="App">
			<header className="App-header">
				<p>
          Edit <code>src/App.jsx</code> and save to reload.{test}
				</p>
				<p>
          Page has been open for <code>{count}</code> seconds.
				</p>
				<p>
					<a
						className="App-link"
						href="https://preactjs.com"
						target="_blank"
						rel="noopener noreferrer"
					>
            Learn Preact
					</a>
				</p>
			</header>
		</div>
	);
}
render(<App test="oui"></App>, document.body);
