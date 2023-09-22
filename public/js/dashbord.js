const variable_vu_du_profile = document.querySelector(".variable_vu_du_profile")
const variable_relation = document.querySelector(".variable_relation")
const variable_enAttente = document.querySelector(".variable_enAttente")
const button_displayed = document.querySelector(".button_displayed")
const btn_mofify_li_at = document.querySelector(".btn-li-at")
const circle = document.querySelector(".circle")
const ville = document.querySelector(".ville")
const temperature = document.querySelector(".temperature")
const animated_gif_temp = document.querySelector(".animated_gif_temp")
const more_information = document.querySelector(".more_information")
const sunset_time = document.querySelector(".sunset_time")
const sunrise_time = document.querySelector(".sunrise_time")
const wind = document.querySelector(".wind")
const text_sunset = document.querySelector(".text_sunset")
const heure_sunset = document.querySelector(".heure_sunset")
const text_sunrise = document.querySelector(".text_sunrise")
const heure_sunrise = document.querySelector(".heure_sunrise")
const text_wind = document.querySelector(".text_wind")
const heure_wind = document.querySelector(".heure_wind")
const img_container = document.querySelector(".img-container")
const delete_display = document.querySelector(".delete_display")
const modal_close_delete = document.querySelector(".modal-close_delete")
const userName = document.querySelector(".userName")
const no = document.querySelector(".no")
const continuer = document.querySelector(".continue")
const number_of_campaign = document.querySelector(".number-of-campaign")
const campagne_active = document.querySelector(".campagne_active")
const side_information = document.querySelector(".side_information")
const ag_courses_item = document.querySelector(".ag-courses_item")
const imageMini = document.querySelector(".imageMini")

fetch("/infos", { method: "GET" })
  .then(response => response.json())
  .then(result => {
    userName.innerHTML = result.nom
    imageMini.src = `../assets/uploads/${result.username}/${result.photo}`
    imageMini.onerror = () => {
      // Controlling the path
      console.log(imageMini.src)
      imageMini.src = "../assets/Access_icon.ico"

    }

  })
  .catch(err => console.log(err))


fetch("/verification-campagne", { method: "GET" })
  .then(response => response.json())
  .then(data => {

    if (data.active) {
      number_of_campaign.innerHTML = "1"

      campagne_active.addEventListener("click", () => {

        location.href = `/campagne?campaignId=${data.campaignId}`
      })
    }
  })
  .catch(err => console.log(err))

fetch("/invitePending", { method: "GET" })
  .then(response => response.json())
  .then(data => {


    const personneId = [...data.perssone.map(el => el.personneId)]


    fetch("/personPending", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personneId)

    })
      .then(response => response.json())
      .then(collections => {

        const personnes = [...collections.personnes.map(el => el)]
        if (collections) {
          const card = document.createElement("div")
          card.classList.add("ag-courses_item")
          const link = document.createElement("div")
          link.classList.add("ag-courses-item_link", "ok")
          const item = document.createElement("div")
          item.classList.add("ag-courses-item_bg")
          const itemTitle = document.createElement("div")
          itemTitle.classList.add("ag-courses-item_title", "height")
          const display_title = document.createElement("div")
          display_title.classList.add("display-title")
          const informationCard = document.createElement("div")
          informationCard.classList.add("pending-container")

          const MoreInfo = document.createElement("div")

          const nameOfCampaign = document.createElement("p")
          nameOfCampaign.innerHTML = "Connexion en Attente"


          display_title.appendChild(nameOfCampaign)
          for (let personne of personnes) {
            const container_list = document.createElement("div")
            container_list.classList.add("container_list")
            const photo = document.createElement("img")

            photo.src = personne.photo
            photo.onerror = () => {
              photo.src = "../assets/Access_icon.ico"

            }
            const emploie = document.createElement("p")
            if ((personne.emploie).length > 25) {

              const personneArray = personne.emploie.split(" ")

              emploie.innerHTML = personneArray[0] + '...'

            } else {
              emploie.innerHTML = personne.emploie
            }

            const nom_prenom = document.createElement("p")

            nom_prenom.innerHTML = personne.nom

            const time = document.createElement("p");
            const dateObj = new Date(personne.date);

            const currentDate = new Date();
            const timeDiff = dateObj.getTime() - currentDate.getTime(); // Différence de temps en millisecondes
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Différence de jours arrondie vers le haut


            if (daysDiff === 3) {
              time.style.color = "green";
              time.innerHTML = "Il reste 3 jours";
              time.style.fontWeight = "bold";
            }

            if (daysDiff === 2) {
              time.style.color = "orange";
              time.innerHTML = "Il reste 2 jours";
              time.style.fontWeight = "bold";
            }

            else if (daysDiff === 1) {
              time.style.color = "red";
              time.innerHTML = "Il reste 1 jour";
              time.style.fontWeight = "bold";

            }




            const listOfPending = document.createElement("p")

            listOfPending.innerHTML = personne._id
            container_list.appendChild(photo)
            container_list.appendChild(nom_prenom)

            container_list.appendChild(time)



            informationCard.appendChild(container_list)



          }





          link.appendChild(item)
          link.appendChild(itemTitle)
          itemTitle.appendChild(display_title) //METTRE LE TITLE ICI AVEC LA PHOTO #############

          itemTitle.appendChild(informationCard)
          itemTitle.appendChild(MoreInfo)
          card.appendChild(link)
          side_information.appendChild(card)
        }


      })
      .catch(err => console.log(err))

  })
  .catch(err => console.log(err))



