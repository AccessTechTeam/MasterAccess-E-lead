const btn = document.querySelector(".button-validate")
const selectAllCheckbox = document.getElementById("select-all");
const displayed_btn = document.querySelector(".displayed_btn")
const messages = document.querySelector(".messages")
const destinataire = document.querySelector(".destinataire")
const lead_container= document.querySelector(".lead_container")
const contains = document.querySelector(".contains")
const valider_message = document.querySelector("#valider_message")
const button_modifymsg =document.querySelector(".button-modifymsg")
const next_step = document.querySelector("#next_step")
const lancement = document.querySelector(".lancement")
const cards = document.querySelector(".cards")
const btn_params = document.querySelector("#btn_params")
const previous = document.querySelector(".previous")
const prevent = document.querySelector(".prevent")
const textarea = document.querySelector("textarea")
const button_dontSendmsg = document.querySelector(".button-dontSendmsg")
const icon= document.querySelector(".icon")
const icon1 = document.querySelector(".icon1")
const modal = document.querySelector(".modal")
const mailing_btn = document.querySelector(".button-mails")
const invits_btn = document.querySelector(".button-invits")
const invitation_deroulement = document.querySelector(".invitation-linkedin")
const mailing_deroulement = document.querySelector(".mailing")
const button_enrichir = document.querySelector(".button-enrichir")
const nom_de_la_liste = document.querySelector(".nom_de_la_liste")
const nombre_de_leads = document.querySelector(".nombre_de_leads")
const dropcontact = document.querySelector(".dropcontact")
const drop_text= document.querySelector(".drop-text")
const destinataire_mailing =document.querySelector(".destinataire-mailing")
const dropcontact_container = document.querySelector(".dropcontact-container")
const container_cosmonaute = document.querySelector(".container-cosmonaute")
const main = document.querySelector("main")



