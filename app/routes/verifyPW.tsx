import { ActionFunction, json } from "remix";
import bcrypt from "bcryptjs";
import { getUserId, redirectWithMessage } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const oldPassword = form.get("oldPW");

	if (typeof oldPassword !== "string") return json({ messages: { wrongDataFormat: true } }, { status: 400 });

	const userId = await getUserId(request);
	const user = await db.user.findUnique({
		where: { id: userId?.toString() },
	});
	if (!user) return redirectWithMessage(request, "notConnected", "/login");

	const isPasswordCorrect = await bcrypt.compare(
		oldPassword,
		user.password,
	);
	return json({ isPasswordCorrect, messages: isPasswordCorrect ? {} : { wrongPassword: true } });
};