fetch("/Testing_li_at", {
  method: "GET"
})
  .then(response => response.json())
  .then(verification => {
    if (!(verification.verification)) {
      variable_vu_du_profile.innerHTML = ""
      variable_relation.innerHTML = ""
      variable_enAttente.innerHTML = ""

      function appendCross(variable) {
        const img = document.createElement("img")
        img.classList.add("img-cross")
        img.src = '../assets/cross.png'
        variable.append(img)
      }

      appendCross(variable_vu_du_profile)
      appendCross(variable_relation)
      appendCross(variable_enAttente)

      const card_relation = document.querySelector(".card_relation")
      card_relation.style.border = "3px solid #f74254"

      const card_enAttente = document.querySelector(".card_enAttente")
      card_enAttente.style.border = "3px solid #f74254"

      const card_vu_du_profile = document.querySelector(".card_vu_du_profile")
      card_vu_du_profile.style.border = "3px solid #f74254"

      const variation = document.querySelector(".variation")
      circle.style.border = "3px solid #f74254"
      circle.classList.add("false-vibration")
      variation.classList.add("false-vibration")
      button_displayed.style.display = "block"

      btn_mofify_li_at.addEventListener("click", () => {
        location.href = "modify"
      })
    } else {
      fetchProfileViews()
        .then(fetchRelationNumb)
        .then(fetchInvitationHold)
        .catch(error => console.error(error));
    }
  });

function fetchRelationNumb() {
  return new Promise((resolve, reject) => {
    const relation = sessionStorage.getItem("RelationNumb");
    if (relation) {
      variable_relation.innerHTML = relation;
      resolve();
    } else {
      fetch('/getRelationNumb')
        .then(response => response.json())
        .then(data => {
          console.log("DATA RELATION", data);
          sessionStorage.setItem('RelationNumb', JSON.stringify(data.getRelationNumbR));
          const getRelationNumbDatas = JSON.parse(sessionStorage.getItem('RelationNumb'));
          variable_relation.innerHTML = typeof getRelationNumbDatas === "number" ? getRelationNumbDatas : typeof getRelationNumbDatas === "string" ? 0 : 0;
          resolve();
        })
        .catch(error => reject(error));
    }
  });
}

function fetchInvitationHold() {
  return new Promise((resolve, reject) => {
    const invitationHold = sessionStorage.getItem("inviteOnHold");
    if (invitationHold) {
      variable_enAttente.innerHTML = invitationHold;
      resolve();
    } else {
      fetch('/invitationOnHold')
        .then(response => response.json())
        .then(data => {
          console.log("DATA INVITATION", data);
          sessionStorage.setItem('inviteOnHold', JSON.stringify(data.invitationHoldinR));
          const invitationHoldinDatas = JSON.parse(sessionStorage.getItem('inviteOnHold'));
          variable_enAttente.innerHTML = typeof invitationHoldinDatas === "number" ? invitationHoldinDatas : typeof invitationHoldinDatas === "string" ? 0 : 0;
          resolve();
        })
        .catch(error => reject(error));
    }
  });
}

function fetchProfileViews() {
  return new Promise((resolve, reject) => {
    const ProfileViews = sessionStorage.getItem("ProfileViews");
    if (ProfileViews) {
      variable_vu_du_profile.innerHTML = ProfileViews;
      resolve();
    } else {
      fetch('/getProfileViewCount')
        .then(response => response.json())
        .then(data => {
          console.log("DATA VUES", data);
          sessionStorage.setItem('ProfileViews', JSON.stringify(data.getProfileViewCountR));
          const getProfilesViewsDatas = JSON.parse(sessionStorage.getItem('ProfileViews'));
          variable_vu_du_profile.innerHTML = typeof getProfilesViewsDatas === "number" ? getProfilesViewsDatas : typeof getProfilesViewsDatas === "string" ? 0 : 0;
          resolve();
        })
        .catch(error => reject(error));
    }
  });
}

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


const token = localStorage.getItem("token")



















const ctx = document.getElementById('myChart');


