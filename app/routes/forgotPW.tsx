import { LinksFunction, LoaderFunction, MetaFunction, Outlet, useLoaderData, useOutletContext } from "remix";
import { OutletContext } from "remix.env";
import { CompleteHeader } from "~/components/header";
import { Messages } from "~/components/messages";
import formStyles from "~/styles/forms.css";
import { getMessages } from "~/utils/session.server";

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: formStyles,
}];
export const meta: MetaFunction = () => ({ title: "Mot de passe oublié" });

type LoaderData = {
	messages: Messages;
}
export const loader: LoaderFunction = async ({ request }) => {
	const messages = await getMessages(request);
	return { messages };
};

export default function () {
	const { messages } = useLoaderData<LoaderData>();
	const { user } = useOutletContext<OutletContext>();
	return (
		<>
			<CompleteHeader user={user} />
			<Messages messages={messages} />
			<Outlet />
		</>
	);
}
