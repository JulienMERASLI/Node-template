/// <reference path="../../../types/client.d.ts" />
import { JSX } from "preact/jsx-runtime";
import type { IUser } from "../../../models/accounts/userSchemaModel";
import "../index";
import { CompleteHeader } from "../sharedComponents/header";
import { InstallPWA } from "../sharedComponents/installPWA";

export default function Index({ user }: { user: IUser }): JSX.Element {
	return (
		<>
			<CompleteHeader user={user}></CompleteHeader>
			<div>
				<h1>TEMPLATE</h1>
			</div>

			<main>
			</main>
			<footer>
				<InstallPWA />
				<div id="mail">
					<p>Un problème ? Une question ? <a href="mailto:julien.merasli@hotmail.com?subject=Probl%C3%A8me%20%2F%20Question%20sur%20https%3A%2F%2Ftemplate.azurewebsites.net">Contactez-moi</a></p>
					<p><a href="https://julienmerasli.media" target="_blank">Voir tous mes projets</a></p>
					<p>© Julien MERASLI - 2021</p>
				</div>
			</footer>
		</>
	);
}
