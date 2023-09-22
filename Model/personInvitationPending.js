const mongoose = require('mongoose');

// Définition du schéma pour la collection person_invitation_pending
const personInvitationPendingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription', // Référence à la collection userInscription
        required: true // Champ obligatoire
    },
    personneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lien_Linkedin_Prospect", // Référence à la collection Lien_Linkedin_Prospect
        required: true // Champ obligatoire
    },
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campagne", // Référence à la collection Campagne
        required: true // Champ obligatoire
    },
    lien: {
        type: String,
        required: true // Champ obligatoire
    },
    pending: {
        type: Boolean,
        required: true // Champ obligatoire
    }
});

// Export du modèle basé sur le schéma personInvitationPendingSchema avec le nom "person_invitation_pending"
module.exports = mongoose.model('person_invitation_pending', personInvitationPendingSchema);
