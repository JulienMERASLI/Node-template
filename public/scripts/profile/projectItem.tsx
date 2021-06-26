import { useContext, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { loading, alert, confirm, DialogsStateContext } from "../utilities/dialogs";
import { checkResponse } from "../utilities/fetch";

export const ProjectItem = ({ name }: { name: string }): JSX.Element => {
	const projectListItem = useRef(null);
	const dialogsState = useContext(DialogsStateContext);
	name = decodeURIComponent(name);

	async function deleteProject() {
		if (await confirm(dialogsState, "Voulez-vous vraiment supprimer ce projet?\nCette action est irréversible")) {
			loading(dialogsState, () => {
				fetch("/deleteProject", {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
					}),
				})
					.then(async res => checkResponse(dialogsState, res, async () => {
						console.log(res.status, res.statusText);
						await alert(dialogsState, "Supprimé");
						projectListItem.current.remove();
					}));
			});
		}
	}

	return (<li class="projectName" ref={projectListItem}>
		<div>
			<a href={`/project?projectName=${name}`}>{name}</a>
			<div class="right">
				<span class="deleteButton actionsButton" onClick={deleteProject}>🗑️</span>
				<img src="/images/shareIcon.png" alt="Share" class="shareButton actionsButton" />
			</div>
		</div>
	</li>);
};
