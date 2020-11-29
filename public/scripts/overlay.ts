/**
 * Delete all content from inputs
 * @param {HTMLElement} overlay the overlay with the inputs
 */
export function clearInputs(overlay: HTMLElement): void {
	Array.from(overlay.getElementsByTagName("input")).forEach(v => {
		v.value = v.defaultValue;
		if (v.type === "checkbox") v.checked = v.defaultChecked;
	});
}

/**
 * Close the opened overlay
 * @param {HTMLElement} overlay the opened overlay
 * @param {HTMLElement} content page content under the overlay
 */
export function closeOverlay(overlay: HTMLElement, content: HTMLElement): void {
	document.getElementById("overlay").classList.remove("visible");
	overlay.classList.remove("visible");
	content.classList.remove("sousOverlay");
	document.body.style.overflow = "auto";
	clearInputs(overlay);
}

export function showOverlay(id: string, content: HTMLElement, closeOnValidate: boolean, validateOnClick: () => void): void {
	const overlay = document.getElementById(id);
	document.getElementById("overlay").classList.add("visible");

	overlay.classList.add("visible");
	content.classList.add("sousOverlay");
	document.body.style.overflow = "hidden";

	const validate = overlay.querySelector("input[type=submit]") as HTMLInputElement;

	window.onkeydown = (e) => {
		if (e.key === "Enter") {
			validate.onclick(null);
		}
		else if (e.key === "Escape") {
			closeOverlay(overlay, content);
		}
	};

	if (validate) {
		validate.onclick = () => {
			validateOnClick();
			if (closeOnValidate) {
				closeOverlay(overlay, content);
			}
		};
	}
}
