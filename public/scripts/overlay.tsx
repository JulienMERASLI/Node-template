/**
 * Delete all content from inputs
 * @param {HTMLElement} overlay the overlay with the inputs
 */
export function clearInputs(overlay: HTMLElement): void {
	Array.from(overlay.getElementsByTagName("input")).forEach(v => {
		v.value = v.defaultValue;
		if (v.type === "checkbox") v.checked = v.defaultChecked;
		v.blur();
	});
}

/**
 * Close the opened overlay
 * @param {HTMLElement} overlay the opened overlay
 * @param {HTMLElement} content page content under the overlay
 */
export function closeOverlay(overlay: HTMLElement, content: HTMLElement, removeContainer = true): void {
	if (removeContainer) {
		document.getElementById("overlay").classList.remove("visible");
		content.classList.remove("behindOverlay");
		document.body.style.overflow = "auto";
		window.onkeydown = null;
	}

	overlay.classList.remove("visible");
	clearInputs(overlay);
}

export function showOverlay(id: string, content: HTMLElement, closeOnValidate: boolean, validateOnClick: () => void, validateCondition = () => true): void {
	const overlay = document.getElementById(id);
	document.getElementById("overlay").classList.add("visible");

	overlay.classList.add("visible");
	content.classList.add("behindOverlay");
	document.body.style.overflow = "hidden";

	const validate = overlay.querySelector("input[type=submit]");
	const cancel = overlay.querySelector("button.cancel");

	if (cancel) cancel.onclick = () => closeOverlay(overlay, content);

	const firstInput = overlay.getElementsByTagName("input")[0];
	if (firstInput && firstInput.type !== "submit") firstInput.focus();

	window.onkeydown = (e) => {
		if (e.key === "Enter" && validateCondition()) {
			validate?.onclick(null);
		}
		else if (e.key === "Escape" && cancel) {
			cancel?.onclick(null);
		}
	};

	if (validate) {
		validate.onclick = () => {
			window.onkeydown = null;
			validateOnClick?.();
			if (closeOnValidate) {
				closeOverlay(overlay, content);
			}
		};
	}
}
