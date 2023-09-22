const mongoose = require('mongoose');

// Définition du schéma pour la collection Mailing
const MailingSchema = new mongoose.Schema({
    nameListProspect: { type: mongoose.Schema.Types.ObjectId, ref: 'Campagne', required: true }, // Référence à la collection Campagne
    prospect: { type: mongoose.Schema.Types.ObjectId, ref: 'Prospect', required: true }, // Référence à la collection Prospect
    nameCampagne: { type: String, required: true }, // Nom de la campagne
    date: { type: Date }, // Date de la campagne (peut être facultative)
    nb_invitation: { type: Number }, // Nombre d'invitations (peut être facultatif)
    nb_message: { type: Number }, // Nombre de messages (peut être facultatif)
    nb_invitation_envoyé: { type: Number }, // Nombre d'invitations envoyées (peut être facultatif)
    nb_message_envoyé: { type: Number }, // Nombre de messages envoyés (peut être facultatif)
    nb_invitation_non_envoyé: { type: Number }, // Nombre d'invitations non envoyées (peut être facultatif)
    nb_message_non_envoyé: { type: Number }, // Nombre de messages non envoyés (peut être facultatif)
});

// Export du modèle basé sur le schéma MailingSchema
module.exports = mongoose.model('Mailing', MailingSchema);
