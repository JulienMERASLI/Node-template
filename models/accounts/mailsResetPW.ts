export const resetPW = {
	from: process.env.EMAIL,
	subject: "Votre mot de passe a bien été modifié - Phoe",
	text: `Bonjour,
Votre mot de passe a bien été modifié pour votre éditeur`,
};

export const forgotPW = (host: string, token: string): {from: string, subject: string, text: string} => ({
	from: process.env.EMAIL,
	subject: "Réinitialisation de votre mot de passe - Phoe",
	text: `Bonjour,
Vous avez demandé une réinitialisation de votre mot de passe pour votre éditeur.
Pour cela, veuillez cliquer sur ce lien et entrer votre nouveau mot de passe.
https://${host}/resetPW/${token} 
Ce lien expire dans 1 heure.`,
});
