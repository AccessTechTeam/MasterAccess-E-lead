const lundi = document.querySelector("#Lundi")
const mardi = document.querySelector("#Mardi")
const mercredi = document.querySelector("#Mercredi")
const jeudi = document.querySelector("#Jeudi")
const vendredi = document.querySelector("#Vendredi")

const msg_container = document.querySelector(".msg_container")


let isGreenL = true
let isGreenM = true
let isGreenMe = true
let isGreenJ = true
let isGreenV = true
const button_plage_horaire1 = document.querySelector("#first")
const button_plage_horaire2 = document.querySelector("#second")
const button_plage_horaire3 = document.querySelector("#third")
const button_plage_horaire4 = document.querySelector("#fourth")
const button_plage_horaire5 = document.querySelector("#fivth")
const button_plage_horaire6 = document.querySelector("#sixth")
let isGreen1 = true
let isGreen2 = true
let isGreen3 = true
let isGreen4 = true
let isGreen5 = true
let isGreen6 = true




lundi.addEventListener("click", ()=>{
    if (isGreenL){
      lundi.style.backgroundColor="#4CAF50"
      lundi.style.color="white"
      isGreenL = false
    }else{
      lundi.style.backgroundColor="white"
      lundi.style.color="black"
      isGreenL = true
    }

  })
  mardi.addEventListener("click", ()=>{
    if (isGreenM){
      mardi.style.backgroundColor="#4CAF50"
      mardi.style.color="white"
      isGreenM = false
    }else{
      mardi.style.backgroundColor="white"
      mardi.style.color="black"
      isGreenM = true
    }
  })
  mercredi.addEventListener("click", ()=>{
    if (isGreenMe){
      mercredi.style.backgroundColor="#4CAF50"
      mercredi.style.color="white"
      isGreenMe = false
    }else{
      mercredi.style.backgroundColor="white"
      mercredi.style.color="black"
      isGreenMe = true
    }
  })
  jeudi.addEventListener("click", ()=>{
    if (isGreenJ){
      jeudi.style.backgroundColor="#4CAF50"
      jeudi.style.color="white"
      isGreenJ = false
    }else{
      jeudi.style.backgroundColor="white"
      jeudi.style.color="black"
      isGreenJ = true
    }
  })
  vendredi.addEventListener("click", ()=>{
    if (isGreenV){
      vendredi.style.backgroundColor="#4CAF50"
      vendredi.style.color="white"
      isGreenV = false
    }else{
      vendredi.style.backgroundColor="white"
      vendredi.style.color="black"
      isGreenV = true
    }
  })


// Ajoutez un gestionnaire d'événements "click" à la case à cocher "select-all"


  button_plage_horaire1.addEventListener("click", ()=>{
    if(isGreen1){
      button_plage_horaire1.style.backgroundColor ="#4CAF50"
      button_plage_horaire1.style.color="white"
      isGreen1 = false
    }else{
      button_plage_horaire1.style.backgroundColor ="white"
      button_plage_horaire1.style.color="black"
      isGreen1 = true
    }
    
  })

  button_plage_horaire2.addEventListener("click", ()=>{
    if(isGreen2){
      button_plage_horaire2.style.backgroundColor ="#4CAF50"
      button_plage_horaire2.style.color="white"
      isGreen2 = false
    }else{
      button_plage_horaire2.style.backgroundColor ="white"
      button_plage_horaire2.style.color="black"
      isGreen2 = true
    }
  })

  button_plage_horaire3.addEventListener("click", ()=>{
    if(isGreen3){
      button_plage_horaire3.style.backgroundColor ="#4CAF50"
      button_plage_horaire3.style.color="white"
      isGreen3 = false
    }else{
      button_plage_horaire3.style.backgroundColor ="white"
      button_plage_horaire3.style.color="black"
      isGreen3 = true
    }
  })

  button_plage_horaire4.addEventListener("click", ()=>{
    if(isGreen4){
      button_plage_horaire4.style.backgroundColor ="#4CAF50"
      button_plage_horaire4.style.color="white"
      isGreen4 = false
    }else{
      button_plage_horaire4.style.backgroundColor ="white"
      button_plage_horaire4.style.color="black"
      isGreen4 = true
    }
  })

  button_plage_horaire5.addEventListener("click", ()=>{
    if(isGreen5){
      button_plage_horaire5.style.backgroundColor ="#4CAF50"
      button_plage_horaire5.style.color="white"
      isGreen5 = false
    }else{
      button_plage_horaire5.style.backgroundColor ="white"
      button_plage_horaire5.style.color="black"
      isGreen5 = true
    }
  })

  button_plage_horaire6.addEventListener("click", ()=>{
    if(isGreen6){
      button_plage_horaire6.style.backgroundColor ="#4CAF50"
      button_plage_horaire6.style.color="white"
      isGreen6 = false
    }else{
      button_plage_horaire6.style.backgroundColor ="white"
      button_plage_horaire6.style.color="black"
      isGreen6 = true
    }
  })

  btn_params.addEventListener("click",()=>{
    bouton2AClique = true;
    verifierClic();
  })



  function verifierClic() {
    if (bouton1AClique && bouton2AClique) {
      msg_container.style.display = "none"
    }
  }