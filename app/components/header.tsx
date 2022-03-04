import { User } from "@prisma/client";
import { Form, Link, useLocation } from "remix";
import type { FC } from "react";

export const HeaderImage = () => (<Link to="/" className="lefted image">
	<img src="/images/icon.png" alt="icone" />
</Link>);

const NotConnectedNav = () => {
	const location = useLocation();
	return <nav>
		<ul>
			{location.pathname !== "/help" && <li><Link className="blue" to="/help">Aide</Link></li>}
			<li><Link className="blue" to="/login">Connexion</Link></li>
			<li><Link className="blue" to="/register">Inscription</Link></li>
		</ul>
	</nav>; };

export const NotConnectedHeader: FC = ({ children }) => (<header>
	<HeaderImage />
	{children}
	<NotConnectedNav />
</header>);

const ConnectedNav = ({ showHelp = true, showProfile = true }:{ showHelp?: boolean, showProfile?: boolean }) => (<nav>
	<ul>
		<li>
			<Form method="post" action="/logout">
				<button type="submit" className="blue" style={{ border: "none" }}>Déconnexion</button>
			</Form>
		</li>
		{showHelp && <li><Link className="blue" to="/help">Aide</Link></li>}
		{showProfile && <li><Link className="blue" to="/profile">Profil</Link></li>}
	</ul>
</nav>);

export const ConnectedHeader: FC<{ showHelp?: boolean, showProfile?: boolean }> = ({ children, showHelp = true, showProfile = true }) => (<header id="header">
	<HeaderImage />
	{children}
	<ConnectedNav showHelp={showHelp} showProfile={showProfile} />
</header>);

export const CompleteHeader: FC<{ user: User, showHelp?: boolean, showProfile?: boolean }> = ({ user, children, showHelp = true, showProfile = true }) => <header>
	<HeaderImage />
	{children}
	{Object.keys(user || {}).length > 0 ? <ConnectedNav showHelp={showHelp} showProfile={showProfile} /> : <NotConnectedNav />}
</header>;
