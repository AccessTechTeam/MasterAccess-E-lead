const btn_prospection = document.querySelector(".btn_prospection")
const modal = document.querySelector("#modal")
const btnClose = document.querySelector(".close")
const btnValiderModal = document.querySelector(".Validate")
const inputTextModal = document.querySelector("#inputText")
const btnCancelModal = document.querySelector(".cancel")
const btn_emailing = document.querySelector(".btn-emailing")
const close_2 = document.querySelector(".close_2")
const modal_2 = document.querySelector("#modal-2")
const name_of_list = document.querySelector(".name-of-list")
const numberOfPersonnes = document.querySelector(".numberOfPersonnes")
const container_all = document.querySelector(".container-all")
const prospect_statut_container = document.querySelector(".prospect-statut-container")
const work_flow_container = document.querySelector(".work-flow-container")
const circleZero = document.querySelector(".circles0")
const circleOne = document.querySelector(".circles1")
const circleTwo = document.querySelector(".circles2")
const circleThree = document.querySelector(".circles3")
const connectorOne = document.querySelector(".connector1")
const connectorTwo = document.querySelector(".connector2")
const connectorThree = document.querySelector(".connector3")
const statutOne = document.querySelector(".status1")
const statut2 = document.querySelector(".status2")
const btn_SecondProcess = document.createElement("button")
const status3 = document.querySelector(".status3")
const historique = document.querySelector(".historique")
const timeline_container = document.querySelector(".timeline-container")
const date_lancement = document.querySelector(".date-lancement")
const container = document.querySelector(".container")
const cards = document.querySelector(".cards")

const line = document.querySelector(".line")
const lines = document.querySelector(".lines")




