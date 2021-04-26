import { alert, confirm, loading } from "./dialogs.js";
import { checkResponse } from "./fetch.js";
import { closeOverlay } from "./overlay.js";

Array.from(document.getElementsByClassName("projectName")).forEach((project: HTMLElement) => {
	const projectLink = project.querySelector("a");
	const projectName = projectLink.innerText;
	const deleteButton = project.querySelector("span.deleteButton");
	deleteButton.onclick = async () => {
		if (await confirm("Voulez-vous vraiment supprimer ce projet?\nCette action est irréversible")) {
			loading(() => {
				fetch("/deleteProject", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						projectName,
					}),
				})
					.then(async res => checkResponse(res, async () => {
						console.log(res.status, res.statusText);
						await alert("Supprimé");
						project.remove();
					}));
			});
		}
	};
});

const searchInput = document.querySelector("input#searchInput");

function searchProject() {
	const searchResults = document.getElementById("searchResults");
	const projectList = document.querySelector("ul#projectList");
	if (searchInput.value !== "") {
		if (!projectList) {
			searchResults.innerText = "Aucun résultat";
			return;
		}

		const projects = Array.from(projectList.querySelectorAll("li")).map(li => li.querySelector("a").innerText)
			.filter(projectName => projectName.toLowerCase().split(" ").some(word => word.startsWith(searchInput.value)));

		if (projects.length === 0) {
			searchResults.innerText = "Aucun résultat";
			return;
		}
		searchResults.innerHTML = "";
		projects.forEach(result => {
			const div = document.createElement("div");
			div.classList.add("result");
			div.innerHTML = `<div><a href="/project?projectName=${result}">${result}</a></div>`;
			searchResults.appendChild(div);
		});
	}
	else {
		searchResults.innerHTML = "";
	}
}

searchInput.oninput = searchProject;
searchInput.onpaste = searchProject;

searchInput.onblur = () => {
	setTimeout(() => {
		if (document.activeElement.id !== "searchResults") {
			const searchResults = document.getElementById("searchResults");
			searchResults.innerHTML = "";
		}
	}, 100);
};

closeOverlay(document.getElementById("loadingOverlay"), document.querySelector("main"));
