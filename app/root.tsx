import {
	json,
	Links,
	LinksFunction,
	LiveReload,
	LoaderFunction,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useCatch,
	useLoaderData,
} from "remix";
import { OutletContext } from "remix.env";
import type { MetaFunction } from "remix";
import { clearMessages, getUser } from "./utils/session.server";
import mainStyles from "~/styles/main.css";
import fontsStyles from "~/styles/fonts.css";
import overlayStyles from "~/styles/overlay.css";
import { HeaderImage } from "./components/header";

export const meta: MetaFunction = () => ({ title: "Template" });

export const links: LinksFunction = () => [{
	rel: "stylesheet",
	href: mainStyles,
}, {
	rel: "stylesheet",
	href: fontsStyles,
}, {
	rel: "stylesheet",
	href: overlayStyles,
}, {
	rel: "icon",
	href: "/images/favicon.ico",
}, {
	rel: "manifest",
	href: "/manifest.webmanifest",
}, {
	rel: "apple-touch-icon",
	href: "/images/appleIcon.png",
}];

type LoaderData = OutletContext;
export const loader: LoaderFunction = async ({ request }) => {
	const user = await getUser(request);
	return json({
		user,
	}, {
		headers: {
			"Set-Cookie": await clearMessages(request),
		},
	});
};

export default function App(): JSX.Element {
	const { user } = useLoaderData<LoaderData>();
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<meta name="description" content="Template" />
				<meta name="application-name" content="Template"/>
				<meta name="theme-color" content="black" />
				<meta name="author" content="Julien Merasli"/>
				<Meta />
				<Links />

			</head>
			<body>
				<Outlet context={{ user }} />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
export function CatchBoundary() {
	const caught = useCatch();
	return (
		<html>
			<head>
				<title>Oops!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<header>
					<HeaderImage />
				</header>
				<h1>
					{caught.status} {caught.statusText}
				</h1>
				<Scripts />
			</body>
		</html>
	);
}
