const form = document.getElementsByTagName("form")[0];
form.onsubmit = (e) => {
	const PW = document.getElementById("PW") as HTMLInputElement;
	const PWConfirm = document.getElementById("PWConfirm") as HTMLInputElement;
	if (PW.value !== PWConfirm.value) {
		e.preventDefault();
		document.getElementById("PwConfirmError").style.display = "block";
		return false;
	}
	console.log(PW.value !== PWConfirm.value);
	form.submit();
};
