


// fetch post datas 

function findMails(){
  const token = "uKsF2w2CKofvDygJjvcHyPAK1wElfo"

  var myHeaders = new Headers();
  myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");
  myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "data": [

    {
      "full_name": "hamidou DIAKITE",
      
      "company" :"ACCES ENERGIES",
      "linkedin": "https://www.linkedin.com/in/hamidou-diakite-897305132/",
      "company_linkedin" : "https://www.linkedin.com/company/access-energies/",
      "job" : "Président, fondateur"
      
    },
    
  ],
  "siren": true,
  "language": "fr"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.dropcontact.io/batch", requestOptions)
  .then(response => response.json())
  .then(result => {
    
    console.log(result)

    var myHeaders = new Headers();
    myHeaders.append("X-Access-Token", "uKsF2w2CKofvDygJjvcHyPAK1wElfo");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }

    setTimeout(()=>{
      fetch(`https://api.dropcontact.io/batch/${result.request_id}`, requestOptions)
      .then(response => response.json())
      .then(result => {console.log(result)
      
      const email = result.data[0].email
      console.log(email)
      
      })
      .catch(error => console.log('error', error));
    },25000)
    
  })
  .catch(error => console.log('error', error));

  
}


findMails()