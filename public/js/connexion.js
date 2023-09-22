const loginBtn = document.querySelector("#tab-login")
const registerBtn = document.querySelector("#tab-register")
const container_signup = document.querySelector(".container_signup")
const tab_content = document.querySelector(".tab-content")
const nav_item = document.querySelector(".nav-item")
const err = document.querySelector(".err")


/* CONNEXION */

const loginName = document.querySelector("#loginName")
const LoginPassword = document.querySelector("#loginPassword")
const btn_login = document.querySelector("#btn_login")






btn_login.addEventListener("click", (e) => {

    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: loginName.value,
            password: LoginPassword.value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.messageError) {

                console.log(data.messageError)
                const error = document.createElement("p")
                error.innerHTML = data.messageError
                error.classList.add("error-text")
                const message_error = document.createElement("div")
                message_error.classList.add("message-error")
                message_error.appendChild(error)
                err.appendChild(message_error)

            } else {

                
                location.href = "/dashbord"


            }

        }
        )
        .catch(err => {
            console.log(err)
        })
})





