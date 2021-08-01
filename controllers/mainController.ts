import * as fs from "fs/promises";
import { app } from "../server";
import { isInQuery, notConnected, setResParams } from "./helpers";

app.get("/", setResParams("Template", ["index/index.less"], (req) => ({
	user: req.user,
})));

app.get("/help", setResParams("Aide", ["help/help.less"], (req) => ({
	user: req.user,
})));

app.get("/profile", notConnected, setResParams("Profil", ["profile/profile.less"], (async req => ({
	user: req.user,
	projects: (await fs.readdir(`./files/${req.user!.username}/projects`))
		.map(name => name.slice(0, -8)),
	url: req.path.split("/")[1],
	settingsChanged: isInQuery(req, "settingsChanged"),
}))));
