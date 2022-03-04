import { createContext, forwardRef } from "react";
import { Link } from "remix";
import { State } from "./overlay";

type Attributes = React.HTMLAttributes<HTMLElement>;

const Message = forwardRef<HTMLHeadingElement, { className: string } & Omit<Attributes, "ref"> & { level: number }>(({ className, children, level = 3, ...props }, ref) => {
	const HeadingTag = `h${level}` as "h2";
	return (<HeadingTag ref={ref} className={className} {...props}>{children}</HeadingTag>);
});
export const ErrorMessage = forwardRef<HTMLHeadingElement, Omit<Attributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="error" {...props}>{children}</Message>);
export const WarningMessage = forwardRef<HTMLHeadingElement, Omit<Attributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="warning" {...props}>{children}</Message>);
export const InformationMessage = forwardRef<HTMLHeadingElement, Omit<Attributes, "ref"> & { level?: number }>(({ children, level = 3, ...props }, ref) => <Message level={level} ref={ref} className="information" {...props}>{children}</Message>);

const errors = {
	wrongUsername: "Ce compte n'existe pas",
	wrongPassword: "Mot de passe erroné",
	existingUser: "Cet utilisateur existe déjà, veuillez vous connecter",
	notConnected: "Veuillez vous connecter pour acceder à cette page",
	wrongDataFormat: "Veuillez respecter le format des champs",
	noUser: "Aucun utilisateur n'est associé à cet email",
	invalidToken: "URL invalide",
	unexpectedError: "Une erreur innatendue s'est produite. Veuillez réessayer plus tard",
	passwordMismatch: "Le mot de passe et la confirmation doivent correspondre",
	existingEmail: "Un compte avec cet email existe déjà, veuillez en choisir un autre",
	existingUsername: "Un compte avec ce pseudo existe déjà, veuillez en choisir un autre",
	alreadyConnected: "Vous êtes déjà connecté",
	pageNotFound: "La page n'existe pas",
	nonExistingProject: "Ce projet n'existe pas",
};

const warnings = {
};

const informations = {
	emailSent: "Un email a été envoyé avec un lien pour réinitialiser votre mot de passe",
	PWModified: "Mot de passe modifié",
	registered: () => <>Bienvenue, vous pouvez désormais créer votre premier projet, consultez notre <Link to="/help">page d'aide</Link></>,
	settingsChanged: "Paramètres modifiés",
};

const MessagesComponents = { ErrorMessage, WarningMessage, InformationMessage };

type MessageType = "Error" | "Warning" | "Information";
type Message = keyof typeof errors | keyof typeof warnings | keyof typeof informations;

export type Messages = Partial<Record<Message, boolean>>
export type MessagesTextType<T = Messages> = Record<keyof T, {
	type: MessageType,
	text: string | (() => JSX.Element),
}>

function convertMessages<T extends Partial<Record<Message, string |(() => JSX.Element)>>>(messages: T, type: MessageType): MessagesTextType<T> {
	const convertedMessages = {} as MessagesTextType<T>;
	Object.keys(messages).forEach(message => {
		const text = messages[message as Message];
		convertedMessages[message as Message] = {
			type,
			text: text!,
		};
	});
	return convertedMessages;
}

const messagesText: MessagesTextType = {
	...convertMessages(errors, "Error"),
	...convertMessages(warnings, "Warning"),
	...convertMessages(informations, "Information"),
};

export const Messages = ({ messages, level = 3 }: { messages: Messages | undefined, level?: number }): JSX.Element => {
	const messagesElement: string[] = [];
	Object.keys((messages ?? {})).forEach(message => {
		if ((messages ?? {})[message as keyof Messages] && message in messagesText) {
			messagesElement.push(message);
		}
	});
	return <>{messagesElement.map(message => {
		const messageText = messagesText[message as "registered"];
		const Component = MessagesComponents[`${messageText.type}Message` as "ErrorMessage"];
		if (typeof messageText.text === "string") return <Component key={message} level={level}>{messageText.text}</Component>;
		const Text = messageText.text;
		return <Component key={message} level={level}><Text /></Component>;
	})}</>;
};

export const MessagesContext = createContext({} as State<Messages, "messages">);
