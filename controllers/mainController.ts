import * as fs from "fs/promises";
import { app } from "../server";
import { isInQuery, notConnected, render } from "./helpers";

app.get("/", (req, res) => {
	render(req, res, {
		title: "Template",
		css: "index",
		js: "index/index",
		options: {
			user: req.user,
		},
	});
});

app.get("/help", (req, res) => {
	render(req, res, {
		title: "Aide",
		css: "help",
		js: "help/help",
		options: {
			user: req.user,
		},
	});
});

app.get("/profile", notConnected, async (req, res) => {
	const params = {
		user: req.user,
		projects: [],
		url: req.path.split("/")[1],
		settingsChanged: isInQuery(req, "settingsChanged"),
	};

	const projects = (await fs.readdir(`./files/${req.user.username}/projects`))
		.map(name => name.slice(0, -8));

	params.projects = projects;

	render(req, res, {
		title: "Profil",
		css: "profile",
		js: "profile/profile",
		options: params,
	});
});
