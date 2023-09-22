// Importez la fonction forceToAdd depuis le module correspondant
const forceToAdd = require("./forceToAdd");

// Fonction asynchrone pour effectuer les opérations
async function tempo() {
    // Utilisez la fonction forceToAdd pour vérifier l'état de la connexion LinkedIn
    // Vous devez fournir un cookie li_at et l'URL du profil LinkedIn à vérifier
    const status = await forceToAdd("AQEDAUVQpRwBp4MnAAABiYyuBGQAAAGJsLqIZE0AVnonT-r4-z3L0pQseEL0uVw43gUKw1c-Zk7AafHYBlhdNP3Mk4ZTSeEdtaLnmLq3WYvic_ilCLqwPkd9qVIGjpwkNewvoJZcOV2TTnikyQ7oJF3A", "https://www.linkedin.com/in/askar-sultanov-b6400873/")

    // En fonction de l'état obtenu, imprimez différents messages
    if (status.status === "Attente") {
        console.log("Attente")
    }
    else if (status.status === "Ajouté") {
        console.log("Ajouté")
    }
    else if (status.status === false) {
        console.log(false)
    }
    else if (status.status === true) {
        console.log(true)
    }
    else if (status.status === "Amis") { // Utilisez === ici pour comparer correctement les chaînes
        console.log("Amis")
    }
}

// Appelez la fonction tempo pour l'exécuter
tempo();
