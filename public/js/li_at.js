
const li_at = document.querySelector('#li_at');
const btn_li_at = document.querySelector('#btn_li_at');







btn_li_at.addEventListener('click', (e) => {


    e.preventDefault()
    fetch('/li_at', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            li_at: li_at.value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.log("ici", data.error)
            } else {

                location.href = "connexion"


            }
        }
        )
        .catch(err => console.log(err))

})

