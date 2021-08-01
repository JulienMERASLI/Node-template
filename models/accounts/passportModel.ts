import * as passportLocal from "passport-local";
const { Strategy: LocalStrategy } = passportLocal;
import * as passport from "passport";
import * as bcrypt from "bcryptjs";
import { User, IUser } from "./userSchemaModel";
import { app } from "../../server";

passport.serializeUser((user, cb) => {
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
			req.session.messages.push("wrongUsername");
			return cb(null, false);
		}
		bcrypt.compare(PW, user.PW!).then(v => {
			if (v) {
				return cb(null, user);
			}
			req.session.messages.push("wrongPassword");
			return cb(null, false);
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
