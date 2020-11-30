const changeConnectionType = document.getElementById("changeConnectionType");

changeConnectionType.onclick = (e) => {
	if (e) {
		e.preventDefault();
	}
	let input = document.getElementById("username");
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
		input = document.getElementById("email");
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
	const error = document.getElementsByClassName("error")[0] as HTMLElement;
	if (error) error.innerText = error.innerText.replace("Pseudo", "Email");
}
