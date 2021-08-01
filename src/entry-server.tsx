import renderToString from "preact-render-to-string";
import { App } from "./App";

export function render(routeUrl: string, options: Record<string, unknown>): string {
	return renderToString(<App url={routeUrl} options={options} />);
}