fetch("/verification-campagne" , {method : "GET"})
.then(response => response.json())
.then(data => {
  
  
  console.log(data)
  if(data.active){
    main.style.display = "none"
    document.body.style.backgroundColor = "black"

    container_cosmonaute.style.display = "block"
    
  }else{
    mailing_btn.addEventListener("click", ()=>{
      invitation_deroulement.classList.add("hidden")
      mailing_deroulement.classList.add("show")
      invits_btn.classList.remove("linkedin-color")
      mailing_btn.classList.add("focus-btn")
      button_enrichir.classList.remove("hidden")
      btn.classList.add("hidden")
      nom_de_la_liste.classList.add("drop-color")
      nombre_de_leads.classList.add("drop-color")
      button_enrichir.classList.add("drop-color")
    })
    
    invits_btn.addEventListener("click", ()=>{
      invitation_deroulement.classList.remove("hidden")
      mailing_deroulement.classList.remove("show")
      invits_btn.classList.add("linkedin-color")
      mailing_btn.classList.remove("focus-btn")
      button_enrichir.classList.add("hidden")
      btn.classList.remove("hidden")
      nom_de_la_liste.classList.remove("drop-color")
      nombre_de_leads.classList.remove("drop-color")
      button_enrichir.classList.remove("drop-color")
    
    })
    
    
    
    icon.addEventListener("click", ()=>{
      icon.classList.add("hidden")
      icon1.classList.remove("hidden")
      modal.style.display="block"
      
    })
    
    icon1.addEventListener("click", ()=>{
      icon1.classList.add("hidden")
      icon.classList.remove("hidden")
      modal.style.display="none"
      
      
    })
    
    
    
    const displayed_icon = document.querySelector(".displayed_icon")
    
    displayed_btn.style.display= "none"
    
    
    
    button_enrichir.addEventListener("click", (e)=>{
      const leadCheckboxes = document.querySelectorAll(".lead-checkbox");
          let checked = false;
          leadCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
              checked = true;
            }
          });
          if (!checked) {
    
            alert("Vous devez cocher au moins une case");        
    
          }else{
            
            displayed_icon.style.display = "block"
            dropcontact.style.borderBottom = "3px solid black"
            dropcontact.style.fontWeight ="bold"
            dropcontact.style.color ="black"
            lead_container.style.display ="none"
            destinataire_mailing.style.color="#a8adb2"
            destinataire_mailing.style.border ="none"
            dropcontact_container.classList.remove("hidden")
            
    
            // FAIRE UN ENRICHISSEMENT DU PROSPECT ET APRES UNE REQUETE DROP CONTACT ET ENVOYÉ DANS LA BASE DE DONNEE LES PROSPECT "COMPLET"
    
            fetch("/enrichissementForDrop", {
              method : "GET"
            })
            .then(result => console.log(result))
            .catch(err => console.log(err))
    
    
    
          }
    
    
    })
    
    
    btn.addEventListener("click", function(event) {
    
          
        
          const leadCheckboxes = document.querySelectorAll(".lead-checkbox");
          let checked = false;
          leadCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
              checked = true;
            }
          });
          if (!checked) {
    
            alert("Vous devez cocher au moins une case");        
    
          } else {
            
    
            displayed_icon.style.display = "block"
            event.preventDefault()
            
            messages.style.color = "black"
            messages.style.borderBottom = "3px solid black"
            destinataire.style.color ="#a8adb2"
            destinataire.style.border ="none"
            lead_container.style.display ="none"
            contains.style.display ="block"
            
    
    
            prevent.addEventListener("click", (e)=>{
    
              e.preventDefault()
              messages.style.color = "#a8adb2"
              messages.style.border ="none"
              destinataire.style.color ="black"
              destinataire.style.borderBottom = "3px solid black"
              destinataire.style.border ="block"
              lead_container.style.display ="block"
              contains.style.display ="none"
              displayed_icon.style.display = "none"
              lancement.style.color ="#a8adb2"
              lancement.style.border ="none"
    
    
              
            })
          }
          
            
    
        
      });
    
      let bouton1AClique = false;
      let bouton2AClique = false;
      let global_btn_var = document.querySelector(".global_btn_var")
    
      
    
      function insertVariable(variable) {
        document.querySelector('textarea').value += variable;
      }
    
      
    
      const urlParams = new URLSearchParams(window.location.search);
      
      const campaignId = urlParams.get('campaignId');
      
      const campsIdForSelectedPersons = urlParams.get('campaignId').split('/')[0]


      if(campaignId.includes("persons")){
        
        fetch(`/campagnes_mailing/${campaignId}`)
        .then(response => response.json())
        .then(data => {
          
          
          console.log("HEY HEY BABY" , data)
      
      
          // METTRE UNE CONDITION POUR ENLEVER "UTILISATEUR LINKEDIN"
          
          
          data = data.filter(datas => datas.profile !== 'Utilisateur LinkedIn')
      
          console.log("NEW DATA", data)
          
          let parent = document.querySelector("#parentProfils")
          let LinksLinkedin = []
          let moreDetails = []
          let count = 0
          
      
          data.forEach((datas) => {
            // Vérifier si le profil contient le mot "Utilisateur"
            if (datas.profile.includes("Utilisateur" ) ) {
              // Ne pas ajouter la ligne correspondante
              count++
      
              return;
            }
            
            LinksLinkedin.push( {
              link : datas.lien_linkedin, 
              nom : datas.profile,
              photo : datas.photo_profile, 
              emploie : datas.emploie ,
              entreprise : datas.entreprise_actuelle,
              lieu_emploie : datas.lieu_emploie
              
            });
            moreDetails.push({
              link : datas.lien_linkedin,
              
  
            })
            let rowProfile = document.createElement("tr");
            let checkbox = document.createElement("td");
            let checkboxInput = document.createElement("input");
            let emploie = document.createElement("td");
            let entreprise_actuelle = document.createElement("td");
            let ville = document.createElement("td");
            let email = document.createElement("td");
            checkboxInput.type = "checkbox";
            checkboxInput.classList.add("lead-checkbox");
            let img = document.createElement("td");
            let imgSrc = document.createElement("img");
            let nom = document.createElement("td");
            checkbox.classList.add("checkbox");
            checkbox.appendChild(checkboxInput);
      
      
            nom.classList.add("nom");
            nom.innerText = datas.profile;
            
            imgSrc.classList.add("photo_prospect");
            
            const emploieTexte = datas.emploie.split("chez")[0];
            const emploies = emploieTexte ? emploieTexte.trim() : datas.emploie;
            emploie.innerText = emploies
      
          
            const entrepriseTexte = datas.entreprise_actuelle.split("chez")[1];
            const entreprise = entrepriseTexte ? entrepriseTexte.trim() : datas.entreprise_actuelle;
            entreprise_actuelle.innerText = entreprise;
      
            email.innerHTML = `commingSoonWithDropContact`;
          
            ville.classList.add("ville");
            ville.innerText = datas.lieu_emploie;
            imgSrc.src = datas.photo_profile;
            imgSrc.onerror= ()=>{
              imgSrc.src = "../assets/Access_icon.ico"
            }
          
            img.classList.add("picture");
            img.appendChild(imgSrc);
          
            rowProfile.appendChild(checkbox);
            rowProfile.appendChild(img);
            rowProfile.appendChild(nom);
            rowProfile.appendChild(emploie);
            rowProfile.appendChild(entreprise_actuelle);
            rowProfile.appendChild(email);
            rowProfile.appendChild(ville);
            parent.appendChild(rowProfile);
      
          });
      
      
          const datalength = data.length-count
          console.log(datalength)
          nombre_de_leads.innerHTML = datalength
      
          
          const selectAllCheckbox = document.querySelector("#select-all");
          selectAllCheckbox.addEventListener("change", function() {
            const leadCheckboxes = document.querySelectorAll(".lead-checkbox");
            leadCheckboxes.forEach(function(checkbox) {
              checkbox.checked = selectAllCheckbox.checked;
            });
          })
      
          button_dontSendmsg.addEventListener("click", ()=>{
            
            textarea.disabled = true;
            textarea.placeholder=""
            bouton1AClique = true;
            button_modifymsg.style.display="block"
            valider_message.style.display="none"
            button_dontSendmsg.style.display="none"
            displayed_btn.style.display = "block"
            textarea.value = ""
            const message = textarea.value
            
            
      
            next_step.addEventListener("click", async () => {
              
              lancement.style.color = "black";
              lancement.style.borderBottom = "3px solid black";
              messages.style.color = "#a8adb2";
              messages.style.border = "none";
              lead_container.style.display = "none";
              contains.style.display = "none";
              cards.style.display = "block";
              const verdict_container =document.querySelector(".verdict_container")
              verdict_container.style.display = "block"
              
              // PARTIE SANS MESSAGE 
  
              const processLink = async (link , nameListProspectId , message) => {
                try {
                  const encodedLinks = encodeURIComponent(JSON.stringify(LinksLinkedin));
                  
        
                  const dataToSend = { 
                    lien: link,
                    message,
                    LiensLinkedin: encodedLinks ,
                    nameListProspectId,
                    
                  };
                  
                  const response = await fetch("/lol", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataToSend)
                  });
                  location.reload()
                  return await response.json();
                  
                } catch (error) {
                  console.error("Erreur lors du traitement du lien:", link, error);
                }
              };
              
    
              
              for (const [index, link] of LinksLinkedin.entries()) {
                
                console.log("BELEK A TOI ")
    
                const emploieTexte = data[index].emploie.split("chez")[0];
                const emploies = emploieTexte ? emploieTexte.trim() : data[index].emploie;
    
                const firstNameText = data[index].profile.split(" ")[0]
                const firstName = firstNameText ? firstNameText.trim() : data[index].profile
  
                const lasttNameText = data[index].profile.split(" ")[1]
                const lastName = lasttNameText ? lasttNameText.trim() : data[index].profile
  
                const pictureProfile = data[index].photo_profile
  
                
                if (firstName.includes("Utilisateur")){
                  continue
                }
                
                console.log(firstName)
              
                const entrepriseTexte = data[index].entreprise_actuelle.split("chez")[1];
                const entreprise = entrepriseTexte ? entrepriseTexte.trim() : data[index].entreprise_actuelle;
    
                const nameListProspectId = data[index].nameListProspect
                console.log(nameListProspectId)
    
                const result =  await processLink(link,  nameListProspectId , message );
    
                
                
                
                console.log(`Index: ${index}, Result: ${result.status}, photo: ${data[index].photo_profile}, Full_name: ${data[index].profile}` );
              }
  
              
              
              
              
            });
      
            button_modifymsg.addEventListener("click", ()=>{
              textarea.disabled = false;
              button_modifymsg.style.display="none"
              valider_message.style.display="block"
              msg_exemple.style.backgroundColor="#2f323b"
              displayed_btn.style.display = "none"
              global_btn_var.style.display = "block"
              textarea.style.height = "250px"
            })
            
          })
      
          valider_message.addEventListener("click",  (e)=>{
            e.preventDefault()
            
            if(textarea.value != "" ){
              const message = textarea.value
        
              const msg_exemple = document.querySelector(".msg_exemple")
              msg_exemple.style.backgroundColor="#4caf50"
              
              button_dontSendmsg.style.display="none"
              button_modifymsg.style.display="block"
              valider_message.style.display="none"
              textarea.disabled = true;
              bouton1AClique = true;
              displayed_btn.style.display = "block"
              global_btn_var.style.display = "none"
              textarea.style.height = "250px"
              
              
          
              button_modifymsg.addEventListener("click", ()=>{
                textarea.disabled = false;
                button_modifymsg.style.display="none"
                valider_message.style.display="block"
                msg_exemple.style.backgroundColor="#2f323b"
                displayed_btn.style.display = "none"
                global_btn_var.style.display = "block"
                textarea.style.height = "250px"
              })
        
              next_step.addEventListener("click", async () => {
                lancement.style.color = "black";
                lancement.style.borderBottom = "3px solid black";
                messages.style.color = "#a8adb2";
                messages.style.border = "none";
                lead_container.style.display = "none";
                contains.style.display = "none";
                cards.style.display = "block";
                const verdict_container =document.querySelector(".verdict_container")
                verdict_container.style.display = "block"
                
                
                alert(message);
                  // Créer un objet avec les données à envoyer
                const processLink = async (link , nameListProspectId , message) => {
                  try {
                    const encodedLinks = encodeURIComponent(JSON.stringify(LinksLinkedin));
                    
          
                    const dataToSend = { 
                      lien: link,
                      message,
                      LiensLinkedin: encodedLinks ,
                      nameListProspectId,
                      
                    };
                    
                    const response = await fetch("/lol", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(dataToSend)
                    });
                    
                    return await response.json();
                  } catch (error) {
                    console.error("Erreur lors du traitement du lien:", link, error);
                  }
                };
                
      
                
                for (const [index, link] of LinksLinkedin.entries()) {
                  
                  console.log("BELEK A TOI ")
      
                  const emploieTexte = data[index].emploie.split("chez")[0];
                  const emploies = emploieTexte ? emploieTexte.trim() : data[index].emploie;
      
                  const firstNameText = data[index].profile.split(" ")[0]
                  const firstName = firstNameText ? firstNameText.trim() : data[index].profile
  
                  const lasttNameText = data[index].profile.split(" ")[1]
                  const lastName = lasttNameText ? lasttNameText.trim() : data[index].profile
  
                  const pictureProfile = data[index].photo_profile
  
                  
                  if (firstName.includes("Utilisateur")){
                    continue
                  }
                  
                  console.log(firstName)
                
                  const entrepriseTexte = data[index].entreprise_actuelle.split("chez")[1];
                  const entreprise = entrepriseTexte ? entrepriseTexte.trim() : data[index].entreprise_actuelle;
      
                  const nameListProspectId = data[index].nameListProspect
                  console.log(nameListProspectId)
                  
      
      
                  const result =  await processLink(link,  nameListProspectId , message );
      
                  
                  
                  
                  console.log(`Index: ${index}, Result: ${result.status}, photo: ${data[index].photo_profile}, Full_name: ${data[index].profile}` );
  
                }
                
                
                
                
              });
              
                  
        
                
              
        
        
            }else{
              alert("vous devez ecrire un message pour pouvoir le valider")
              return false
            }
          })
          
      
        }
        )
        .catch(err => console.log(err))
        
        fetch(`/nameListProspect/${campsIdForSelectedPersons}`, {
          method : "GET"
        })
        .then(response => response.json())
        .then(data => {console.log(data)
          
          
          nom_de_la_liste.innerHTML = `${data.nameListProspect}`
        
        })
        


      }
      else{
        fetch(`/campagnes_mailing/${campaignId}`, {
          method : "POST", 
        })
        .then(response => response.json())
        .then(data => {
          
          
          console.log("HEY HEY BABY" , data)
      
      
          // METTRE UNE CONDITION POUR ENLEVER "UTILISATEUR LINKEDIN"
          
          
          data = data.filter(datas => datas.profile !== 'Utilisateur LinkedIn')
      
          console.log("NEW DATA", data)
          
          let parent = document.querySelector("#parentProfils")
          let LinksLinkedin = []
          let moreDetails = []
          let count = 0
          
      
          data.forEach((datas) => {
            // Vérifier si le profil contient le mot "Utilisateur"
            if (datas.profile.includes("Utilisateur" ) ) {
              // Ne pas ajouter la ligne correspondante
              count++
      
              return;
            }
            
            LinksLinkedin.push( {
              link : datas.lien_linkedin, 
              nom : datas.profile,
              photo : datas.photo_profile, 
              emploie : datas.emploie ,
              entreprise : datas.entreprise_actuelle,
              lieu_emploie : datas.lieu_emploie
              
            });
            moreDetails.push({
              link : datas.lien_linkedin,
              
  
            })
            let rowProfile = document.createElement("tr");
            let checkbox = document.createElement("td");
            let checkboxInput = document.createElement("input");
            let emploie = document.createElement("td");
            let entreprise_actuelle = document.createElement("td");
            let ville = document.createElement("td");
            let email = document.createElement("td");
            checkboxInput.type = "checkbox";
            checkboxInput.classList.add("lead-checkbox");
            let img = document.createElement("td");
            let imgSrc = document.createElement("img");
            let nom = document.createElement("td");
            checkbox.classList.add("checkbox");
            checkbox.appendChild(checkboxInput);
      
      
            nom.classList.add("nom");
            nom.innerText = datas.profile;
            
            imgSrc.classList.add("photo_prospect");
            
            const emploieTexte = datas.emploie.split("chez")[0];
            const emploies = emploieTexte ? emploieTexte.trim() : datas.emploie;
            emploie.innerText = emploies
      
          
            const entrepriseTexte = datas.entreprise_actuelle.split("chez")[1];
            const entreprise = entrepriseTexte ? entrepriseTexte.trim() : datas.entreprise_actuelle;
            entreprise_actuelle.innerText = entreprise;
      
            email.innerHTML = `commingSoonWithDropContact`;
          
            ville.classList.add("ville");
            ville.innerText = datas.lieu_emploie;
            imgSrc.src = datas.photo_profile;
            imgSrc.onerror= ()=>{
              imgSrc.src = "../assets/Access_icon.ico"
            }
          
            img.classList.add("picture");
            img.appendChild(imgSrc);
          
            rowProfile.appendChild(checkbox);
            rowProfile.appendChild(img);
            rowProfile.appendChild(nom);
            rowProfile.appendChild(emploie);
            rowProfile.appendChild(entreprise_actuelle);
            rowProfile.appendChild(email);
            rowProfile.appendChild(ville);
            parent.appendChild(rowProfile);
      
          });
      
      
          const datalength = data.length-count
          console.log(datalength)
          nombre_de_leads.innerHTML = datalength
      
          
          const selectAllCheckbox = document.querySelector("#select-all");
          selectAllCheckbox.addEventListener("change", function() {
            const leadCheckboxes = document.querySelectorAll(".lead-checkbox");
            leadCheckboxes.forEach(function(checkbox) {
              checkbox.checked = selectAllCheckbox.checked;
            });
          })
      
          button_dontSendmsg.addEventListener("click", ()=>{
            
            textarea.disabled = true;
            textarea.placeholder=""
            bouton1AClique = true;
            button_modifymsg.style.display="block"
            valider_message.style.display="none"
            button_dontSendmsg.style.display="none"
            displayed_btn.style.display = "block"
            textarea.value = ""
            const message = textarea.value
            
            
      
            next_step.addEventListener("click", async () => {
              
              lancement.style.color = "black";
              lancement.style.borderBottom = "3px solid black";
              messages.style.color = "#a8adb2";
              messages.style.border = "none";
              lead_container.style.display = "none";
              contains.style.display = "none";
              cards.style.display = "block";
              const verdict_container =document.querySelector(".verdict_container")
              verdict_container.style.display = "block"
              
              // PARTIE SANS MESSAGE 
  
              const processLink = async (link , nameListProspectId , message) => {
                try {
                  const encodedLinks = encodeURIComponent(JSON.stringify(LinksLinkedin));
                  
        
                  const dataToSend = { 
                    lien: link,
                    message,
                    LiensLinkedin: encodedLinks ,
                    nameListProspectId,
                    
                  };
                  
                  const response = await fetch("/lol", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dataToSend)
                  });
                  location.reload()
                  return await response.json();
                  
                } catch (error) {
                  console.error("Erreur lors du traitement du lien:", link, error);
                }
              };
              
    
              
              for (const [index, link] of LinksLinkedin.entries()) {
                
                console.log("BELEK A TOI ")
    
                const emploieTexte = data[index].emploie.split("chez")[0];
                const emploies = emploieTexte ? emploieTexte.trim() : data[index].emploie;
    
                const firstNameText = data[index].profile.split(" ")[0]
                const firstName = firstNameText ? firstNameText.trim() : data[index].profile
  
                const lasttNameText = data[index].profile.split(" ")[1]
                const lastName = lasttNameText ? lasttNameText.trim() : data[index].profile
  
                const pictureProfile = data[index].photo_profile
  
                
                if (firstName.includes("Utilisateur")){
                  continue
                }
                
                console.log(firstName)
              
                const entrepriseTexte = data[index].entreprise_actuelle.split("chez")[1];
                const entreprise = entrepriseTexte ? entrepriseTexte.trim() : data[index].entreprise_actuelle;
    
                const nameListProspectId = data[index].nameListProspect
                console.log(nameListProspectId)
    
                const result =  await processLink(link,  nameListProspectId , message );
    
                
                
                
                console.log(`Index: ${index}, Result: ${result.status}, photo: ${data[index].photo_profile}, Full_name: ${data[index].profile}` );
              }
  
              
              
              
              
            });
      
            button_modifymsg.addEventListener("click", ()=>{
              textarea.disabled = false;
              button_modifymsg.style.display="none"
              valider_message.style.display="block"
              msg_exemple.style.backgroundColor="#2f323b"
              displayed_btn.style.display = "none"
              global_btn_var.style.display = "block"
              textarea.style.height = "250px"
            })
            
          })
      
          valider_message.addEventListener("click",  (e)=>{
            e.preventDefault()
            
            if(textarea.value != "" ){
              const message = textarea.value
        
              const msg_exemple = document.querySelector(".msg_exemple")
              msg_exemple.style.backgroundColor="#4caf50"
              
              button_dontSendmsg.style.display="none"
              button_modifymsg.style.display="block"
              valider_message.style.display="none"
              textarea.disabled = true;
              bouton1AClique = true;
              displayed_btn.style.display = "block"
              global_btn_var.style.display = "none"
              textarea.style.height = "250px"
              
              
          
              button_modifymsg.addEventListener("click", ()=>{
                textarea.disabled = false;
                button_modifymsg.style.display="none"
                valider_message.style.display="block"
                msg_exemple.style.backgroundColor="#2f323b"
                displayed_btn.style.display = "none"
                global_btn_var.style.display = "block"
                textarea.style.height = "250px"
              })
        
              next_step.addEventListener("click", async () => {
                alert("YAAAAW ZEBBI YAWWW")
                lancement.style.color = "black";
                lancement.style.borderBottom = "3px solid black";
                messages.style.color = "#a8adb2";
                messages.style.border = "none";
                lead_container.style.display = "none";
                contains.style.display = "none";
                cards.style.display = "block";
                const verdict_container =document.querySelector(".verdict_container")
                verdict_container.style.display = "block"
                
                
                alert(message);
                  // Créer un objet avec les données à envoyer
                const processLink = async (link , nameListProspectId , message) => {
                  try {
                    const encodedLinks = encodeURIComponent(JSON.stringify(LinksLinkedin));
                    
          
                    const dataToSend = { 
                      lien: link,
                      message,
                      LiensLinkedin: encodedLinks ,
                      nameListProspectId,
                      
                    };
                    
                    const response = await fetch("/lol", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(dataToSend)
                    });
                    
                    return await response.json();
                  } catch (error) {
                    console.error("Erreur lors du traitement du lien:", link, error);
                  }
                };
                
      
                
                for (const [index, link] of LinksLinkedin.entries()) {
                  
                  console.log("BELEK A TOI ")
      
                  const emploieTexte = data[index].emploie.split("chez")[0];
                  const emploies = emploieTexte ? emploieTexte.trim() : data[index].emploie;
      
                  const firstNameText = data[index].profile.split(" ")[0]
                  const firstName = firstNameText ? firstNameText.trim() : data[index].profile
  
                  const lasttNameText = data[index].profile.split(" ")[1]
                  const lastName = lasttNameText ? lasttNameText.trim() : data[index].profile
  
                  const pictureProfile = data[index].photo_profile
  
                  
                  if (firstName.includes("Utilisateur")){
                    continue
                  }
                  
                  console.log(firstName)
                
                  const entrepriseTexte = data[index].entreprise_actuelle.split("chez")[1];
                  const entreprise = entrepriseTexte ? entrepriseTexte.trim() : data[index].entreprise_actuelle;
      
                  const nameListProspectId = data[index].nameListProspect
                  console.log(nameListProspectId)
                  
      
      
                  const result =  await processLink(link,  nameListProspectId , message );
      
                  
                  
                  
                  console.log(`Index: ${index}, Result: ${result.status}, photo: ${data[index].photo_profile}, Full_name: ${data[index].profile}` );
  
                }
                
                
                
                
              });
              
                  
        
                
              
        
        
            }else{
              alert("vous devez ecrire un message pour pouvoir le valider")
              return false
            }
          })
          
      
        }
        
        )
        .catch(err => console.log(err))
        
        fetch(`/nameListProspect/${campaignId}`, {
          method : "GET"
        })
        .then(response => response.json())
        .then(data => {console.log(data)
          
          
          nom_de_la_liste.innerHTML = `${data.nameListProspect}`
        
        })
        

      }
      
    
    
    
    
    
    
    const cardList = document.getElementById("card-list");
    
    
    
    const emailApproaches = [
      {
        
        description: "Bonjour, en tant que professionnel dans le même secteur que vous, je suis intéressé par une connexion sur LinkedIn pour partager nos expériences et explorer d'éventuelles opportunités de collaboration. Cordialement.",
        
      },
      {
        
        description: "Bonjour , je représente Access Energies, une entreprise spécialisée dans [préciser l'expertise de l'entreprise]. Vous êtes un professionnel avec qui nous pourrions collaborer et je pense que votre entreprise pourrait bénéficier de nos services. Serait-il possible de se connecter sur LinkedIn pour en discuter plus en détail ? Merci.",
        
      },
      {
        
        description: "Bonjour , je suis chez Access Energies et nous sommes fiers d'aider nos clients à [préciser le domaine d'expertise]. Je pense que nos services pourraient vous être utiles. Serait-il possible de se connecter sur LinkedIn pour discuter de comment nous pourrions collaborer ? Merci.",
        
      }
    ];
    
    
    emailApproaches.forEach((approach) => {
      
      const card = document.createElement("div");
      const div_for_p = document.createElement("div")
      card.classList.add("card");
    
      const image = document.createElement("img");
      
      card.appendChild(div_for_p);
    
      const title = document.createElement("h3");
      title.textContent = approach.title;
      div_for_p.appendChild(image)
      card.appendChild(title);
    
      const description = document.createElement("p");
      description.textContent = approach.description;
      div_for_p.appendChild(description)
      card.appendChild(div_for_p);
    
    
      card.addEventListener("click" , ()=>{
        textarea.value = card.innerText
      })
    
      cardList.appendChild(card);
    
      
    });
    
    
  }


})
.catch(err => console.log(err))



