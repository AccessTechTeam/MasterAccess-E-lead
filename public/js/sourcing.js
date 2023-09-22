const btn = document.querySelector("#searching_persons")
const myModal = document.querySelector("#myModal")
let btnClose = document.querySelector(".close")
let btnClose3 = document.querySelector(".close3")
const btn_modal = document.querySelector("#modal-btn")
const input_modal = document.querySelector("#input-modal")
const container_table = document.querySelector(".container_table")
const btn_get_freinds = document.querySelector("#get_freinds")
const myModal2 = document.querySelector("#myModalRelation")
const btnVisits = document.querySelector("#visits")
const VisitsModal = document.querySelector("#myModalVisits")
const closeVisits = document.querySelector(".closeVisits")
const closeRelation = document.querySelector(".closeRelation")
const btn_comments = document.querySelector("#comments")
const form_data = document.querySelector("#form_data")
const liste_create_btn = document.querySelector("#liste_create_btn")
const liste = document.querySelector(".liste")
const display_empty_sources = document.querySelector(".empty_sources")
const container_empty_sources = document.querySelector(".container_empty_sources")
const modalForList = document.querySelector("#modalForList")
const closeBtnForList = document.querySelector(".closeForList")
const btn_start_campaign = document.querySelector(".btn-start-campaign")
const display_skeleton_table = document.querySelector(".display-skeleton-table")
const abort = document.querySelector("#abort")
let controller = new AbortController()
let signal = controller.signal
let checkedData = []
let sendCheckedData = []
const checkboxAll = document.querySelector("#checkbox_all");
const download_excel_btn = document.querySelector("#download_excel_btn")
const download_csv_btn = document.querySelector("#download_csv_btn")
const modal_compaign = document.querySelector("#modal-compaign")
const modalt_top = document.querySelector(".displayModalTop");
const miniImageBannerForSourcing = document.querySelector(".miniImageBannerForSourcing")


fetch("/infos", { method: "GET" })
    .then(response => response.json())
    .then(result => {
        miniImageBannerForSourcing.src = `../assets/uploads/${result.username}/${result.photo}`
        miniImageBannerForSourcing.onerror = () => {
            miniImageBannerForSourcing.src = "../assets/Access_icon.ico"
        }
    })
    .catch(err => console.log(err))



abort.addEventListener("click", () => {
    alert("hello")
    controller.abort()
})

let requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("http://127.0.0.1:5000/cookie", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));



const liste_input = document.createElement("input")
const liste_btn = document.createElement("button")

