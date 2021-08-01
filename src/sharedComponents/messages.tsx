import { forwardRef } from "preact/compat";

const Message = forwardRef<HTMLHeadingElement, { className: string } & Omit<JSX.HTMLAttributes, "ref"> & { level: number }>(({ className, children, level, ...props }, ref) => {
	const HeadingTag = `h${level}` as "h2";
	return (<HeadingTag ref={ref} class={className} {...props}>{children}</HeadingTag>);
});
export const ErrorMessage = forwardRef<HTMLHeadingElement, Omit<JSX.HTMLAttributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="error" {...props}>{children}</Message>);
export const WarningMessage = forwardRef<HTMLHeadingElement, Omit<JSX.HTMLAttributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="warning" {...props}>{children}</Message>);
export const InformationMessage = forwardRef<HTMLHeadingElement, Omit<JSX.HTMLAttributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="information" {...props}>{children}</Message>);

const MessagesComponents = { ErrorMessage, WarningMessage, InformationMessage };

type MessagesTextType = Record<string, {
	type: "Error" | "Warning" | "Information",
	text: string,
}>
const formMessagesText: MessagesTextType = {
	wrongUsername: {
		type: "Error",
		text: "Ce compte n'existe pas",
	},
	wrongPassword: {
		type: "Error",
		text: "Mot de passe erroné",
	},
	existingUser: {
		type: "Error",
		text: "Cet utilisateur existe déjà, veuillez vous connecter",
	},
	notConnected: {
		type: "Error",
		text: "Veuillez vous connecter pour acceder à cette page",
	},
	emailSent: {
		type: "Information",
		text: "Un email a été envoyé avec un lien pour réinitialiser votre mot de passe",
	},
	wrongDataFormat: {
		type: "Error",
		text: "Veuillez respecter le format des champs",
	},
	noUser: {
		type: "Error",
		text: "Aucun utilisateur n'est associé à cet email",
	},
	invalidToken: {
		type: "Error",
		text: "URL invalide",
	},
};
const profileMessageText: MessagesTextType = {
	alreadyConnected: {
		type: "Error",
		text: "Vous êtes déjà connecté",
	},
	PWModified: {
		type: "Information",
		text: "Mot de passe modifié",
	},
	registered: {
		type: "Information",
		text: "Bienvenue, vous pouvez désormais créer votre premier projet, consultez notre <a href='/help'>page d'aide</a>",
	},
	settingsChanged: {
		type: "Information",
		text: "Paramètres modifiés",
	},
	pageNotFound: {
		type: "Error",
		text: "La page n'existe pas",
	},
	nonExistingProject: {
		type: "Error",
		text: "Ce projet n'existe pas",
	},
};
const messagesText: MessagesTextType = {
	...formMessagesText,
	...profileMessageText,
};
export function getMessages(messages: Record<string, unknown>): JSX.Element {
	const messagesElement: string[] = [];
	Object.keys(messages).forEach(message => {
		if (messages[message] && message in messagesText) {
			messagesElement.push(message);
		}
	});
	return <>{messagesElement.map(message => {
		const messageText = messagesText[message];
		const Component = MessagesComponents[`${messageText.type}Message` as "ErrorMessage"];
		return <Component dangerouslySetInnerHTML={{ __html: messageText.text }} key={message} />;
	})}</>;
}
