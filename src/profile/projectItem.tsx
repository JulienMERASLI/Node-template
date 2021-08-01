import { useRef } from "preact/hooks";

import { loading, alert, confirm } from "../utilities/dialogs";
import { checkResponse } from "../utilities/fetch";

export const ProjectItem = ({ name }: { name: string }): JSX.Element => {
	const projectListItem = useRef<HTMLLIElement>(null);
	name = decodeURIComponent(name);

	async function deleteProject() {
		if (await confirm("Voulez-vous vraiment supprimer ce projet?\nCette action est irréversible")) {
			loading(() => {
				fetch("/deleteProject", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
					}),
				})
					.then(async res => checkResponse(res, async () => {
						console.log(res.status, res.statusText);
						await alert("Supprimé");
						projectListItem.current!.remove();
					}));
			});
		}
	}

	return (<li class="projectName" ref={projectListItem}>
		<div>
			<a href={`/project?projectName=${name}`}>{name}</a>
			<div class="right">
				<span class="deleteButton actionsButton" onClick={deleteProject}>🗑️</span>
			</div>
		</div>
	</li>);
};
