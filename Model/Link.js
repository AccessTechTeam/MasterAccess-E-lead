const mongoose = require('mongoose');

// Définition du schéma pour la collection Liens_linkedin_prospect
const Liens_linkedin_prospect = new mongoose.Schema({
    url: {
        type: String,
        unique: true // URL unique
    },
    processed: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    nom: {
        type: String,
        required: true // Champ obligatoire
    },
    messages: {
        type: String // Messages
    },
    nameListProspectId: {
        type: String // Identifiant de la liste de prospects
    },
    photo: {
        type: String // URL de la photo
    },
    emploie: {
        type: String // Emploi
    },
    lieu_emploie: {
        type: String // Lieu de l'emploi
    },
    entreprise: {
        type: String // Nom de l'entreprise
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription' // Référence à la collection userInscription
    },
    inQueue: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    step: {
        type: Number,
        default: 0 // Étape par défaut à 0
    },
    date: {
        type: Date,
        required: true // Champ obligatoire
    },
    messageSent: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    Kaspr: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    inProcess: {
        type: Boolean,
        default: true // Champ par défaut à true
    },
    responseMsg: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    SecondMessageSent: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    idOfUrl: {
        type: String,
        required: true // Champ obligatoire
    },
    traited: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    toForce: {
        type: Boolean,
        default: false // Champ par défaut à false
    }
});

// Export du modèle basé sur le schéma Liens_linkedin_prospect avec le nom "Lien_Linkedin_Prospect"
module.exports = mongoose.model("Lien_Linkedin_Prospect", Liens_linkedin_prospect);
