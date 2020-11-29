const form = document.getElementsByTagName("form")[0];
form.onsubmit = (e) => {
    const PW = document.getElementById("PW");
    const PWConfirm = document.getElementById("PWConfirm");
    if (PW.value !== PWConfirm.value) {
        e.preventDefault();
        document.getElementById("PwConfirmError").style.display = "block";
        return false;
    }
    console.log(PW.value !== PWConfirm.value);
    form.submit();
};
