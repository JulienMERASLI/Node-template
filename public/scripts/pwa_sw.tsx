/// <reference path="../../types/worker.d.ts" />`

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event: FetchEvent) => {
	if (event.request.method === "GET") {
		event.respondWith(
			fetch(event.request)
				.catch(err => err),
		);
	}
});
