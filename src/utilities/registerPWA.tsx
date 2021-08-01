import { Ref } from "preact/hooks";

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations()
		.then(async regs => {
			navigator.serviceWorker.register("/pwa_sw.tsx", { type: "module" });
			for (const reg of regs) {
				reg.update();
			}
		})
		.catch(err => console.error(err));
}

let deferredPrompt: BeforeInstallPromptEvent | null;
export function registerPWA(installLinkRef: Ref<HTMLElement | null>): void {
	const installLink = installLinkRef.current!;
	installLink.style.display = "none";
	window.addEventListener("beforeinstallprompt", (e) => {
		e.preventDefault();
		deferredPrompt = e as BeforeInstallPromptEvent;
		installLink.style.display = "block";

		installLink.onclick = () => {
			deferredPrompt!.prompt();
			deferredPrompt!.userChoice.then(() => {
				deferredPrompt = null;
			});
		};
	});
}
