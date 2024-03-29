import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
): Promise<Response> {
	const markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />,
	);

	responseHeaders.set("Content-Type", "text/html");
	return new Response(`<!DOCTYPE html>${markup}`, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}