// CREATION LISTE POUR LES LE TYPE DE RECHERCHE
liste_create_btn.addEventListener("click", () => {

    const liste_container = document.createElement("div")

    liste_input.name = "nameListProspect"
    liste_input.classList.add("recherche_input")


    liste_input.addEventListener("input", (e) => {

    })


    liste_btn.textContent = "✓"
    liste_btn.classList.add("button-9")
    liste.appendChild(liste_container)
    liste_container.appendChild(liste_input)
    const iconPaths = {
        a: "./assets/alphabet/A.svg",
        b: "./assets/alphabet/B.svg",
        c: "./assets/alphabet/C.svg",
        d: "./assets/alphabet/D.svg",
        e: "./assets/alphabet/E.svg",
        f: "./assets/alphabet/F.svg",
        g: "./assets/alphabet/G.svg",
        h: "./assets/alphabet/H.svg",
        i: "./assets/alphabet/I.svg",
        j: "./assets/alphabet/J.svg",
        k: "./assets/alphabet/K.svg",
        l: "./assets/alphabet/L.svg",
        m: "./assets/alphabet/M.svg",
        n: "./assets/alphabet/N.svg",
        o: "./assets/alphabet/O.svg",
        p: "./assets/alphabet/P.svg",
        q: "./assets/alphabet/Q.svg",
        r: "./assets/alphabet/R.svg",
        s: "./assets/alphabet/S.svg",
        t: "./assets/alphabet/T.svg",
        u: "./assets/alphabet/U.svg",
        v: "./assets/alphabet/V.svg",
        w: "./assets/alphabet/W.svg",
        x: "./assets/alphabet/X.svg",
        y: "./assets/alphabet/Y.svg",
        z: "./assets/alphabet/Z.svg"
    };


    liste_input.addEventListener("input", (e) => {
        const firstChar = liste_input.value.charAt(0).toLowerCase();

        if (firstChar in iconPaths) {
            const div = document.createElement("div")
            div.classList.add("background")

            liste_input.classList.add(`input-icon-${firstChar}`);
            liste_input.style.backgroundImage = `url(${iconPaths[firstChar]})`;
            liste_input.style.backgroundSize = "21px";
            liste_input.style.backgroundPositionY = "center";
            liste_input.style.backgroundPositionX = "5px";
            liste_input.style.backgroundBorder = "1px solid black";
            liste_input.style.backgroundRepeat = "no-repeat";


            // Set background position to add space between icon and text
            liste_input.style.paddingLeft = "35px";
        } else {
            // Remove any input-icon-* class and clear background image
            liste_input.classList.remove("input-icon-a", "input-icon-b", "input-icon-c");
            liste_input.style.backgroundImage = "";
            liste_input.style.backgroundPosition = "";
        }

        if (liste_input.value.trim() !== "") {
            liste_container.appendChild(liste_btn);

        } else {

            liste_btn.remove();
            // Remove any input-icon-* class and clear background image
            liste_input.classList.remove("input-icon-a", "input-icon-b", "input-icon-c");
            liste_input.style.backgroundImage = "";
            liste_input.style.backgroundRepeat = "repeat";
            liste_input.style.backgroundPosition = "";
        }
    });

    liste_btn.addEventListener("click", () => {
        createNameList(liste_input.value, iconPaths);


    })
})



