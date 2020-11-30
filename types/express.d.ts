import { IUser } from "../models/accounts/userSchemaModel";

declare module "express-session" {
	export interface Session {
		messages?: Array<string>;
		returnTo?: string;
		connectedWithEmail?: boolean;
	}
}

declare global {
	namespace Express {
		export interface Request {
			user?: IUser;
		}
	}
}