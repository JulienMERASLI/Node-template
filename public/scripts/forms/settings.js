import { closeOverlay, showOverlay } from "../overlay.js";
const cancel = document.getElementById("cancel");
cancel.onclick = () => {
    closeOverlay(document.getElementById("overlay"), document.getElementById("content"));
};
window.onload = () => {
    const form = document.getElementById("modifyForm");
    function getAllInputs() {
        const body = {};
        Array.from(form.getElementsByTagName("input")).forEach(input => {
            if (input.type === "submit")
                return;
            if (input.value === null || input.value === "")
                return;
            body[input.name] = input.value;
        });
        return body;
    }
    window.onbeforeunload = (e) => {
        if (Object.keys(getAllInputs()).length > 0) {
            e.preventDefault();
            e.returnValue = "";
        }
    };
    form.onsubmit = (e) => {
        e.preventDefault();
        const PW = document.getElementById("PW");
        const PWConfirm = document.getElementById("PWConfirm");
        if (PW.value !== PWConfirm.value) {
            e.preventDefault();
            document.getElementById("PWConfirmError").style.display = "block";
            return false;
        }
        document.getElementById("PWConfirmError").style.display = "none";
        const body = getAllInputs();
        if (Object.keys(body).length > 0) {
            const overlay = document.getElementById("overlay");
            const content = document.getElementById("content");
            const error = overlay.getElementsByClassName("error")[0];
            error.style.display = "none";
            const oldPW = document.getElementById("oldPW");
            oldPW.focus();
            showOverlay("overlay", content, false, () => {
                fetch("/verifyPW", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        PW: oldPW.value,
                    }),
                })
                    .then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                    error.innerText = "Une erreur innatendue s'est produite. Veuillez réessayer plus tard";
                    error.style.display = "block";
                    oldPW.value = "";
                })
                    .then(value => {
                    if (value === true) {
                        fetch("/settings", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })
                            .then((res) => {
                            if (res.ok) {
                                console.log(res.status, res.statusText);
                                window.onbeforeunload = null;
                                window.location.href = "/profile";
                            }
                            else {
                                error.innerText = "Une erreur innatendue s'est produite. Veuillez réessayer plus tard";
                                error.style.display = "block";
                                PW.value = "";
                            }
                        });
                    }
                    else if (error.style.display === "none") {
                        error.innerText = "Mot de passe erroné";
                        error.style.display = "block";
                        oldPW.value = "";
                    }
                });
            });
        }
    };
};