const ul = document.createElement("ul")
fetch("/nameListProspect", {
    method: "GET",
})
    .then(response => response.json())
    .then(result => {





        for (let i = 0; i < result.length; i++) {
            // ...

            const FirstLetterForIcon = result[i].nameListProspect.charAt(0).toLocaleUpperCase()



            const showList = document.createElement("div")
            showList.classList.add("button-46")



            const container_icons = document.createElement("div")
            container_icons.classList.add("container_icons")

            const icon_modify = document.createElement("i")
            icon_modify.classList.add("fa-regular", "fa-pen-to-square")

            const icon_drop = document.createElement("i")
            icon_drop.classList.add("fa-regular", "fa-trash-can")

            const iconFirstLetter = document.createElement("img")
            iconFirstLetter.classList.add("iconFirstLetter")
            iconFirstLetter.src = `../assets/alphabet/${FirstLetterForIcon}.svg`
            iconFirstLetter.onerror = () => {
                iconFirstLetter.src = "../assets/Access_icon.ico"
            }



            const div = document.createElement("div")
            div.classList.add("show_list")
            div.classList.add("dropdown")

            showList.appendChild(iconFirstLetter)

            showList.appendChild(document.createTextNode(result[i].nameListProspect))
            if (result[i].active === true) {
                console.log(result[i].nameListProspect)
                showList.classList.add("active")
            }


            container_icons.appendChild(icon_modify)
            container_icons.appendChild(icon_drop)

            showList.appendChild(container_icons)



            liste.appendChild(showList)




            showList.addEventListener("click", () => {
                display_empty_sources.style.display = "none"
                const generated_sources = document.querySelector(".generated_sources")
                display_skeleton_table.style.display = "block"

                fetch(`/nameListProspect/${result[i]._id}`, {
                    method: "GET",
                })
                    .then(response => response.json())
                    .then(resultList => {

                        display_skeleton_table.style.display = "none"



                        fetch(`/ProspectRechecheModels/${resultList._id}`, {
                            method: "GET",
                        })
                            .then(response => response.json())
                            .then(result => {


                                if (result) {

                                    container_table.style.display = "block"

                                    parentProfils.innerHTML = ""


                                    result.forEach(element => {


                                        if (element.lien_linkedin.includes("/search/results/")) {
                                            return
                                        }
                                        if (element.lien_linkedin.includes("?")) {
                                            element.lien_linkedin = element.lien_linkedin.substring(0, element.lien_linkedin.indexOf("?"));
                                        }



                                        let rowProfile = document.createElement("tr")
                                        let splitProfile = element.profile.split(' ');
                                        let firstName = splitProfile[0];
                                        let lastName = splitProfile.slice(1).join(' ');
                                        // elements 
                                        let checkbox = document.createElement("td")
                                        let checkboxInput = document.createElement('input')
                                        checkboxInput.type = "checkbox"
                                        let img = document.createElement("td")
                                        let imgSrc = document.createElement('img')
                                        let nom = document.createElement("td")

                                        let profile = document.createElement("td")
                                        let ville = document.createElement("td")
                                        let enrichir = document.createElement("td")

                                        let icon1 = document.createElement("img")
                                        let icon2 = document.createElement("img")
                                        let icon3 = document.createElement("img")

                                        rowProfile.classList.add("row")

                                        // children
                                        checkbox.classList.add("checkbox")
                                        checkbox.appendChild(checkboxInput)
                                        imgSrc.classList.add("photo")
                                        imgSrc.src = element.photo_profile
                                        imgSrc.onerror = () => {
                                            imgSrc.src = "../assets/Access_icon.ico"
                                        }
                                        img.classList.add("picture")
                                        img.appendChild(imgSrc)
                                        nom.classList.add("nom")
                                        nom.innerText = element.profile
                                        ville.classList.add("ville")
                                        ville.innerText = element.lieu_emploie
                                        enrichir.classList.add("enrichir")
                                        icon1.src = "./assets/edition.png"
                                        icon2.src = "./assets/candidat.png"
                                        icon3.src = "./assets/etoile.png"
                                        enrichir.appendChild(icon1)
                                        enrichir.appendChild(icon2)
                                        enrichir.appendChild(icon3)

                                        fetch(`/favoris/status/?prospectId=${element._id}`)
                                            .then(response => response.json())
                                            .then(result => {

                                                if (result.isFavorite) {
                                                    icon3.src = "./assets/etoile-yellow.png"
                                                }
                                            })

                                        icon1.addEventListener("click", () => {
                                            icon1.src = ""
                                            icon1.src = "./assets/Spinner-1s-32px.svg"
                                            icon1.style.height = "37px"
                                            enrichir.style.display = "flex"
                                            enrichir.style.alignItems = "center"


                                        })
                                        icon2.addEventListener("click", () => {

                                            console.log(element.lien_linkedin)
                                            fetch(`/enrichissements/?lien=${element.lien_linkedin}&prospectId=${element._id}`, {
                                                method: "GET"
                                            })
                                                .then(response => console.log(response.json()))
                                                .then(data => console.log(data))

                                        })
                                        icon3.addEventListener("click", () => {
                                            fetch(`/favoris/status/?prospectId=${element._id}`)
                                                .then(response => response.json())
                                                .then(result => {
                                                    if (result.isFavorite) {
                                                        fetch(`/favoris/remove/?prospectId=${element._id}`)
                                                            .then(response => response.json())
                                                            .then(result => {
                                                                icon3.classList.remove("animation")
                                                                icon3.src = "./assets/etoile.png"
                                                            })
                                                    } else {
                                                        fetch(`/favoris/add/?prospectId=${element._id}`)
                                                            .then(response => response.json())
                                                            .then(() => {
                                                                icon3.classList.add("animation")
                                                                icon3.src = "./assets/etoile-yellow.png"
                                                            })
                                                    }
                                                })
                                        })

                                        checkboxInput.addEventListener("change", () => {
                                            const rowData = [firstName, lastName, element.lien_linkedin]
                                            const personsId = [element._id]
                                            if (checkboxInput.checked) {
                                                checkboxAll.checked = false;
                                                checkedData.push(rowData);
                                                sendCheckedData.push(personsId)
                                                if (checkedData.length >= 1) {
                                                    const personsId = checkedData.map(rowData => rowData[0]);
                                                    modalt_top.style.display = "block"
                                                    const selected_count = document.querySelector(".selected-count")
                                                    selected_count.innerHTML = checkedData.length

                                                }

                                            }
                                            if (!checkboxInput.checked) {
                                                let index = checkedData.findIndex(row => row[0] === rowData[0]);
                                                let indexSended = sendCheckedData.findIndex(row => row[0] === personsId[0])
                                                if (index !== -1) {

                                                    checkedData.splice(index, 1);
                                                    sendCheckedData.splice(indexSended, 1)

                                                }
                                            }
                                            btn_start_campaign.addEventListener("click", () => {


                                                fetch(`/campaigns/${resultList._id}`, {
                                                    method: "GET",
                                                })
                                                    .then(response => response.json())
                                                    .then(data => {
                                                        if (data) {

                                                            console.log("data", data)

                                                            location.href = `/campagne_mailing?campaignId=${resultList._id}/persons=${sendCheckedData}`

                                                        }

                                                    })
                                            })
                                        })

                                        const profile_container = document.createElement("div")
                                        profile_container.classList.add("profile_container")

                                        const name_container = document.createElement("div")
                                        name_container.classList.add("name_container")

                                        if (element.emploie.includes(',')) {
                                            element.emploie = element.emploie.replace(',', '');
                                        }

                                        if ((element.emploie).length > 25) {

                                            const personneArray = element.emploie.split(" ")

                                            profile.innerHTML = personneArray[0] + '...'

                                        } else {
                                            profile.innerHTML = element.emploie
                                        }

                                        profile_container.appendChild(profile)
                                        name_container.appendChild(nom)

                                        profile.addEventListener("click", () => {
                                            const myModalprospect = document.querySelector("#myModalprospect")
                                            myModalprospect.style.display = "block"
                                            const name_prospect = document.querySelector(".name_prospect")
                                            name_prospect.innerText = element.profile
                                        })

                                        imgSrc.addEventListener("click", () => {
                                            window.open(element.lien_linkedin)
                                        })

                                        profile_container.setAttribute("title", element.emploie)
                                        // appending children
                                        rowProfile.appendChild(checkbox)
                                        rowProfile.appendChild(img)
                                        rowProfile.appendChild(nom)
                                        rowProfile.appendChild(profile)
                                        rowProfile.appendChild(ville)
                                        rowProfile.appendChild(enrichir)

                                        parent.appendChild(rowProfile)

                                    });


                                    const headers = ["Profile", "Emploie", "Lien LinkedIn", "Ville"];
                                    const csvRows = result.map(element => {
                                        let splitProfile = element.profile.split(' ');
                                        let firstName = splitProfile[0];
                                        let lastName = splitProfile.slice(1).join(' ');
                                        return [`"${firstName.replace(/"/g, '""')}"`, `"${lastName.replace(/"/g, '""')}"`, `"${element.emploie.replace(/"/g, '""')}"`, `"${element.lien_linkedin.replace(/"/g, '""')}"`, `"${element.lieu_emploie.replace(/"/g, '""')}"`];
                                    });




                                    const csvData = [headers].concat(csvRows).map(row => row.join(",")).join("\n");

                                    // Create link to download CSV file
                                    const csvBlob = new Blob([csvData], { type: "text/csv" });
                                    const csvUrl = URL.createObjectURL(csvBlob);
                                    const link = document.createElement("a");
                                    link.href = csvUrl;

                                    link.download = "test.csv";
                                    checkboxAll.addEventListener("change", () => {
                                        const checkboxes = document.querySelectorAll("input[type='checkbox']:not(#checkbox_all)");
                                        checkboxes.forEach((checkbox) => {
                                            checkbox.checked = checkboxAll.checked;
                                        });

                                        if (checkboxAll.checked) {
                                            checkedData = result
                                                .filter(element => !element.lien_linkedin.includes("/search/results/"))
                                                .map(element => {
                                                    let splitProfile = element.profile.split(' ');
                                                    let firstName = splitProfile[0];
                                                    let lastName = splitProfile.slice(1).join(' ');

                                                    // remove emojis from firstName and lastName
                                                    const emojiRegex = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
                                                    firstName = firstName.replace(emojiRegex, '');
                                                    lastName = lastName.replace(emojiRegex, '');

                                                    let linkedinLink = element.lien_linkedin;
                                                    if (linkedinLink.includes("%C3%A9")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%A9", "é");
                                                    }
                                                    if (linkedinLink.includes("%C3%A8")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%A8", "è");
                                                    }
                                                    if (linkedinLink.includes("%C3%AB")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%AB", "ë");
                                                    }
                                                    if (linkedinLink.includes("%C3%AE")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%AE", "î");
                                                    }
                                                    if (linkedinLink.includes("%C3%A7")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%A7", "ç");
                                                    }
                                                    if (linkedinLink.includes("%C3%AF")) {
                                                        linkedinLink = linkedinLink.replaceAll("%C3%AF", "ï");
                                                    }



                                                    return [lastName, firstName, linkedinLink];

                                                });

                                            modalt_top.style.display = "block";
                                            const selected_count = document.querySelector(".selected-count")
                                            selected_count.innerHTML = result.length
                                            btn_start_campaign.addEventListener("click", () => {



                                                fetch(`/campaigns/${resultList._id}`, {
                                                    method: "GET",
                                                })
                                                    .then(response => response.json())
                                                    .then(data => {
                                                        if (data) {

                                                            console.log("data", data)

                                                            location.href = `/campagne_mailing?campaignId=${resultList._id}`

                                                        }

                                                    })
                                            })
                                        } else {
                                            checkedData = [];
                                            const modalt_top = document.querySelector(".displayModalTop");
                                            modalt_top.style.display = "none";
                                        }
                                    });


                                }

                            })

                    })

            })

            icon_modify.addEventListener("click", (e) => {
                e.stopPropagation()
                alert("ok")
                showList.remove()
            })

            icon_drop.addEventListener("click", (e) => {
                e.stopPropagation()
                fetch(`/nameListProspect/${result[i]._id}`, {
                    method: "DELETE",
                })
                    .then(response => {
                        response.json()
                        if (response.status === 200) {

                            const delete_alert_success = document.querySelector("#delete-alert-success")
                            delete_alert_success.style.display = "block"
                            showList.remove()
                        }
                        else {

                            const error_alert = document.querySelector("#delete-error-alert");
                            error_alert.style.display = "block";
                        }

                    })
                    .catch(err => console.log(err))
            }
            )

        }

    })






