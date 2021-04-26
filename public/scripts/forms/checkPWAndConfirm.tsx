const form = document.getElementsByTagName("form")[0];
form.onsubmit = (e) => {
	const PW = document.querySelector("input#PW");
	const PWConfirm = document.querySelector("input#PWConfirm");
	if (PW.value !== PWConfirm.value) {
		e.preventDefault();
		document.getElementById("PWConfirmError").style.display = "block";
		return false;
	}
	form.submit();
};
