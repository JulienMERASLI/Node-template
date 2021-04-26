const changeConnectionType = document.querySelector("button#changeConnectionType");

changeConnectionType.onclick = (e) => {
	if (e) {
		e.preventDefault();
	}
	let input = document.querySelector("input#username");
	if (input) {
		const label: HTMLLabelElement = document.querySelector(`label[for=${input.id}`);
		input.setAttribute("name", "email");
		input.setAttribute("id", "email");
		input.setAttribute("type", "email");
		label.htmlFor = "email";
		label.innerText = "Email:";
		changeConnectionType.innerText = changeConnectionType.innerText.replace("l'email", "le pseudo");
		sessionStorage.setItem("preferedConnection", "email");
	}
	else {
		input = document.querySelector("input#email");
		const label: HTMLLabelElement = document.querySelector(`label[for=${input.id}`);
		input.setAttribute("name", "username");
		input.setAttribute("id", "username");
		input.setAttribute("type", "text");
		label.htmlFor = "username";
		label.innerText = "Pseudo:";
		changeConnectionType.innerText = changeConnectionType.innerText.replace("le pseudo", "l'email");
		sessionStorage.setItem("preferedConnection", "pseudo");
	}
};

if (sessionStorage.getItem("preferedConnection") === "email") {
	changeConnectionType.onclick(null);
	const error = document.querySelector("h2.error");
	if (error) error.innerText = error.innerText.replace("Pseudo", "Email");
}
