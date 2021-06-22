import * as express from "express";
import "express-async-errors";
export const app = express();
import * as fs from "fs/promises";
import * as http from "http";
export const server = http.createServer(app);
import * as dotenv from "dotenv";
dotenv.config();
import * as mongoose from "mongoose";
import nodeFetch from "node-fetch";
import * as expressSession from "express-session";
import * as path from "path";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as nodemailer from "nodemailer";
import * as serveFavicon from "serve-favicon";

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

fs.mkdir(`${__dirname}/files/`).catch(err => {
	if (err && (err.errno !== -17 && err.errno !== -4075)) console.error(err);
});

fs.mkdir(`${__dirname}/publicProjects/`).catch(err => {
	if (err && (err.errno !== -17 && err.errno !== -4075)) console.error(err);
});

["log", "warn", "error", "dir"].forEach((methodName) => {
	const originalMethod = console[methodName];
	console[methodName] = (...args) => {
		let initiator = "unknown place";
		try {
			throw new Error();
		} catch (e) {
			if (typeof e.stack === "string") {
				let isFirst = true;
				for (const line of e.stack.split("\n")) {
					const matches = line.match(/^\s+at\s+(.*)/);
					if (matches) {
						if (!isFirst) {
							initiator = matches[1];
							break;
						}
						isFirst = false;
					}
				}
			}
		}
		originalMethod.apply(console, [...args, "\n", `  at ${initiator}`]);
	};
});

const session = expressSession({
	secret: "template",
	resave: false,
	saveUninitialized: true,
	cookie: {
		sameSite: false,
	},
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
	.then(() => console.log("connection to database succesful"))
	.catch((err) => console.error(err));

app.use(serveFavicon(`${__dirname}/public/favicon.ico`));
app.use("/", express.static(path.join(__dirname, "/public/build/")));
app.use(express.static(path.join(__dirname, "/public/")));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(session);
app.use(helmet({
	contentSecurityPolicy: false,
}));

export const smtpTransport = nodemailer.createTransport({
	host: "smtp-mail.outlook.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.EMAIL,
		pass: process.env.EMAIL_PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

const port = parseInt(process.env.PORT) || 8005;
server.listen(port, () => console.log(`listening to port ${port}`));

setInterval(() => {
	nodeFetch("https://template.azurewebsites.net/").catch(err => err);
}, 1000 * 60 * 10);

import { notConnected } from "./controllers/middlewares";
import "./controllers/accountController";
import "./controllers/mainController";

app.use(notConnected, (req, res, next) => {
	req.session.messages.push("pageNotFound");
	req.session.save();
	res.redirect("/profile");
	next();
});
