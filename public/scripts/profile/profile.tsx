import "preact/debug";
import { JSX } from "preact/jsx-runtime";
import type { IUser } from "../../../models/accounts/userSchemaModel";
import { Dialogs } from "../sharedComponents/dialogs";
import { ConnectedHeader } from "../sharedComponents/header";
import { ErrorMessage, InformationMessage } from "../sharedComponents/messages";
import { OverlayContainer } from "../sharedComponents/overlay";
import { createDialogsState, DialogsStateContext } from "../utilities/dialogs";
import { ProjectItem } from "./projectItem";
import { SearchForm } from "./searchForm";

export default function Profile(options: { user: IUser, projects: string[] } & {[key: string]: boolean }): JSX.Element {
	const dialogsState = createDialogsState();

	return (
		<DialogsStateContext.Provider value={dialogsState}>
			<div id="content">
				<div>
					<ConnectedHeader>
						<SearchForm projectList={options.projects} />
					</ConnectedHeader>
					{options.alreadyConnected && <ErrorMessage>Vous êtes déjà connecté</ErrorMessage>}
					{options.PWModified && <InformationMessage>Mot de passe modifié</InformationMessage>}
					{options.registered && <InformationMessage>
				Bienvenue, vous pouvez désormais créer votre premier projet, consultez notre <a href="/help">page d'aide</a>
					</InformationMessage>}
					{options.settingsChanged && <InformationMessage>Paramètres modifiés</InformationMessage>}
					{options.pageNotFound && <ErrorMessage>La page n'existe pas</ErrorMessage>}
					{options.nonExistingProject && <ErrorMessage>Ce projet n'existe pas</ErrorMessage>}
				</div>
				<main>
					<h1>Profil de {options.user.username}</h1>
					<div class="noPadding">
						<a href="/project?new" class="blue">Créer un nouveau projet</a>
					</div>
					<div>
						{options.projects.length > 0
					&& <div>
						<h2>Projets existants</h2>
						<ul id="projectList">
							{options.projects.map(name => (<ProjectItem name={name} />))}
						</ul>
					</div>
						}
					</div>
					<div>
						<div>
							<h2>Modifier les paramètres du compte</h2>
							<div class="links">
								<p><a href="/settings">Paramètres du compte</a></p>
							</div>
						</div>
					</div>
				</main>
				<OverlayContainer>
					<Dialogs />
				</OverlayContainer>
			</div>
		</DialogsStateContext.Provider>
	);
}
