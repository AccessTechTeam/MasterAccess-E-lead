
const nb_of_fav = document.querySelector(".nb-of-fav")
const container_fav = document.querySelector(".container-fav")
const btn_delete_all_fav = document.querySelector(".btn-delete-all-fav")
const lancement_campagne = document.querySelector(".lancement-campagne")
const cross_x_container = document.querySelector(".cross_x_container")
const cross_x_containers = document.querySelector(".cross_x_containers")
const overlay = document.querySelector("#overlay")
const launchCampaign = document.querySelector("#launchCampaign")
const campaignName = document.querySelector("#campaignName")
const myOverlay = document.querySelector(".myOverlay")
const dyna_msg_title = document.querySelector(".dyna-msg-title")
const dyna_msg = document.querySelector(".dyna-msg")
fetch("/get-favoris", { method: "GET" })
    .then(response => response.json())
    .then(data => {
        console.log(data)

        if (data) {
            nb_of_fav.innerHTML = `${data.result.length}`
        }
        const tableUrlOfFav = []
        for (let i in data.result) {
            console.log(data.result[i])
            const card = document.createElement("div")
            card.classList.add("card-fav")
            const name_profile = document.createElement("h2")
            const travail = document.createElement("h3")
            const lieu = document.createElement("h4")
            const input = document.createElement("input")
            const div_for_btn = document.createElement("div")
            const div_for_text = document.createElement("div")
            const btn = document.createElement("button")
            const cross = document.createElement("div");
            cross.classList.add("cross")
            cross.innerHTML = "&#10006;";
            const header_btn_container = document.createElement("div")
            header_btn_container.classList.add("cross_input_container")
            header_btn_container.appendChild(input)
            header_btn_container.appendChild(cross)


            btn.classList.add("btn-invite")
            div_for_btn.classList.add("div_for_btn")
            input.type = "checkbox"
            input.classList.add("input")
            div_for_text.classList.add("div_for_text")
            const pictures = document.createElement("img")
            pictures.classList.add("img-fav")
            pictures.src = data.result[i].photo_profile
            pictures.onerror = () => {
                pictures.src = "../assets/Access_icon.ico"
            }
            btn.textContent = "Enrichir avec Kaspr"

            div_for_btn.appendChild(btn)

            const emploieText = data.result[i].emploie
            const emploieParts = emploieText.split("chez")
            const emploieAfterChez = emploieParts[1]


            div_for_text.appendChild(travail)
            lieu.textContent = data.result[i].lieu_emploie
            travail.textContent = data.result[i].emploie.includes("chez") ? emploieAfterChez : data.result[i].emploie

            name_profile.textContent = data.result[i].profile
            card.appendChild(header_btn_container)

            card.appendChild(pictures)
            card.appendChild(name_profile)
            card.appendChild(div_for_text)
            card.appendChild(lieu)
            card.appendChild(div_for_btn)

            cross.addEventListener("click", () => {

                fetch(`/favoris/one/${data.result[i]._id}`, { method: "DELETE" })
                    .then(response => {
                        response.json()
                        if (response.ok) {
                            if (response.status === 200) {
                                card.remove()
                                nb_of_fav.innerHTML = `${data.result.length - 1}`
                            }
                        }
                    })
                    .catch(err => console.log(err))
            })

            input.addEventListener("click", () => {

                if (input.checked) {
                    tableUrlOfFav.push({
                        url: data.result[i].lien_linkedin,
                        campId: data.result[i].nameListProspect,
                    })
                }
                if (!input.checked) {
                    let index = tableUrlOfFav.indexOf(data.result[i].lien_linkedin);
                    if (index !== -1) {
                        tableUrlOfFav.splice(index, 1);
                    }
                }

            })


            container_fav.appendChild(card)


        }
        lancement_campagne.addEventListener("click", () => {

            if (tableUrlOfFav.length > 0) {
                overlay.style.display = 'block';

                launchCampaign.addEventListener("click", () => {
                    const nameListProspect = campaignName.value
                    if (nameListProspect == "") {
                        alert("vous devez renseigner un nom pour la campagne ! ")
                    } else {
                        fetch("/favoris/campagne",
                            {
                                method: 'POST',
                                body: JSON.stringify({ data: tableUrlOfFav, nameListProspect }),
                                headers: {
                                    "Content-Type": "application/json"
                                }

                            })
                            .then(response => {
                                response.json()
                                if (response.status === 500) {

                                    overlay.style.display = 'none';
                                    myOverlay.classList.add('open');
                                    dyna_msg_title.innerHTML = `Campagne déja active ⏳`
                                    dyna_msg.innerHTML = `Une campagne est deja active , veuillez attendre que celle ci sois terminée !`


                                }
                                else if (response.status === 200) {
                                    overlay.style.display = 'none';
                                    myOverlay.classList.add('open');
                                    fetch("/lancement-campagne", {
                                        method: "POST",
                                        headers: {
                                            body: null,
                                            "Content-Type": "application/json"
                                        }

                                    })
                                        .then(response => response.json())
                                        .then(data => console.log(data))
                                        .catch(err => console.log(err))
                                    dyna_msg_title.innerHTML = `Campagne lancée 🥳`
                                    dyna_msg.innerHTML = `Votre campagne viens d'etre lancée avec succès !`
                                }
                            })

                            .catch(err => console.log(err))

                    }

                })
            }
            else {
                alert("Vous devez selectionner aumoin un prospect !")

            }


        })


    })
    .catch(err => console.log(err))


btn_delete_all_fav.addEventListener("click", () => {

    fetch("/favoris/all", { method: "DELETE" })
        .then(response => {
            response.json()
            if (response.ok) {
                if (response.status === 200) {
                    container_fav.remove()
                    nb_of_fav.innerHTML = `${0}`
                }
            }
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
})



overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});

cross_x_container.addEventListener("click", () => {
    overlay.style.display = 'none';
})





myOverlay.addEventListener('click', function (event) {
    if (event.target === myOverlay) {
        myOverlay.classList.remove('open');
    }
});
cross_x_containers.addEventListener("click", () => {
    myOverlay.classList.remove('open');
})
