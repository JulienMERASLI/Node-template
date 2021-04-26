import { fetchPOST } from "../fetch.js";
import { showOverlay } from "../overlay.js";

window.onload = () => {
	const form = document.getElementById("modifyForm");

	function getAllInputs() {
		const body = {};

		Array.from(form.getElementsByTagName("input")).forEach(input => {
			if (input.type === "submit") return;
			if (input.value === null || input.value === "") return;
			body[input.name] = input.value;
		});

		return body;
	}

	window.onbeforeunload = (e) => {
		if (Object.keys(getAllInputs()).length > 0) {
			e.preventDefault();
			e.returnValue = "";
		}
	};

	form.onsubmit = (e) => {
		e.preventDefault();

		const PW = document.querySelector("input#PW");
		const PWConfirm = document.querySelector("input#PWConfirm");
		if (PW.value !== PWConfirm.value) {
			e.preventDefault();
			document.querySelector("h2#PWConfirmError").style.display = "block";
			return false;
		}
		document.querySelector("h2#PWConfirmError").style.display = "none";

		const body = getAllInputs();

		if (Object.keys(body).length > 0) {
			const overlay = document.getElementById("overlay");
			const main = document.querySelector("main");

			const error = overlay.getElementsByClassName("error")[0] as HTMLElement;
			error.style.display = "none";

			const oldPW = document.querySelector("input#oldPW");
			oldPW.focus();

			showOverlay("confirmPWOverlay", main, false, () => {
				fetchPOST("/verifyPW", {
					PW: oldPW.value,
				})
					.then(res => {
						if (res.ok) {
							return res.json();
						}
						error.innerText = "Une erreur inattendue s'est produite. Veuillez réessayer plus tard";
						error.style.display = "block";
						oldPW.value = "";
					})
					.then(value => {
						if (value === true) {
							fetchPOST("/settings", body)
								.then((res) => {
									if (res.ok) {
										console.log(res.status, res.statusText);
										window.onbeforeunload = null;
										window.location.href = "/profile";
									}
									else {
										error.innerText = "Une erreur inattendue s'est produite. Veuillez réessayer plus tard";
										error.style.display = "block";
										PW.value = "";
									}
								});
						}
						else if (error.style.display === "none") {
							error.innerText = "Mot de passe erroné";
							error.style.display = "block";
							oldPW.value = "";
						}
					});
			});
		}
	};
};
