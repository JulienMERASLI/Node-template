import type { IUser } from "../../models/accounts/userSchemaModel";
import { Dialogs } from "../sharedComponents/dialogs";
import { ConnectedHeader } from "../sharedComponents/header";
import { getMessages } from "../sharedComponents/messages";
import { OverlayContainer } from "../sharedComponents/overlay";
import { ProjectItem } from "../profile/projectItem";
import { SearchForm } from "../profile/searchForm";

export default function Profile({ user, projects, ...errors }: { user: IUser, projects: string[] } & {[key: string]: boolean }): JSX.Element {
	return (
		<div id="content">
			<div>
				<ConnectedHeader>
					<SearchForm projectList={projects} />
				</ConnectedHeader>
				{getMessages(errors)}
			</div>
			<main>
				<h1>Profil de {user.username}</h1>
				<div class="noPadding">
					<a href="/project?new=true" class="blue">Créer un nouveau projet</a>
				</div>
				<div>
					{projects.length > 0
					&& <div>
						<h2>Projets existants</h2>
						<ul id="projectList">
							{projects.map(name => (<ProjectItem name={name} key={name} />))}
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
	);
}
