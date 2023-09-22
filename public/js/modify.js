const btn_modify = document.querySelector('#btn_modify');
const modified_at = document.querySelector('#modified_at');

fetch("/recup", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',

    },

})
.then(response => {
    if (!response.ok) {
      throw new Error(`Erreur de récupération du li_at: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("yesssss", data);
    localStorage.setItem("li_at", JSON.stringify(data));
    const token = localStorage.getItem("token");

btn_modify.addEventListener('click', (e) => {
    const li_atData = { li_at: modified_at.value };
    
    e.preventDefault();
    fetch(`/modify/${data.li_at_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(li_atData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur de modification du li_at: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("yesssss", data);
        localStorage.setItem("li_at", JSON.stringify(data));
        location.href = "connexion";
      })
      .catch(error => {
        console.error(error);
      });
});
    
  })