fetch("/verification-campagne", { method: "GET" })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.active) {
            work_flow_container.style.display = "block"

            fetch(`/campagneElement/${data.campaignId}`, { method: "GET" })
                .then(response => response.json())
                .then(data => {

                    console.log(data)
                    if (data.data.step === 0) {
                        console.log('yess')

                        circleZero.classList.add("active-step")



                    }
                    else if (data.data.step === 1) {

                        if (!data.data.Kaspr) {
                            btn_SecondProcess.style.display = "none"
                            setTimeout(() => {
                                circleOne.classList.add("active-step")

                                circleOne.classList.add("active-step")



                                statutOne.appendChild(btn_SecondProcess)
                            }, 2050)

                            setTimeout(() => {
                                connectorTwo.classList.add("active-connector")
                            }, 2051)
                        } else {

                            setTimeout(() => {
                                circleOne.classList.add("active-step")


                                circleOne.classList.add("active-step")




                            }, 2050)


                        }
                        circleZero.classList.add("active-step")

                        connectorOne.classList.add("active-connector")



                    }

                    else if (data.data.step === 2) {

                        if (!data.data.Kaspr) {


                            setTimeout(() => {
                                circleOne.classList.add("active-step")
                                circleOne.classList.add("active-step")





                            }, 2050)

                            setTimeout(() => {
                                connectorTwo.classList.add("active-connector")

                            }, 2055)
                            setTimeout(() => {
                                circleTwo.classList.add("active-step")
                                connectorTwo.classList.add("active-connector")



                            }, 4000)




                        } else {
                            btn_SecondProcess.style.display = "block"

                            setTimeout(() => {
                                circleOne.classList.add("active-step")






                            }, 2050)

                            setTimeout(() => {
                                connectorTwo.classList.add("active-connector")

                            }, 2055)
                            setTimeout(() => {
                                circleTwo.classList.add("active-step")
                                connectorTwo.classList.add("active-connector")
                            }, 4000)



                        }

                        circleZero.classList.add("active-step")



                        connectorOne.classList.add("active-connector")




                    }
                    else if (data.data.step === 3) {
                        if (!data.data.Kaspr) {
                            setTimeout(() => {
                                circleOne.classList.add("active-step")
                                circleOne.classList.add("active-step")

                            }, 2050)

                            setTimeout(() => {
                                connectorTwo.classList.add("active-connector")

                            }, 2055)
                            setTimeout(() => {
                                circleTwo.classList.add("active-step")
                                connectorTwo.classList.add("active-connector")



                            }, 4000)
                            setTimeout(() => {
                                connectorThree.classList.add("active-connector")

                            }, 5000)
                        }
                        else {
                            circleZero.classList.add("active-step")

                            connectorOne.classList.add("active-connector")
                            setTimeout(() => {
                                circleOne.classList.add("active-step")

                            }, 2050)

                            setTimeout(() => {
                                connectorTwo.classList.add("active-connector")

                            }, 2055)
                            setTimeout(() => {
                                circleTwo.classList.add("active-step")
                                connectorTwo.classList.add("active-connector")
                            }, 4000)
                            setTimeout(() => {
                                connectorThree.classList.add("active-connector")

                            }, 4200)
                            setTimeout(() => {
                                circleThree.classList.add("active-step")
                            }, 6300)
                        }
                    }



                    const tableOfCardsCampaigns = data.data
                    const FirstLetterForIcon = data.data.nameListProspect.charAt(0).toLocaleUpperCase()

                    const iconFirstLetter = document.createElement("img")
                    iconFirstLetter.classList.add("iconFirstLetter")
                    iconFirstLetter.src = `../assets/alphabet/${FirstLetterForIcon}.svg`
                    iconFirstLetter.onerror = () => {
                        iconFirstLetter.src = "../assets/Access_icon.ico"
                    }
                    const divForIconAndNamelist = document.createElement("div")

                    divForIconAndNamelist.classList.add("icon-and-nameliste")

                    const card = document.createElement("div")
                    card.classList.add("ag-courses_item", 'test')
                    const link = document.createElement("div")
                    link.classList.add("ag-courses-item_link")
                    const item = document.createElement("div")
                    item.classList.add("ag-courses-item_bg")
                    const itemTitle = document.createElement("div")
                    itemTitle.classList.add("ag-courses-item_title")
                    const display_title = document.createElement("div")
                    display_title.classList.add("display-title")
                    const informationCard = document.createElement("h6")
                    const MoreInfo = document.createElement("div")
                    MoreInfo.classList.add("circle")
                    const nameOfCampaign = document.createElement("p")
                    nameOfCampaign.innerHTML = data.data.nameListProspect
                    informationCard.innerHTML = `<p>nombres de personnes ajoutés dans cette campagne :</p>`
                    MoreInfo.innerHTML = `<p>${data.results.inQueueFalse.length} / ${data.results.inQueueTrue.length + data.results.inQueueFalse.length}</p>`
                    display_title.appendChild(iconFirstLetter)
                    display_title.appendChild(nameOfCampaign)

                    link.appendChild(item)
                    link.appendChild(itemTitle)
                    itemTitle.appendChild(display_title)
                    itemTitle.appendChild(informationCard)
                    itemTitle.appendChild(MoreInfo)
                    card.appendChild(link)

                    container_all.appendChild(card)

                    const tableOfProspect = [...data.results.prospects]

                    console.log(tableOfProspect)

                    card.addEventListener("click", () => {
                        document.getElementById("myModal").style.display = "block";
                        prospect_statut_container.innerHTML = ""
                        tableOfProspect.forEach(prospect => {

                            const btnCancelOfProcess = document.createElement("button")
                            btnCancelOfProcess.textContent = "Sortir de la campagne"
                            btnCancelOfProcess.classList.add("btn-exit-process")
                            const prospectCard = document.createElement("div")
                            prospectCard.classList.add("ag-courses_items", "WidthCard")

                            const prospectPicture = document.createElement("img")
                            prospectPicture.classList.add("pictureProspect")
                            prospectPicture.src = prospect.photo
                            prospectPicture.onerror = () => {
                                prospectPicture.src = "../assets/Access_icon.ico"
                            }

                            const nameProspect = document.createElement("p")
                            nameProspect.classList.add("name-container")
                            nameProspect.innerHTML = prospect.nom

                            const statut = document.createElement("p")

                            const emploie = document.createElement("p")
                            emploie.classList.add("emploie-container")

                            if (((prospect.emploie).length) > 50) {
                                let test = prospect.emploie.split(" ")
                                emploie.innerHTML = test[0]

                            } else {
                                emploie.innerHTML = prospect.emploie;
                            }

                            if (prospect.processed == true && prospect.inQueue == false) {

                                prospectCard.style.backgroundColor = "rgb(132 217 152)";
                                statut.innerHTML = `<p>Prospect ajouté sur LinkedIn </p>`

                            } else if (prospect.processed == false && prospect.inQueue == false) {
                                prospectCard.classList.add("non-traité")
                                prospectCard.style.backgroundColor = "rgb(224 144 115)";
                                statut.innerHTML = "Non ajouté"
                            } else if (prospect.processed == false && prospect.inQueue == true) {
                                prospectCard.classList.add("non-traité")
                                prospectCard.style.backgroundColor = "rgb(251 215 153)";
                                statut.innerHTML = "En fil d'attente"
                            }

                            prospectCard.appendChild(prospectPicture)
                            prospectCard.appendChild(nameProspect)
                            prospectCard.appendChild(emploie)
                            prospectCard.appendChild(statut)
                            if (prospect.step === 1) {

                                prospectCard.appendChild(btnCancelOfProcess)
                                btnCancelOfProcess.addEventListener("click", () => {
                                    fetch(`/deleteProspectfromProcess/${prospect._id}`, {
                                        method: "DELETE"
                                    })
                                        .then(result => {
                                            if (result.ok) {
                                                prospectCard.remove()
                                            }
                                            else {
                                                alert("erreur l'ors de la suppression du prospect ! ")
                                            }
                                        })
                                        .catch(err => console.log(err))

                                })
                            }

                            prospect_statut_container.appendChild(prospectCard)

                        })
                    })


                    historique.addEventListener("click", () => {

                        document.getElementById("myModal").style.display = "none";
                        const timelineContainer = document.querySelector(".timeline-container");
                        timelineContainer.classList.remove("remove")
                        const date = data.data.date
                        const dateObj = new Date(date);

                        const jour = dateObj.getDate();
                        const mois = dateObj.getMonth() + 1;
                        const annee = dateObj.getFullYear();

                        const dateFormated = `${jour}/${mois}/${annee}`
                        date_lancement.innerHTML = dateFormated

                        //DOCUMENT PARENT "container"
                        // append child cards in container 


                        const timeline = data.data.timeline;
                        const groupedTimeline = [];

                        for (let i = 0; i < timeline.length; i++) {
                            if (timeline[i].event === 'New Add') {
                                const pair = [timeline[i], null];
                                if (i + 1 < timeline.length && timeline[i + 1].event === 'Force Add') {
                                    pair[1] = timeline[i + 1];
                                    i++;
                                }
                                groupedTimeline.push(pair);
                            } else if (timeline[i].event === 'Force Add') {
                                const pair = [null, timeline[i]];
                                groupedTimeline.push(pair);
                            }
                        }
                        cards.innerHTML = ""
                        lines.innerHTML = ""

                        const phase1Add = document.createElement("div")
                        phase1Add.classList.add("phase")
                        const phase2ForceAdd = document.createElement("div")
                        phase2ForceAdd.classList.add("phase")
                        const containerPhases = document.createElement("div")
                        containerPhases.classList.add("container-phases")

                        phase1Add.innerHTML = "<h4>Phase n°1</h4>"
                        phase2ForceAdd.innerHTML = "<h4>Phase n°2</h4>"


                        containerPhases.appendChild(phase1Add)
                        containerPhases.appendChild(phase2ForceAdd)

                        cards.appendChild(containerPhases)

                        for (let time of groupedTimeline) {
                            const card = document.createElement("div");
                            card.classList.add("card");

                            const newAdd = document.createElement("div");
                            newAdd.classList.add("firstAdd");

                            const forceAdd = document.createElement("div");
                            forceAdd.classList.add("secondAdd");

                            const dot = document.createElement("div")
                            dot.classList.add("dot")
                            const line = document.createElement("div")
                            line.classList.add("line")

                            lines.appendChild(dot)
                            lines.appendChild(line)


                            if (time[0]) {
                                const heure = document.createElement("h4");
                                const numbAdded = document.createElement("h4");

                                const dateObj = new Date(time[0].date);
                                const hour = dateObj.getHours();
                                const minutes = dateObj.getMinutes();
                                heure.innerHTML = `${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
                                numbAdded.innerHTML = `Personnes ajoutées : ${time[0].numberOfadding}/${time[0].nombreTotal}`;

                                const entry = document.createElement("div");
                                entry.appendChild(heure);
                                entry.appendChild(numbAdded);

                                newAdd.appendChild(entry);
                            } else {
                                const coucouText = document.createElement("h4");
                                coucouText.innerHTML = "coucou";
                                newAdd.appendChild(coucouText);
                            }


                            if (time[1]) {
                                const heure = document.createElement("h4");
                                const numbAdded = document.createElement("h4");

                                const dateObj = new Date(time[1].date);
                                const hour = dateObj.getHours();
                                const minutes = dateObj.getMinutes();
                                heure.innerHTML = `${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
                                numbAdded.innerHTML = `Personnes ajoutées : ${time[1].numberOfadding}/${time[1].nombreTotal}`;

                                const entry = document.createElement("div");
                                entry.appendChild(heure);
                                entry.appendChild(numbAdded);

                                forceAdd.appendChild(entry);
                            } else {
                                const coucouText = document.createElement("h4");
                                coucouText.innerHTML = "Toutes les personnes ont été ajoutées dans la première phase du process !";
                                forceAdd.appendChild(coucouText);
                            }




                            card.appendChild(newAdd);
                            card.appendChild(forceAdd);
                            cards.appendChild(card)
                            container.appendChild(cards);
                        }





                    })

                    // Ajoute une classe "active-step" aux étapes précédentes à currentStep



                    const btn_container = document.createElement("div")
                    btn_container.classList.add("btn-container")
                    const btn_stop_campaign = document.createElement("button")
                    btn_stop_campaign.classList.add("btn-exit-process")
                    btn_stop_campaign.innerHTML = "Arrêter la campagne"
                    btn_stop_campaign.classList.add("btn_stop_campagne")
                    btn_container.appendChild(btn_stop_campaign)
                    container_all.appendChild(btn_container)



                    btn_stop_campaign.addEventListener("click", () => {
                        fetch('/stop-campaign', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        })
                            .then(response => {
                                if (response.ok) {
                                    return response.json();
                                } else {
                                    throw new Error('Erreur lors de l\'arrêt du processus.');
                                }
                            })
                            .then(data => {
                                console.log(data.message);
                                location.href = "/dashbord"
                                console.log(data.updatedCampagne);
                            })
                            .catch(error => {
                                console.error(error);
                                // Gérer l'erreur
                            });

                    })

                })
                .catch(err => console.log(err))

        }
        else {
            const h2 = document.querySelector("h2")
            h2.innerHTML = `Vous n'avez aucune campagne active pour le moment`


        }
    })




document.getElementsByClassName("close")[0].addEventListener("click", function () {
    document.getElementById("myModal").style.display = "none";
});

window.addEventListener("click", function (event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
});




window.addEventListener("click", (e) => {
    if (e.target === timeline_container) {
        timeline_container.classList.add("remove")
    }
})