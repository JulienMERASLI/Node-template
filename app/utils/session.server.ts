import bcrypt from "bcryptjs";
import {
	createCookieSessionStorage,
	redirect,
	Session,
} from "remix";
import { Messages } from "~/components/messages";

import { db } from "./db.server";

type LoginForm = {
	usernameOrEmail: string;
	password: string;
};

type RegisterForm = {
	username: string;
	password: string
	email: string;
}

export async function register({ username, password, email }: RegisterForm) {
	const passwordHash = await bcrypt.hash(password, 10);
	const user = await db.user.create({
		data: { username, password: passwordHash, email },
	});
	return { id: user.id, username };
}

export async function login({ usernameOrEmail, password }: LoginForm, connectionMethod: string) {
	const user = await db.user.findUnique({
		where: { [connectionMethod]: usernameOrEmail },
	});
	if (!user) return "wrongUsername";
	const isPasswordCorrect = await bcrypt.compare(
		password,
		user.password,
	);
	if (!isPasswordCorrect) return "wrongPassword";
	return { id: user.id, username: usernameOrEmail };
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
	throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
	cookie: {
		name: "RJ_session",
		secure: process.env.NODE_ENV === "production",
		secrets: [sessionSecret],
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30,
		httpOnly: true,
	},
});

export function getUserSession(request: Request) {
	return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") return null;
	return userId;
}

export async function requireUserId(request: Request, redirectTo: string = new URL(request.url).pathname) {
	const session = await getUserSession(request);
	const userId = session.get("userId");
	if (!userId || typeof userId !== "string") {
		const searchParams = new URLSearchParams([
			["redirectTo", redirectTo],
		]);
		throw redirect(`/login?${searchParams}`);
	}
	return userId;
}

export async function logout(request: Request) {
	const session = await getUserSession(request);
	return redirect("/login", {
		headers: {
			"Set-Cookie": await storage.destroySession(session),
		},
	});
}

export async function getUser(request: Request) {
	const userId = await getUserId(request);
	if (typeof userId !== "string") {
		return null;
	}

	try {
		const user = await db.user.findUnique({
			where: { id: userId },
			select: { id: true, username: true, email: true, projects: true },
		});
		return user;
	} catch {
		throw logout(request);
	}
}

export async function createUserSession(userId: string, redirectTo: string, session?: Session | undefined) {
	if (!session) session = await storage.getSession();
	session.set("userId", userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await storage.commitSession(session),
		},
	});
}

export async function getMessages(request: Request): Promise<Messages> {
	const session = await getUserSession(request);
	return ((session.get("messages") || []) as string[])
		.reduce((obj, message) => ({ ...obj, [message]: true }), {});
}

export async function clearMessages(request: Request): Promise<string> {
	const session = await getUserSession(request);
	session.set("messages", []);
	return storage.commitSession(session);
}

export async function addMessage(request: Request, message: keyof Messages, returnSession = false): Promise<Session | string> {
	const session = await getUserSession(request);
	session.set("messages", [...Object.keys((await getMessages(request))), message]);
	if (returnSession) return session;
	return storage.commitSession(session);
}

export async function redirectWithMessage(request: Request, message: keyof Messages, url: string): Promise<Response> {
	return redirect(url, {
		headers: {
			"Set-Cookie": await addMessage(request, message) as string,
		},
	});
}

export async function alreadyConnected(request: Request) {
	const user = await getUser(request);
	if (user !== null) {
		return redirectWithMessage(request, "alreadyConnected", "/profile");
	}
	return null;
}

export async function notConnected(request: Request) {
	const user = await getUser(request);
	if (user === null) {
		return redirectWithMessage(request, "notConnected", "/login");
	}
	return null;
}
