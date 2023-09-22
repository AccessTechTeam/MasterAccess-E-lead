const mongoose = require('mongoose');

// Définition du schéma pour la collection QueueItem
const QueueItemSchema = new mongoose.Schema({
    url: String,
    messages: String,
    processed: Boolean,
    nameListProspectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campagne' // Référence à la collection Campagne
    },
    photo: String,
    emploie: String,
    entreprise: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription' // Référence à la collection userInscription
    },
    inQueue: Boolean
});

// Export du modèle basé sur le schéma QueueItemSchema avec le nom "QueueItem"
module.exports = mongoose.model('QueueItem', QueueItemSchema);
