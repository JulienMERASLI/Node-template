import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { registerPWA } from "../utilities/registerPWA";

export const InstallPWA = (): JSX.Element => {
	const installLink = useRef(null);
	useEffect(() => {
		registerPWA(installLink);
	}, []);
	return (<div id="downloads">
		<a href="#" id="installPwa" ref={installLink}>Installer pour tous les appareils</a>
	</div>);
};
