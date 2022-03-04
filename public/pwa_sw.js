self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event) => {
	const e = event;
	if (e.request.method === "GET") {
		e.respondWith(
			fetch(e.request)
				.catch(err => err),
		);
	}
});
