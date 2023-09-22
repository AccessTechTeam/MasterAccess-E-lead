const mongoose = require('mongoose');

// Définition du schéma pour la collection kList
const kListSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lien_Linkedin_Prospect" // Référence à la collection Lien_Linkedin_Prospect
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription' // Référence à la collection userInscription
    },
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campagne", // Référence à la collection Campagne
        required: true // Champ obligatoire
    },
    nom: {
        type: String,
        required: true // Champ obligatoire
    },
    prenom: {
        type: String,
        required: true // Champ obligatoire
    },
    url: {
        type: String,
        required: true // Champ obligatoire
    },
    photo: {
        type: String,
        required: true // Champ obligatoire
    },
    idOfUrl: {
        type: String
    }
});

// Export du modèle basé sur le schéma kListSchema avec le nom "klist"
module.exports = mongoose.model('klist', kListSchema);
