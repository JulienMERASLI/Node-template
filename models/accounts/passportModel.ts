import * as passportLocal from "passport-local";
const { Strategy: LocalStrategy } = passportLocal;
import * as passport from "passport";
import * as bcrypt from "bcryptjs";
import { Document } from "mongoose";
import { User, IUser } from "./userSchemaModel";
import { app } from "../../server";

passport.serializeUser((user: Document, cb) => {
	cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
	User.findById(id)
		.then(user => cb(null, user))
		.catch(err => cb(err));
});

passport.use(new LocalStrategy({ usernameField: "username", passwordField: "PW", passReqToCallback: true }, (req, username, PW, cb) => {
	function callback(users: IUser[]) {
		const user = users[0];
		if (!user) {
			return cb(null, false, { message: "Incorrect username." });
		}
		bcrypt.compare(PW, user.PW).then(v => {
			if (v) {
				return cb(null, user);
			}
			return cb(null, false, { message: "Incorrect password." });
		});
	}
	if (req.session.connectedWithEmail === true) {
		User.find({ email: username })
			.then(users => callback(users))
			.catch(err => cb(err));
		req.session.connectedWithEmail = undefined;
	}
	else {
		User.find({ username })
			.then(users => callback(users))
			.catch(err => cb(err));
	}
}));

app.use(passport.initialize());
app.use(passport.session());
