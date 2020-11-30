var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if (!navigator.onLine) {
    document.body.style.pointerEvents = "none";
    document.getElementById("notConncted").style.display = "block";
}
if (window.location.href.includes("mode=standalone")) {
    document.getElementById("downloads").style.display = "none";
    const mail = document.getElementById("mail");
    mail.style.height = `${document.querySelector("footer").offsetHeight}px`;
    mail.style.marginTop = "0";
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then((regs) => __awaiter(this, void 0, void 0, function* () {
        navigator.serviceWorker.register("/pwa_sw.js");
        for (const reg of regs) {
            reg.update();
        }
    }))
        .catch(err => console.error(err));
}
let deferredPrompt;
const addBtn = document.getElementById("downloads");
addBtn.style.display = "none";
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = "block";
    addBtn.addEventListener("click", () => {
        addBtn.style.display = "none";
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
        });
    });
});
