import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export const SearchForm = ({ projectList }: { projectList: string[] }): JSX.Element => {
	const [projects, setProjects] = useState<string[]>([]);
	const [inputFocused, setInputFocused] = useState(false);

	function searchProject(this: HTMLInputElement) {
		setProjects(this.value === "" ? []
			: projectList.filter(projectName => projectName.toLowerCase()
				.split(" ")
				.some(word => word.startsWith(this.value))));
	}

	function blurInput() {
		setTimeout(() => {
			if (document.activeElement.id !== "searchResults") {
				setInputFocused(false);
			}
		}, 100);
	}

	return (<div id="searchDiv">
		<div id="form">
			<input onFocus={() => setInputFocused(true)}
				onBlur={blurInput}
				onInput={(e) => (searchProject.bind(e.target))()}
				type="search" autocomplete="off" placeholder="Rechercher un projet" id="searchInput"/>
		</div>
		<div id="searchResults">
			{inputFocused && (projects.length > 0 ? projects.map(project => (
				<div className="result">
					<a href={`/project?projectName=${project}`}>{project}</a>
				</div>
			))
				: "Aucun résultat")}
		</div>
	</div>);
};
