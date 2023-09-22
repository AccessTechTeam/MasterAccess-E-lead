const card_campaign_container = document.querySelector(".card-campaign-container")
const prospect_statut_container = document.querySelector(".prospect-statut-container")


fetch("/all-campaigns-finished", {method : "GET"})
.then(response => response.json())
.then(data => {
    console.log(data)
    const tableOfCardsCampaigns = [...data.result]
    const tableOfProspects = [...data.data]
    const tableOfProsK = [...data.prosK]
    console.log(tableOfProspects)
    console.log(tableOfCardsCampaigns)
    tableOfCardsCampaigns.forEach(element => {
        const FirstLetterForIcon = element.nameListProspect.charAt(0).toLocaleUpperCase()

        const iconFirstLetter = document.createElement("img")
        iconFirstLetter.classList.add("iconFirstLetter")
        iconFirstLetter.src = `../assets/alphabet/${FirstLetterForIcon}.svg`
        iconFirstLetter.onerror= ()=>{
            iconFirstLetter.src="../assets/Access_icon.ico"
        }
        const divForIconAndNamelist = document.createElement("div")
        
        divForIconAndNamelist.classList.add("icon-and-nameliste")

        const card = document.createElement("div")
        card.classList.add("ag-courses_item" ,'test' )
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
        nameOfCampaign.innerHTML = element.nameListProspect
        
        display_title.appendChild(iconFirstLetter)
        display_title.appendChild(nameOfCampaign)

        
        // const dateOfFinished = document.createElement("h3")
        // dateOfFinished.innerHTML= ` Date de fin : ${element.date_finished ? element.date_finished : "2023-06-08"}`
        
        const date = new Date(element.date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric' };

        const formattedDate = date.toLocaleDateString('fr-FR', options);
        const dateFinished = new Date(element.date_finished );
        const optionsFinished = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric' };

        const formattedDateFinished = dateFinished.toLocaleDateString('fr-FR', optionsFinished);

        
        informationCard.innerHTML = formattedDate

        MoreInfo.innerHTML = formattedDateFinished ? formattedDateFinished : "2023-06-05"
        // divForIconAndNamelist.appendChild(iconFirstLetter)
        // divForIconAndNamelist.appendChild(nameOfCampaign)
        link.appendChild(item)
        link.appendChild(itemTitle)
        itemTitle.appendChild(display_title) //METTRE LE TITLE ICI AVEC LA PHOTO #############
        itemTitle.appendChild(informationCard)
        itemTitle.appendChild(MoreInfo)
        card.appendChild(link)

        card.addEventListener("click", ()=>{
            document.getElementById("myModal").style.display = "block";
            prospect_statut_container.innerHTML =""
            tableOfProspects.forEach(prospect => {
                if(element._id === prospect.nameListProspectId){
                    
                    const prospectCard = document.createElement("div")
                    prospectCard.classList.add("ag-courses_item" , "WidthCard")
                    
                    const prospectPicture = document.createElement("img")
                    prospectPicture.classList.add("pictureProspect")
                    prospectPicture.src = prospect.photo
                    prospectPicture.onerror = ()=>{
                        prospectPicture.src="../assets/Access_icon.ico"
                    }
                    const nameProspect = document.createElement("p")
                    prospect.nom ? nameProspect.innerHTML = prospect.nom : null

                    if(((prospect.nom).length ) > 20){
                        let name = prospect.nom.split(" ")
                        nameProspect.innerHTML = `${name[0]}`
                    }
                    
                    const statut = document.createElement("p")
                    
                    const emploie = document.createElement("p")

                    console.log((prospect.emploie).length)
                    if(((prospect.emploie).length )> 10 ){
                        let travaille = prospect.emploie.split(" ")
                        emploie.innerHTML = `${travaille[0]}`+`...`
                    }else{
                        emploie.innerHTML = prospect.emploie
                    }

                    
                    if(prospect.processed == true && prospect.inQueue == false){
                        prospectCard.style.backgroundColor = "rgb(132 217 152)";
                        statut.innerHTML ="<p>Ajouté</p>"
                        
                    }else if(prospect.processed == false && prospect.inQueue == false){
                        prospectCard.classList.add("non-traité")
                        prospectCard.style.backgroundColor = "rgb(224 144 115)";
                        statut.innerHTML ="Non ajouté"
                    }else if (prospect.processed == false && prospect.inQueue == true){
                        prospectCard.classList.add("non-traité")
                        prospectCard.style.backgroundColor = "rgb(251 215 153)";
                        statut.innerHTML ="En fil d'attente"
                    }
                    prospectCard.addEventListener("click", ()=>{
                        const infoContainer = document.createElement("div")
                        if(tableOfProsK.length > 0){
                            prospect_statut_container.innerHTML = ""
                            tableOfProsK.forEach(prosK =>{
                                if(element._id === prosK.linkId ){
                                    // ajouter les infos de la personne si elle dois etre appeler ou pas si msg envoyé ou pas expliquer tout le statut de la personnes avec son email et son num 
                                    
                                    
                                    const nom = document.createElement("p")
                                    nom.innerHTML = prosK.nom
                                    const prenom = document.createElement("p")
                                    prenom.innerHTML = prosK.prenom
                                    const email = document.createElement("p")
                                    prosK.email.length > 0 ? email.innerHTML = prosK.email : null 
                                    const number = document.createElement("p")
                                    prosK.num.length > 0 ? number.innerHTML = prosK.num : null 
                                    const infosAboutMailSent = document.createElement("p")
                                    prosK.mailSent ? infosAboutMailSent.innerHTML ="Mail Envoyé" : null
                                    const infosAboutToCall = document.createElement("p")
                                    prosK.ToCall ? infosAboutToCall.innerHTML ="À appeler" : null 

                                    if(prosK.ToCall){
                                        const buttonDontCall = document.createElement("button")
                                        buttonDontCall.innerHTML = "Ne pas appeler"
                                        buttonDontCall.addEventListener("click", ()=>{
                                            // TO CALL TO FALSE
                                            alert("test")

                                        })
                                    }
                                    
                                }
                            })
                            
                        }

                    })

                    prospectCard.appendChild(prospectPicture)
                    prospectCard.appendChild(nameProspect)
                    prospectCard.appendChild(emploie)
                    prospectCard.appendChild(statut)
                    
                    prospect_statut_container.appendChild(prospectCard)
                }
            })
        })

        // card.appendChild(divForIconAndNamelist)
        
        // card.appendChild(dateOfFinished)
        card_campaign_container.appendChild(card)
    })

})
.catch(err => console.log(err))


document.getElementsByClassName("close")[0].addEventListener("click", function() {
    document.getElementById("myModal").style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
    }
});