fetch("/dataForChart", {
  method: "GET"
})
  .then(response => response.json())
  .then(data => {

    function DataOfTheweek(tableData) {
      const dataLength = tableData.length;
      return dataLength >= 7 ? tableData.slice(-7) : tableData;
    }

    const today = moment();
    const daysOfWeek = [...Array(7).keys()].map(i => moment(today).subtract(6 - i, 'days'));



    // Créer un tableau de chaînes de caractères représentant les jours de la semaine avec leur date
    const labels = daysOfWeek.map(day => day.format('D MMMM'));


    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de relation',
          data: DataOfTheweek(data.Relation),
          borderWidth: 2
        },
        {
          label: 'En attente',
          data: DataOfTheweek(data.EnAttente),
          borderWidth: 2
        },
        {
          label: 'Vues du profil',
          data: DataOfTheweek(data.VuesDuProfil),
          borderWidth: 2
        }

        ]
      },
      options: {

        scales: {
          y: {
            beginAtZero: true
          },


        }
      }
    });


  })


const ctxEmail = document.querySelector("#myChartEmail")

const actions = [
  {
    name: 'pointStyle: circle (default)',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'circle';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: cross',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'cross';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: crossRot',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'crossRot';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: dash',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'dash';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: line',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'line';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: rect',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'rect';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: rectRounded',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'rectRounded';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: rectRot',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'rectRot';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: star',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'star';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: triangle',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = 'triangle';
      });
      chart.update();
    }
  },
  {
    name: 'pointStyle: false',
    handler: (chart) => {
      chart.data.datasets.forEach(dataset => {
        dataset.pointStyle = false;
      });
      chart.update();
    }
  }
];

const dataEmail = {
  labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
  datasets: [
    {
      label: 'Mails Envoyé',
      data: [12, 19, 3, 5, 2, 3],  // remplacé par des valeurs réelles
      borderColor: '#fe6484',  // remplacé par 'red'
      backgroundColor: '#fe6484',  // remplacé par 'rgba(255, 0, 0, 0.5)'
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    }, {
      label: 'Mails Délivré',
      data: [1, 5, 42, 12, 2, 22],  // remplacé par des valeurs réelles
      borderColor: '#78c88d',  // remplacé par 'red'
      backgroundColor: '#78c88d',  // remplacé par 'rgba(255, 0, 0, 0.5)'
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    }
    , {
      label: 'Mails Répondu',
      data: [0, 22, 1, 7, 24, 24],  // remplacé par des valeurs réelles
      borderColor: '#37a2eb',  // remplacé par 'red'
      backgroundColor: '#37a2eb',  // remplacé par 'rgba(255, 0, 0, 0.5)'
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 15
    }
  ]
};


new Chart(ctxEmail, {
  type: 'line',
  data: dataEmail,  // remplacé par 'data'
  options: {
    responsive: true,

  }
});





const percent = sessionStorage.getItem("percent")

const loader = document.getElementById('loader');
const percent_invitation = document.querySelector('.percent-invitation');
const percent_container = document.querySelector(".percent-container")



continuer.addEventListener("click", () => {
  delete_display.style.display = "none"
  fetch("/deleteInvitation", {
    method: "GET"
  })
    .then(result => console.log(result))
    .catch(err => console.log(err))
})




no.addEventListener("click", () => {
  delete_display.style.display = "none"
})






img_container.addEventListener("click", () => {
  delete_display.style.display = "block"


})

modal_close_delete.addEventListener("click", () => {
  delete_display.style.display = "none"
})




fetch("/klist", { method: "GET" })
  .then(response => response.json())
  .then(data => {

    const personnes = [...data.resultat.map(el => el)]
    if (data) {
      const card = document.createElement("div")
      card.classList.add("ag-courses_item")
      const link = document.createElement("div")
      link.classList.add("ag-courses-item_link", "ok")
      const item = document.createElement("div")
      item.classList.add("ag-courses-item_bg")
      const itemTitle = document.createElement("div")
      itemTitle.classList.add("ag-courses-item_title", "height")
      const display_title = document.createElement("div")
      display_title.classList.add("display-title")
      const informationCard = document.createElement("div")
      informationCard.classList.add("pending-container")

      const MoreInfo = document.createElement("div")

      const nameOfCampaign = document.createElement("p")
      nameOfCampaign.innerHTML = "Liste Kaspr"


      display_title.appendChild(nameOfCampaign)

      for (let personne of personnes) {
        const container_list = document.createElement("div")
        container_list.classList.add("container_list")
        const photo = document.createElement("img")

        photo.src = personne.photo
        photo.onerror = () => {
          photo.src = "../assets/Access_icon.ico"

        }

        const nom = document.createElement("p")

        nom.innerHTML = personne.nom

        const prenom = document.createElement("p")

        prenom.innerHTML = personne.prenom

        container_list.appendChild(photo)
        container_list.appendChild(nom)
        container_list.appendChild(prenom)

        informationCard.appendChild(container_list)



      }





      link.appendChild(item)
      link.appendChild(itemTitle)
      itemTitle.appendChild(display_title) //METTRE LE TITLE ICI AVEC LA PHOTO #############

      itemTitle.appendChild(informationCard)
      itemTitle.appendChild(MoreInfo)
      card.appendChild(link)
      side_information.appendChild(card)
    }

  })
  .catch(err => console.log(err))




