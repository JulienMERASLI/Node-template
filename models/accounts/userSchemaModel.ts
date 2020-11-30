import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
	username?: string,
	PW?: string,
	email?: string,
	resetPasswordToken?: string,
	resetPasswordExpires?: Date | number,
}

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	PW: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
});

UserSchema.pre("save", function (next) {
	const user: IUser = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("PW")) return next();

	// generate a salt
	bcrypt.genSalt(12)
		.then(salt => {
			bcrypt.hash(user.PW, salt)
				.then(hash => {
					user.PW = hash;
					next();
				})
				.catch(err => next(err));
		})
		.catch(err => next(err));
});

export const User = mongoose.model<IUser>("User", UserSchema);
