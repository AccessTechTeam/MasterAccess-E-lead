const mongoose = require('mongoose');

// Définition du schéma pour la collection allInvitation
const allInvitationSchema = new mongoose.Schema({
    nom: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    lien_linkedin: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    statut: { 
        type: String, // Type de champ : String
        required: true // Champ obligatoire
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, // Type de champ : ObjectId
        ref: 'userInscription' // Référence à la collection userInscription
    }
});

// Création d'un index unique basé sur les champs nom, statut et lien_linkedin
allInvitationSchema.index({ nom: 1, statut: 1, lien_linkedin: 1 }, { unique: true });

// Export du modèle basé sur le schéma allInvitationSchema avec le nom "allinvitation"
module.exports = mongoose.model("allinvitation", allInvitationSchema);
