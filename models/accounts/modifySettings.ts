import { existsSync as exists } from "fs";
import * as fs from "fs/promises";
import { IUser, User } from "./userSchemaModel";

export async function modifySettings(oldUser: IUser, newUser: IUser): Promise<void> {
	if (newUser.username && oldUser.username !== newUser.username) {
		if (exists(`./files/${newUser.username}/`)
		|| (newUser.email && (await User.find({ email: newUser.email }).exec()).length > 0)) throw new Error("Bad request");
		if (exists(`./files/${oldUser.username}/`)) {
			await fs.rename(`./files/${oldUser.username}/`, `./files/${newUser.username}/`);
		}
	}

	Object.keys(newUser).forEach((elem) => {
		oldUser.set(elem, newUser.get(elem));
	});
	await oldUser.save();
}
