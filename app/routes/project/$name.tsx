import { ActionFunction, json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { ConnectedHeader } from "~/components/header";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";
import { badRequest } from "../login";

async function createProject(name: string, userId: string) {
	const project = await db.project.create({ data: {
		name,
		userId,
	} });
	return json({ ok: true, id: project.id });
}

async function deleteProject(id: string) {
	try {
		const project = await db.project.delete({
			where: {
				id: parseInt(id),
			},
		});
		return json({ ok: true, project });
	} catch {
		return badRequest({ nonExistingProject: true }, true);
	}
}

export const meta: MetaFunction = ({ params }) => ({ title: params.name as string });

export const action: ActionFunction = async ({ request, params }) => {
	const { name: encodedName } = params;
	const userId = await getUserId(request);
	if (typeof encodedName === "undefined" || !userId) return badRequest({});
	const name = decodeURIComponent(encodedName);
	if (request.method === "POST") return createProject(name, userId);
	if (request.method === "DELETE") {
		const id = (await request.formData()).get("id");
		if (typeof id !== "string") return badRequest({ nonExistingProject: true });
		return deleteProject(id);
	}
};

type LoaderData = { name: string };
export const loader: LoaderFunction = ({ params }) => ({ name: params.name });

export default function () {
	const { name } = useLoaderData<LoaderData>();
	return (
		<>
			<ConnectedHeader />
			<h1>{name}</h1>
		</>
	);
}
