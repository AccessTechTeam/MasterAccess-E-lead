const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Définition du schéma pour la collection Campagne
const nameListProspect = new mongoose.Schema({
    nameListProspect: {
        type: String,
        required: true // Champ obligatoire
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'userInscription', // Référence à la collection userInscription
        required: true // Champ obligatoire
    },
    active: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    date: {
        type: Date // Date (facultative)
    },
    completed: {
        type: Boolean,
        default: false // Champ par défaut à false
    },
    date_finished: {
        type: Date // Date de fin (facultative)
    },
    step: {
        type: Number,
        default: 1 // Étape par défaut à 1
    },
    Kaspr: {
        type: Boolean,
        default: true // Champ par défaut à true
    },
    timeline: [{
        event: {
            type: String // Événement
        },
        date: {
            type: Date // Date de l'événement
        },
        nombreTotal: {
            type: Number // Nombre total (peut être facultatif)
        },
        numberOfadding: {
            type: Number,
            default: 0 // Nombre d'ajouts par défaut à 0
        },
    }]
})

// Export du modèle basé sur le schéma nameListProspect avec le nom "Campagne"
module.exports = mongoose.model('Campagne', nameListProspect)
