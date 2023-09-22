const boutton_submit = document.querySelector("#boutton_submit")
const image = document.querySelector("#image")
const registerName = document.querySelector("#registerName")
const registerUsername = document.querySelector("#registerUsername")
const registerEmail = document.querySelector("#registerEmail")
const registerPassword = document.querySelector("#registerPassword")
const registerRepeatPassword = document.querySelector("#registerRepeatPassword")
const err = document.querySelector(".err")

boutton_submit.addEventListener("click", (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image.files.length > 0) {
        formData.append("photo", image.files[0]);
    }

    formData.append("nom", registerName.value);
    formData.append("username", registerUsername.value);
    formData.append("email", registerEmail.value);
    formData.append("password", registerPassword.value);
    formData.append("repetedPassword", registerRepeatPassword.value);

    fetch('/inscription', {
        method: 'POST',
        body: formData
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Erreur lors de la requête !");
            }
            return res.json();
        })
        .then(data => {
            if (data.message) {
                const error = document.createElement("p")
                error.innerHTML = data.message
                error.classList.add("error-text")
                const message_error = document.createElement("div")
                message_error.classList.add("message-error")
                message_error.appendChild(error)
                err.appendChild(message_error)
            } else {
                console.log(data);
                location.href = "li_at";
            }
        })
        .catch(error => {
            console.error(error);

        });

});

