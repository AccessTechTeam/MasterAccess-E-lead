const KasprSchema = require("../../Model/kasprSchema")

function KASPR(name, id) {
    const url = 'https://api.developers.kaspr.io/profile/linkedin';
    
    const payload = {
      name,
      id,
      isPhoneRequired: false
    };
    
    const options = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Authorization': 'YOUR API KEY',
        'Content-Type': 'application/json'
      }
    };
    
    return fetch(url, options)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(jsonResponse => {
        new KasprSchema({
            profiles : jsonResponse.profile
        })
        .save()
        .then(()=>{
            console.log("enregistré avec succèss ! ")
        })
        .catch((err)=>{console.log("erreur au moment de l'enregistrement !")})

        const phones = jsonResponse.profile.phones;
        const emailPro = jsonResponse.profile.professionalEmails;
        return [phones ,emailPro ] ;
      })
      .catch(error => {
        console.error('Request failed:', error);
      });
  }
  
  module.exports = KASPR;
  