download_csv_btn.addEventListener("click", () => {
    const filterData = checkedData.filter(element => !element[2].includes("/search/results/"));
    console.log("DATA FILTREED", filterData)
    const headers = ["NOM", "PRENOM", "LINKEDIN"];
    const csvData = [headers].concat(filterData.map(row => row.map(data => `"${data.replace(/"/g, '""')}"`).join(','))).join("\n");


    // Créez un lien pour télécharger le fichier CSV
    const csvBlob = new Blob([csvData], { type: "text/csv" });
    const csvUrl = URL.createObjectURL(csvBlob);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = "test.csv";
    link.click();
});

download_excel_btn.addEventListener("click", () => {
    const filteredData = checkedData.filter(element => !element[2].includes("/search/results/"));

    let dataToDownload = filteredData;

    dataToDownload = checkedData;


    const headers = ["NOM", "PRENOM", "LINKEDIN"];
    const xlsxData = [headers].concat(dataToDownload);

    // Création d'un classeur
    let wb = XLSX.utils.book_new();

    // Convertit les données en feuille de calcul
    let ws = XLSX.utils.aoa_to_sheet(xlsxData);

    // Ajoute la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(wb, ws, "Test");

    // Génère le classeur dans un fichier binaire XLSX
    let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    // Crée un blob avec le fichier XLSX
    let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    // Crée un lien pour télécharger le blob
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "test.xlsx";
    link.click();
});

