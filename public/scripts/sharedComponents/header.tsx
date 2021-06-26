import { FunctionComponent } from "preact";
import { IUser } from "../../../models/accounts/userSchemaModel";

const HeaderImage = () => (<a href="/" class="lefted image">
	<img src="/images/icon.png" alt="icone"/>
</a>);

const NotConnectedNav = () => (<nav>
	<ul>
		<li><a class="blue" href="/login">Connexion</a></li>
		<li><a class="blue" href="/register">Inscription</a></li>
	</ul>
</nav>);

export const NotConnectedHeader: FunctionComponent = ({ children }) => (<header>
	<HeaderImage />
	{children}
	<NotConnectedNav />
</header>);

const ConnectedNav = () => (<nav>
	<ul>
		<li><a class="blue" href="/logout">Déconnexion</a></li>
		<li><a class="blue" href="/profile">Profil</a></li>
	</ul>
</nav>);

export const ConnectedHeader: FunctionComponent = ({ children }) => (<header id="header">
	<HeaderImage />
	{children}
	<ConnectedNav />
</header>);

export const CompleteHeader: FunctionComponent<{ user: IUser }> = ({ children, user }) => (<header>
	<HeaderImage />
	{children}
	{Object.keys(user || {}).length > 0 ? <ConnectedNav /> : <NotConnectedNav />}
</header>);
