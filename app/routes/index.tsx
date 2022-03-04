import { LinksFunction, useOutletContext } from "remix";
import { OutletContext } from "remix.env";
import { CompleteHeader } from "~/components/header";
import { InstallPWA } from "~/components/installPWA";

import styles from "~/styles/index.css";

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: styles,
}];

export default function Index() {
	const { user } = useOutletContext<OutletContext>();
	return (
		<>
			<CompleteHeader user={user} />
			<div>
				<h1>TEMPLATE</h1>
			</div>

			<main />
			<footer>
				<InstallPWA />
				<div id="mail">
					<p>Un problème ? Une question ? <a href="mailto:julien.merasli@hotmail.com?subject=Probl%C3%A8me%20%2F%20Question%20sur%20https%3A%2F%2Ftemplate.azurewebsites.net">Contactez-moi</a></p>
					<p><a href="https://julienmerasli.media" target="_blank" rel="noopener noreferrer">Voir tous mes projets</a></p>
					<p>© Julien MERASLI - 2021</p>
				</div>
			</footer>
		</>
	);
}