// Fonction pour convertir le string en array buffer
function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}




const btn_close_top_overlay = document.querySelector(".btn-close-top-overlay")
const displayModalTopOverlay = document.querySelector(".displayModalTop")
btn_close_top_overlay.addEventListener("click", () => {

    displayModalTopOverlay.style.display = "none"

})

const token = localStorage.getItem("token")



async function createNameList(nameListProspect, icon) {
    try {

        const response = await fetch("/nameListProspect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`

            },
            body: JSON.stringify({
                nameListProspect: nameListProspect,

            })
        });

        const data = await response.json();
        console.log(data._id); // afficher la réponse de la requête dans la console

        if (response.status === 400) {
            const error_alert = document.querySelector("#error-alert");
            error_alert.style.display = "block";
        }
        else if (response.status === 200) {

            const success_alert = document.querySelector("#success-alert");
            success_alert.style.display = "block";
            const button = document.createElement("div")
            button.classList.add("button-46")
            const container_icons = document.createElement("div")
            container_icons.classList.add("container_icons")

            const icon_modify = document.createElement("i")
            icon_modify.classList.add("fa-regular", "fa-pen-to-square")

            const icon_drop = document.createElement("i")
            icon_drop.classList.add("fa-regular", "fa-trash-can")

            const div = document.createElement("div")

            div.appendChild(button)

            button.appendChild(document.createTextNode(nameListProspect))

            container_icons.appendChild(icon_modify)
            container_icons.appendChild(icon_drop)

            button.appendChild(container_icons)
            liste.appendChild(div)

            liste_input.style.display = "none"
            liste_btn.style.display = "none"


            modalForList.style.display = "block"




            btn.addEventListener("click", () => {
                modalForList.style.display = "none"
                myModal.style.display = "block"
                btnClose.addEventListener('click', () => {
                    myModal.style.display = "none"
                    fetch(`/nameListProspect/${data._id}`, {
                        method: "DELETE",
                    })
                        .then(response => {
                            response.json()
                            if (response.status === 200) {
                                console.log("ok")
                                const delete_alert_success = document.querySelector("#delete-alert-success")
                                delete_alert_success.style.display = "block"
                                showList.remove()

                            }
                            else {

                                const error_alert = document.querySelector("#delete-error-alert");
                                error_alert.style.display = "block";
                            }



                        })


                })
            })

            window.addEventListener("click", (e) => {
                if (e.target == myModal) {
                    myModal.style.display = "none"
                    fetch(`/nameListProspect/${data._id}`, {
                        method: "DELETE",
                    })
                        .then(response => {
                            response.json()
                            if (response.status === 200) {
                                console.log("ok")
                                const delete_alert_success = document.querySelector("#delete-alert-success")
                                delete_alert_success.style.display = "block"
                                showList.remove()

                            }
                            else {
                                const error_alert = document.querySelector("#delete-error-alert");
                                error_alert.style.display = "block";
                            }



                        })

                }
            })



            // BOUTON PRINCIPALE "RECHERCHE DE PERSONNES"
            form_data.addEventListener("submit", (e) => {
                display_empty_sources.style.display = "none"
                display_skeleton_table.style.display = "block"
                e.preventDefault();
                container_table.style.display = "block"
                const valueLink = input_modal.value

                fetch(`/donnees/${data._id}?input=${valueLink}`, { method: "GET", signal })
                    .then(response => response.json())
                    .then(result => {

                        if (result) {
                            display_skeleton_table.style.display = "none"
                            result.forEach(element => {
                                // container
                                setTimeout(() => {
                                    location.reload()
                                }, 2000)
                                let rowProfile = document.createElement("tr")
                                // elements 
                                let checkbox = document.createElement("td")
                                let checkboxInput = document.createElement('input')
                                checkboxInput.type = "checkbox"
                                let img = document.createElement("td")
                                let imgSrc = document.createElement('img')
                                let nom = document.createElement("td")
                                let profile = document.createElement("td")
                                let ville = document.createElement("td")


                                // attributing values 

                                // sub-parent
                                rowProfile.classList.add("row")



                                // children
                                checkbox.classList.add("checkbox")
                                checkbox.appendChild(checkboxInput)
                                imgSrc.classList.add("photo")
                                imgSrc.src = element.photo_profile.src
                                img.classList.add("picture")
                                img.appendChild(imgSrc)
                                nom.classList.add("nom")
                                nom.innerText = element.profile
                                ville.classList.add("ville")
                                ville.innerText = element.lieu_emploie

                                const profile_container = document.createElement("div")
                                profile_container.classList.add("profile_container")

                                const name_container = document.createElement("div")
                                name_container.classList.add("name_container")

                                profile.classList.add("profile")
                                profile.innerText = element.emploie
                                profile_container.appendChild(profile)
                                name_container.appendChild(nom)

                                profile.addEventListener("click", () => {
                                    const myModalprospect = document.querySelector("#myModalprospect")
                                    myModalprospect.style.display = "block"
                                    const name_prospect = document.querySelector(".name_prospect")
                                    name_prospect.innerText = element.profile
                                })

                                imgSrc.addEventListener("click", () => {
                                    window.open(element.lien_linkedin)
                                })

                                profile_container.setAttribute("title", element.emploie)
                                // appending children
                                rowProfile.appendChild(checkbox)
                                rowProfile.appendChild(img)
                                rowProfile.appendChild(nom)
                                rowProfile.appendChild(profile_container)
                                rowProfile.appendChild(ville)



                                parent.appendChild(rowProfile)



                            });

                        }
                        else {
                            console.log(result)
                            li_at_display.style.display = 'block';
                            li_at_display.addEventListener("click", () => {
                                location.href = "modify"
                            })
                        }




                    })
                    .catch((error, result) => {
                        if (error.name === 'AbortError') {
                            console.log(result)
                        } else {
                            console.error('Error:', error);
                        }
                    })

                myModal.style.display = "none"

            })




        }
        else if (response.status === 500) {
            const error_alert = document.querySelector("#error-server");
            error_alert.style.display = "block";
        }
    } catch (err) {
        console.error(err);
    }

}



