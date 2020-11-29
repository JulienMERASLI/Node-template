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
		.then(async regs => {
			navigator.serviceWorker.register("/pwa_sw.js");
			for (const reg of regs) {
				reg.update();
			}
		})
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
