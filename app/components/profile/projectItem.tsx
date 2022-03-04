import { Project } from "@prisma/client";
import { useContext, useEffect } from "react";
import { Link, useFetcher } from "remix";
import { ProjectsContext } from "~/routes/profile";

import { confirm } from "~/utils/dialogs";
import { MessagesContext } from "../messages";

export const ProjectItem = ({ project }: { project: Project }): JSX.Element => {
	const projectFetcher = useFetcher();
	const encodedName = encodeURIComponent(project.name);

	const { projects, setProjects } = useContext(ProjectsContext);
	const { setMessages } = useContext(MessagesContext);

	async function deleteProject() {
		if (await confirm("Voulez-vous vraiment supprimer ce projet?\nCette action est irréversible")) {
			projectFetcher.submit({ id: project.id.toString() }, {
				action: `/project/${encodedName}`,
				method: "delete",
			});
		}
	}

	useEffect(() => {
		if (projectFetcher.type === "done") {
			if (projectFetcher.data?.ok) setProjects(projects.filter(proj => proj.name !== project.name));
			const newMessages = projectFetcher.data?.messages ?? {};
			if (Object.keys(newMessages).length > 0) {
				setMessages(mes => ({ ...mes, ...newMessages }));
			}
		}
	}, [projectFetcher]);

	return (<li className="projectName">
		<div>
			<Link to={`/project/${encodedName}`}>{project.name}</Link>
			<div className="right">
				<span className="deleteButton actionsButton" onClick={deleteProject}>🗑️</span>
			</div>
		</div>
	</li>);
};
