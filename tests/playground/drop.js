// Fonction pour trouver des e-mails
function findMails() {
  // Token d'accès Dropcontact
  const token = "uKsF2w2CKofvDygJjvcHyPAK1wElfo";

  // Configuration des en-têtes de la requête POST
  var myHeaders = new Headers();
  myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");
  myHeaders.append("Content-Type", "application/json");

  // Données de la requête POST au format JSON
  var raw = JSON.stringify({
    "data": [
      {
        "full_name": "hamidou DIAKITE",
        "company": "ACCES ENERGIES",
        "linkedin": "https://www.linkedin.com/in/hamidou-diakite-897305132/",
        "company_linkedin": "https://www.linkedin.com/company/access-energies/",
        "job": "Président, fondateur"
      },
    ],
    "siren": true,
    "language": "fr"
  });

  // Options de la requête POST
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  // Effectue la première requête POST à l'API Dropcontact
  fetch("https://api.dropcontact.io/batch", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);

      // Configuration des en-têtes de la requête GET
      var myHeaders = new Headers();
      myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");

      // Options de la requête GET
      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      // Attend 25 secondes avant d'effectuer la deuxième requête GET
      setTimeout(() => {
        // Effectue la deuxième requête GET à l'API Dropcontact avec l'ID de la première requête
        fetch(`https://api.dropcontact.io/batch/${result.request_id}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            // Récupère l'adresse e-mail depuis la réponse
            const email = result.data[0].email;
            console.log(email);
          })
          .catch(error => console.log('error', error));
      }, 25000); // Attend 25 secondes avant d'effectuer la deuxième requête
    })
    .catch(error => console.log('error', error));
}

// Appelle la fonction pour trouver des e-mails
findMails();
