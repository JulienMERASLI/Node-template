/// <reference path="../types/client.d.ts" />
import "preact/debug";

const pages = import.meta.globEager("./pages/**/*.tsx");

const routes = Object.keys(pages).map((path) => {
	const nameWithPath = path.match(/\.\/pages\/(.*)\.tsx$/)![1];
	const nameSplitted = nameWithPath.split("/");
	const nameWithDollar = nameSplitted[nameSplitted.length - 1];
	const name = nameWithDollar.startsWith("$") ? nameWithDollar.slice(1) : nameWithDollar;
	return {
		path: name === "Index"
			? "/"
			: `/${nameSplitted.slice(0, nameSplitted.length - 1).join("/")}${nameSplitted.length > 1 ? "/" : ""}${name.toLowerCase()}`,
		isCollection: nameWithDollar !== name,
		component: pages[path].default,
	};
});

export function App({ url, options }: { url: string, options: Record<string, unknown> }): JSX.Element {
	const RouteComp = routes.find(route => {
		const urlWithoutQuery = url.split("?")[0];
		const urlSplitted = urlWithoutQuery.split("/");
		if (route.isCollection) {
			return route.path === urlSplitted.slice(0, urlSplitted.length - 1).join("/").toLowerCase();
		}
		return route.path === urlWithoutQuery.toLowerCase();
	})?.component;
	if (!RouteComp) return <>404</>;
	return <RouteComp {...options} />;
}