let parent = document.querySelector("#parentProfils")
const displayed_loader = document.querySelector(".displayed_loader")



const search = document.querySelector("#search")
search.addEventListener("keyup", (e) => {
    const filter = e.target.value.toUpperCase();
    const tr = document.querySelectorAll("tr")
    tr.forEach((element) => {
        const td = element.querySelectorAll(".nom")
        td.forEach((element) => {
            const textValue = element.textContent || element.innerText
            if (filter === "" || textValue.toUpperCase().startsWith(filter)) {
                element.parentElement.style.display = ""
            } else {
                element.parentElement.style.display = "none"
            }
        })
    })
})


// BOUTON PRINCIPALE "PERSONNES EN RELATION "

btn_get_freinds.addEventListener("click", () => {
    modalForList.style.display = "none"
    const btn_valider_freind = document.querySelector("#modal-btnRelation")
    myModal2.style.display = "block"

    closeRelation.addEventListener("click", () => {
        myModal2.style.display = "none"
    })
    window.addEventListener('click', (e) => {
        if (e.target == myModal2) {
            myModal2.style.display = "none"
        }
    })

    btn_valider_freind.addEventListener("click", (e) => {
        container_table.style.display = "block"
        myModal2.style.display = "none"

        e.preventDefault()
        fetch("/freind")
            .then(response => response.json())
            .then(result => {

                result.forEach(element => {
                    // container
                    let rowProfile = document.createElement("tr")

                    // elements 

                    let img = document.createElement("td")
                    let imgSrc = document.createElement('img')
                    let nom = document.createElement("td")
                    let profile = document.createElement("td")


                    // attributing values 

                    // sub-parent
                    rowProfile.classList.add("row")


                    // children
                    imgSrc.classList.add("photo")
                    imgSrc.src = element.photo_profile
                    img.classList.add("picture")
                    img.appendChild(imgSrc)
                    nom.classList.add("nom")
                    nom.innerText = element.profile
                    profile.classList.add("profile")
                    profile.innerText = element.emploie

                    // appending children
                    rowProfile.appendChild(img)
                    rowProfile.appendChild(nom)
                    rowProfile.appendChild(profile)

                    parent.appendChild(rowProfile)




                });
            }).catch(error => console.log('error', error));



    })

})

