const mongoose = require('mongoose');

// Définition du schéma pour la collection Favoris
const favorisSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, // Type de champ : ObjectId
        ref: 'userInscription', // Référence à la collection userInscription
        required: true // Champ obligatoire
    },
    photo_profile: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    profile: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    emploie: { 
        type: String // Type de champ : String (facultatif, car "required" n'est pas spécifié)
    },
    lieu_emploie: { 
        type: String // Type de champ : String (facultatif, car "required" n'est pas spécifié)
    },
    lien_linkedin: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    nameListProspect: { 
        type: mongoose.Schema.Types.ObjectId, // Type de champ : ObjectId
        ref: 'Campagne', // Référence à la collection Campagne
        required: true // Champ obligatoire
    },
    prospectId: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    linkId: { 
        type: mongoose.Schema.Types.ObjectId, // Type de champ : ObjectId
        ref: '' // Référence supplémentaire (vide pour le moment)
    }
});

// Export du modèle basé sur le schéma favorisSchema avec le nom "Favoris"
module.exports = mongoose.model("Favoris", favorisSchema);
