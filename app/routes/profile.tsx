import { Project } from "@prisma/client";
import { createContext, useEffect, useState } from "react";
import { Link, LinksFunction, LoaderFunction, MetaFunction, useFetcher, useLoaderData, useOutletContext } from "remix";
import { OutletContext } from "remix.env";
import { Dialogs } from "~/components/dialogs";
import { ConnectedHeader } from "~/components/header";
import { Messages, MessagesContext } from "~/components/messages";
import { OverlayContainer, State } from "~/components/overlay";
import { ProjectItem } from "~/components/profile/projectItem";
import { SearchForm } from "~/components/profile/searchForm";

import styles from "~/styles/profile.css";
import { alert, prompt } from "~/utils/dialogs";
import { getMessages, getUser, notConnected } from "~/utils/session.server";

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: styles,
}];
export const meta: MetaFunction = () => ({ title: "Profil" });

type LoaderData = { projects: Project[], messages: Messages }
export const loader: LoaderFunction = async ({ request }): Promise<LoaderData | Response> => {
	const isNotConnected = await notConnected(request);
	if (isNotConnected !== null) return isNotConnected;
	const user = (await getUser(request))!;
	const messages = await getMessages(request);
	return { projects: user.projects, messages };
};

export const ProjectsContext = createContext({} as State<Project[], "projects">);

export default function Profile() : JSX.Element {
	const loaderData = useLoaderData<LoaderData>();
	const [messages, setMessages] = useState(loaderData.messages);
	const existingProjects = loaderData.projects;
	const [projects, setProjects] = useState(existingProjects);
	const { user } = useOutletContext<OutletContext>();
	const projectFetcher = useFetcher();
	async function createNewProject() {
		const name = await prompt("Veuillez entrer le nom du projet");
		if (name === null) return;
		if (projects.findIndex(project => project.name === name) !== -1) return alert("Ce projet existe déjà");
		setProjects([...projects, { name, userId: user.id, id: projects.length }]);
		projectFetcher.submit({}, {
			action: `/project/${encodeURIComponent(name)}`,
			method: "post",
		});
	}
	useEffect(() => {
		if (projectFetcher.type === "done" && projectFetcher.data?.ok) {
			setProjects([...projects.slice(0, -1),
				{
					...projects[projects.length - 1],
					id: projectFetcher.data.id,
				}]);
		}
	}, [projectFetcher]);

	return (
		<ProjectsContext.Provider value={{ projects, setProjects }}>
			<MessagesContext.Provider value={{ messages, setMessages }}>
				<div id="content">
					<div>
						<ConnectedHeader showProfile={false}>
							<SearchForm />
						</ConnectedHeader>
						<Messages messages={messages} />
					</div>
					<main>
						<h1>Profil de {user.username}</h1>
						<div className="noPadding">
							<button className="blue" onClick={createNewProject}>Créer un nouveau projet</button>
						</div>
						<div>
							{projects.length > 0
					&& <div>
						<h2>Projets existants</h2>
						<ul id="projectList">
							{projects.map(project => (<ProjectItem project={project} key={project.id} />))}
						</ul>
					</div>
							}
						</div>
						<div>
							<div>
								<h2>Modifier les paramètres du compte</h2>
								<div className="links">
									<p><Link to="/settings">Paramètres du compte</Link></p>
								</div>
							</div>
						</div>
					</main>
					<OverlayContainer>
						<Dialogs />
					</OverlayContainer>
				</div>
			</MessagesContext.Provider>
		</ProjectsContext.Provider>
	);
}