// BOUTON PRINCIPALE "VISITEUR DE MON PROFIL "
btnVisits.addEventListener("click", () => {
    modalForList.style.display = "none"
    VisitsModal.style.display = "block"
    const modal_btnVisits = document.querySelector("#modal-btnVisits")
    closeVisits.addEventListener("click", () => {
        VisitsModal.style.display = "none"
    })

    window.addEventListener("click", (e) => {
        if (e.target == VisitsModal) {
            VisitsModal.style.display = "none"
        }
    })
    modal_btnVisits.addEventListener("click", (e) => {
        VisitsModal.style.display = "none"
        container_table.style.display = "block"
        const contain_loader = document.querySelector(".contain_loader")
        contain_loader.style.display = "block"
        e.preventDefault()
        fetch("http://localhost:3000/visits")
            .then(response => response.json())
            .then(result => {

                result.forEach(element => {
                    // container
                    let rowProfile = document.createElement("tr")

                    // elements 
                    let img = document.createElement("td")
                    let imgSrc = document.createElement('img')
                    let nom = document.createElement("td")
                    let profile = document.createElement("td")


                    // attributing values 

                    // sub-parent
                    rowProfile.classList.add("row")


                    // children
                    imgSrc.classList.add("photo")
                    imgSrc.src = element.profile_pic
                    img.classList.add("picture")
                    img.appendChild(imgSrc)
                    nom.classList.add("nom")
                    nom.innerText = element.profile_name
                    profile.classList.add("profile")
                    profile.innerText = element.emploie


                    // appending children
                    rowProfile.appendChild(img)
                    rowProfile.appendChild(nom)
                    rowProfile.appendChild(profile)

                    parent.appendChild(rowProfile)

                    contain_loader.style.display = "none"
                });
            }).catch(error => console.log('error', error));

    })

})






