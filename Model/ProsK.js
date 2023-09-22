const mongoose = require('mongoose');

// Définition du schéma pour la collection ProsK
const prosK = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lien_Linkedin_Prospect" // Référence à la collection Lien_Linkedin_Prospect
    },
    nom: {
        type: String,
        required: true // Champ obligatoire
    },
    prenom: {
        type: String,
        required: true // Champ obligatoire
    },
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campagne" // Référence à la collection Campagne
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription' // Référence à la collection userInscription
    },
    email: {
        type: String // E-mail
    },
    num: {
        type: String // Numéro de téléphone
    },
    mailSent: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    ToCall: {
        type: Boolean,
        default: false // Champ par défaut à false
    }
});

// Export du modèle basé sur le schéma prosK avec le nom "ProsK"
module.exports = mongoose.model("ProsK", prosK);
