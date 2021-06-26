import { Ref } from "preact/hooks";

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations()
		.then(async regs => {
			navigator.serviceWorker.register("/pwa_sw.js");
			for (const reg of regs) {
				reg.update();
			}
		})
		.catch(err => console.error(err));
}

let deferredPrompt;
export function registerPWA(installLink: Ref<HTMLElement>): void {
	installLink.current.style.display = "none";
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e;
		installLink.current.style.display = "block";

		installLink.current.onclick = () => {
			deferredPrompt.prompt();
			deferredPrompt.userChoice.then(() => {
				deferredPrompt = null;
			});
		};
	});
}
