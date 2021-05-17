import { alert } from "./dialogs.js";

if (window.location.href.includes("mode=standalone")) {
	const mail = document.getElementById("mail");
	mail.style.height = `${document.querySelector("footer").offsetHeight}px`;
	mail.style.marginTop = "0";
}

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations()
		.then(async regs => {
			navigator.serviceWorker.register("/scripts/pwa_sw.js");
			for (const reg of regs) {
				reg.update();
			}
		})
		.catch(err => console.error(err));
}

let deferredPrompt;
const addBtn = document.getElementById("installPwa");
if (addBtn) {
	addBtn.onclick = async () => {
		await alert("L'application est déjà installée sur votre appareil !");
	};

	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e;

		addBtn.onclick = () => {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then(() => {
				deferredPrompt = null;
			});
		};
	});
}
