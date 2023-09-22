const mongoose = require('mongoose');

// Définition du schéma pour la collection Campagne_invitation_linkedin
const CampagneInvitationLinkedinSchema = new mongoose.Schema({
    nameListProspect: { type: mongoose.Schema.Types.ObjectId, ref: 'Campagne', required: true }, // Référence à la collection Campagne
    prospect: { type: mongoose.Schema.Types.ObjectId, ref: 'Prospect', required: true }, // Référence à la collection Prospect
    nameCampagne: { type: String, required: true }, // Nom de la campagne
    date: { type: Date, required: true }, // Date de la campagne
    nb_invitation: { type: Number, required: true }, // Nombre d'invitations prévues
    nb_message: { type: Number, required: true }, // Nombre de messages prévus
    nb_invitation_envoyé: { type: Number, required: true }, // Nombre d'invitations envoyées
    nb_message_envoyé: { type: Number, required: true }, // Nombre de messages envoyés
    nb_invitation_non_envoyé: { type: Number, required: true }, // Nombre d'invitations non envoyées
    nb_message_non_envoyé: { type: Number, required: true }, // Nombre de messages non envoyés
});

// Export du modèle basé sur le schéma CampagneInvitationLinkedin
module.exports = mongoose.model('Campagne_invitation_linkedin', CampagneInvitationLinkedinSchema);
