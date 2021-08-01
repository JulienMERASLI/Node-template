import type { IUser } from "../../models/accounts/userSchemaModel";
import { CompleteHeader } from "../sharedComponents/header";
import { InstallPWA } from "../sharedComponents/installPWA";
export default function Index({ user }: { user: IUser }): JSX.Element {
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
