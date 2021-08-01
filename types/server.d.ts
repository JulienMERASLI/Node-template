import { IUser } from "../models/accounts/userSchemaModel";

declare module "express-session" {
	export interface Session {
		messages: Array<string>;
		returnTo?: string;
		connectedWithEmail?: boolean;
	}
}
interface IProcessEnv {
	MONGODB_URI: string;
	EMAIL: string;
	EMAIL_PW: string;
}

declare global {
	namespace Express {
		export interface User extends IUser {
		}
		export interface Response {
			title: string;
			options: Record<string, unknown>;
			styles: string[];
		}
	}
	namespace NodeJS {
		export interface ProcessEnv extends IProcessEnv {}
	}
}

declare namespace Mongoose {
	export interface Document {
		id(arg0: null, id: unknown): void;
	}
}