closeBtnForList.addEventListener("click", () => {
    modalForList.style.display = "none"
})

window.addEventListener("click", (e) => {
    if (e.target == modalForList) {
        modalForList.style.display = "none"
    }
})


/* fetch(url)
.then(res => res.json())
.then(datas => {
    console.log(datas)
    const test = document.querySelector(".test_generate")
    const trInTbody = document.querySelector("tbody tr")
    
    for (let data of datas){
        trInTbody.style.border ="5px solid red"
        const td= document.createElement("td")
        const checkbox = document.createElement("input")
        td.style.border = "2px solid green"
        checkbox.setAttribute("type", "checkbox")
        const img = document.createElement("img")
        img.style.height= "20px";
        img.src = data.photo_profile
        const nom = document.createElement("p")
        nom.innerText = data.profile

        td.appendChild(checkbox)
        td.appendChild(img)
        td.appendChild(nom)
        trInTbody.appendChild(td)
        test.appendChild(trInTbody)

        

    }
}) */


const li_at_display = document.querySelector('.li_at_display');
const modal_li_at = document.querySelector('.modal_li_at');
const modalClose_li_at = document.querySelector('.modal-close_li_at');
const modalButton_li_at = document.querySelector('.modal-buttons_li_at button');

modalClose_li_at.addEventListener('click', () => {
    li_at_display.style.display = 'none';
});

modalButton_li_at.addEventListener('click', () => {
    li_at_display.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal_li_at) {
        modal_li_at.style.display = 'none';
    }
});




