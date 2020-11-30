export const resetPW = {
	from: process.env.EMAIL,
<<<<<<< HEAD
	subject: "Votre mot de passe a bien été modifié - Phoe",
=======
	subject: "Votre mot de passe a bien été modifié - Editeur",
>>>>>>> 482b9ef915927dd61b77243c48dd24dc9b73ef44
	text: `Bonjour,
Votre mot de passe a bien été modifié pour votre éditeur`,
};

export const forgotPW = (host: string, token: string): {from: string, subject: string, text: string} => ({
	from: process.env.EMAIL,
<<<<<<< HEAD
	subject: "Réinitialisation de votre mot de passe - Phoe",
=======
	subject: "Réinitialisation de votre mot de passe - Editeur",
>>>>>>> 482b9ef915927dd61b77243c48dd24dc9b73ef44
	text: `Bonjour,
Vous avez demandé une réinitialisation de votre mot de passe pour votre éditeur.
Pour cela, veuillez cliquer sur ce lien et entrer votre nouveau mot de passe.
https://${host}/resetPW/${token} 
Ce lien expire dans 1 heure.`,
});
