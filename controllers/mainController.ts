import * as fs from "fs/promises";
import { app } from "../server";
import { notConnected, getMessages } from "./middlewares";

app.get("/", (req, res) => {
	res.render("index", { user: req.user, url: "" });
});

app.get("/help", (req, res) => {
	res.render("help", { user: req.user });
});

app.get("/profile", notConnected, async (req, res) => {
	const params = {
		user: req.user,
		projects: [],
		url: req.path.split("/")[1],
	};

	getMessages(req, params);

	const projects = (await fs.readdir(`./files/${req.user.username}/projects`))
		.map(name => name.slice(0, -8));

	params.projects = projects;

	res.render("profile", params);
});
