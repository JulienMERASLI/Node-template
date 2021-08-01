import { NextFunction, Request, Response } from "express";
import * as path from "path";
import * as fs from "fs/promises";
import { IUser } from "../models/accounts/userSchemaModel";
import { app } from "../server";

app.use((req, res, next) => {
	if (!req.session.messages) req.session.messages = [];
	next();
});

export const alreadyConnected = (req: Request, res: Response, next: NextFunction): void => {
	if (req.user) {
		req.session.messages.push("alreadyConnected");
		return res.redirect("/profile");
	}
	next();
};

export const notConnected = (req: Request, res: Response, next: NextFunction): void => {
	if (req.user) return next();
	req.session.messages.push("notConnected");
	req.session.returnTo = req.url;
	if (req.method === "GET") return res.redirect("/login");
	res.status(401).send();
};

export const getMessages = (req: Request, params: Record<string, unknown> = {}): void => {
	(req.session.messages || []).forEach(message => params[message] = true);
	req.session.messages = [];
};

export const getUserWithoutPW = (req: Request): IUser => {
	if (req.user) {
		const { user } = req;
		user.PW = user.__v = user._id = undefined;
		return user;
	}
	return {} as IUser;
};

export async function createViteServer(root = process.cwd(), isProd = process.env.NODE_ENV === "production"): Promise<void> {
	const resolve = (p: string) => path.resolve(root, p);

	const vite = await (await import("vite")).createServer({
		root,
		logLevel: "info",
		server: {
			middlewareMode: "ssr",
			watch: {
				usePolling: true,
				interval: 100,
			},
		},
	});
	app.use(vite.middlewares);
	app.use("/pwa_sw.tsx", async (req, res) => {
		res.set("Content-Type", "application/javascript")
			.end((await vite.transformRequest("/src/pwa_sw.tsx") as { code: string }).code);
	});

	app.use(async (req, res, next) => {
		try {
			const url = req.originalUrl;
			let template: string;
			const entryURL = "/src/entry-server.tsx";
			const { render } = (await vite.ssrLoadModule(entryURL)) as { render: (routeUrl: string, options: Record<string, unknown>) => string };
			template = await fs.readFile(resolve("index.html"), "utf-8");
			template = await vite.transformIndexHtml(url, template);

			const { options = {}, title, styles = [] } = res;
			if ("user" in options) {
				options.user = getUserWithoutPW(req);
			}
			styles.push("main.less");
			getMessages(req, options);
			const appHtml = render(url, options);
			if (appHtml === "404") return next();

			const html = template
				.replace("<!--app-html-->", `${appHtml}
					<script type="module">
						import { hydrateApp } from "${entryURL.replace("server", "client")}";
						hydrateApp(${JSON.stringify(options)})
					</script>`)
				.replace("<!--title-->", title)
				.replace("<!--css-->", styles
					.map(s => `<link rel="stylesheet" href="/src/${s}">`)
					.join("\n"));

			res.status(200).set({ "Content-Type": "text/html" }).end(html);
		} catch (e) {
			if (!isProd) vite.ssrFixStacktrace(e);
			console.log(e.stack);
			res.status(500).end(e.stack);
		}
	});
	app.use(notConnected, (req, res, next) => {
		req.session.messages.push("pageNotFound");
		req.session.save();
		res.redirect("/profile");
		next();
	});
}

export function isInQuery(req: Request, qs: string): boolean {
	return req.query[qs] === "true";
}

export function setResParams(title: string, styles: string[] = [], getOptions: (req: Request) => Record<string, unknown> | Promise<Record<string, unknown>> = () => ({})): (req: Request, res: Response, next: NextFunction) => void {
	return async (req, res, next) => {
		res.title = title;
		const options = getOptions(req);
		if (options instanceof Promise) {
			res.options = await options;
		} else {
			res.options = options;
		}
		res.styles = styles;
		next();
	};
}
