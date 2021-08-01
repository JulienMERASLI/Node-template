/// <reference path="../types/worker.d.ts" />

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event) => {
	const e = event as FetchEvent;
	if (e.request.method === "GET") {
		e.respondWith(
			fetch(e.request)
				.catch(err => err),
		);
	}
});

export {};
