import { useEffect, useRef, useState } from "react";
import { Link } from "remix";

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
	navigator.serviceWorker.getRegistrations()
		.then(async regs => {
			navigator.serviceWorker.register("pwa_sw.js", { type: "module" });
			for (const reg of regs) {
				reg.update();
			}
		})
		.catch(err => console.error(err));
}

interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed",
		platform: string
	}>;
	prompt(): Promise<void>;
}
let deferredPrompt: BeforeInstallPromptEvent;
export const InstallPWA = (): JSX.Element => {
	const [linkVisible, setLinkVisible] = useState(false);
	const installLink = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (e) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
			setLinkVisible(true);
			installLink.current!.onclick = () => {
				deferredPrompt?.prompt();
				deferredPrompt?.userChoice.then(() => {
					deferredPrompt = new Event("") as BeforeInstallPromptEvent;
				});
			};
		});
	}, []);
	return (<div id="downloads">
		<Link to="#" id="installPwa" style={{ display: linkVisible ? "block" : "none" }} ref={installLink}>Installer pour tous les appareils</Link>
	</div>);
};
