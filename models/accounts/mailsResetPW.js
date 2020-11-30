"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPW = exports.resetPW = void 0;
exports.resetPW = {
    from: process.env.EMAIL,
    subject: "Votre mot de passe a bien été modifié - Phoe",
    text: "Bonjour,\nVotre mot de passe a bien \u00E9t\u00E9 modifi\u00E9 pour votre \u00E9diteur",
};
var forgotPW = function (host, token) { return ({
    from: process.env.EMAIL,
    subject: "Réinitialisation de votre mot de passe - Phoe",
    text: "Bonjour,\nVous avez demand\u00E9 une r\u00E9initialisation de votre mot de passe pour votre \u00E9diteur.\nPour cela, veuillez cliquer sur ce lien et entrer votre nouveau mot de passe.\nhttps://" + host + "/resetPW/" + token + " \nCe lien expire dans 1 heure.",
}); };
exports.forgotPW = forgotPW;
