const mongoose = require('mongoose');

// Définition du schéma pour la collection Prospect
const prospectSchema = new mongoose.Schema({
    photo_profile: {
        type: String,
        required: true // Champ obligatoire
    },
    profile: {
        type: String,
        required: true // Champ obligatoire
    },
    emploie: {
        type: String,
        required: false // Champ facultatif
    },
    lieu_emploie: {
        type: String,
        required: false // Champ facultatif
    },
    entreprise_actuelle: {
        type: String,
        required: true // Champ obligatoire
    },
    lien_linkedin: {
        type: String,
        required: true // Champ obligatoire
    },
    email: {
        type: String,
        required: true // Champ obligatoire
    },
    tel: {
        type: String,
        required: true // Champ obligatoire
    },
    nameListProspect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campagne', // Référence à la collection Campagne
        required: true // Champ obligatoire
    }
});

// Export du modèle basé sur le schéma prospectSchema avec le nom "Prospect"
module.exports = mongoose.model('Prospect', prospectSchema);
