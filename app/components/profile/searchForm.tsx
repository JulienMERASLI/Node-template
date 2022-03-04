import { Project } from "@prisma/client";
import { useContext, useState } from "react";
import { Link } from "remix";
import { ProjectsContext } from "~/routes/profile";

export const SearchForm = (): JSX.Element => {
	const projectList = useContext(ProjectsContext).projects;
	const [projects, setProjects] = useState<Project[]>([]);
	const [inputFocused, setInputFocused] = useState(false);

	function searchProject(this: HTMLInputElement) {
		setProjects(this.value === "" ? []
			: projectList.filter(({ name: projectName }) => projectName.toLowerCase()
				.split(" ")
				.some(word => word.startsWith(this.value))));
	}

	function blurInput() {
		setTimeout(() => {
			if (document.activeElement!.id !== "searchResults") {
				setInputFocused(false);
			}
		}, 100);
	}

	return (<div id="searchDiv">
		<div id="form">
			<input onFocus={() => setInputFocused(true)}
				onBlur={blurInput}
				onInput={(e) => (searchProject.bind(e.currentTarget))()}
				type="search" autoComplete="off" placeholder="Rechercher un projet" id="searchInput" />
		</div>
		<div id="searchResults">
			{inputFocused && (projects.length > 0 ? projects.map(project => (
				<div className="result" key={project.id}>
					<Link to={`/project/${project.name}`}>{project.name}</Link>
				</div>
			))
				: "Aucun résultat")}
		</div>
	</div>);
};
