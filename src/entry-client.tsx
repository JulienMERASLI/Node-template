import { hydrate } from "preact";
import { App } from "./App";
export async function hydrateApp(options: Record<string, unknown>): Promise<void> {
	hydrate(
		<App url={location.pathname} options={options} />,
		document.getElementById("app")!,
	);
}
