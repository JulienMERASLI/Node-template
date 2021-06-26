import { IUser } from "../models/accounts/userSchemaModel";

declare module "express-session" {
	export interface Session {
		messages?: Array<string>;
		returnTo?: string;
		connectedWithEmail?: boolean;
	}
}

interface RenderParams {
	title: string;
	css: string;
	js: string;
	options: Record<string, unknown>;
}
declare global {
	namespace Express {
		export interface User extends IUser {
		}
	}
}

declare namespace Mongoose {
	export interface Document {
		id(arg0: null, id);
	}
}
