const mongoose = require('mongoose');

// Définition du schéma pour la collection Campagne_Active
const CampagneActiveSchema = new mongoose.Schema({
    nameListProspectId: { type: String, required: true }, // Identifiant de la liste de prospects associée à la campagne
    active: { type: Boolean, default: true }, // Indique si la campagne est active, par défaut à true
    step: { type: Number, default: 0 }, // Étape de la campagne, par défaut à 0
    timeline: [{
        event: { type: String }, // Description de l'événement dans la timeline
        date: { type: Date } // Date de l'événement dans la timeline
    }]
});

// Export du modèle basé sur le schéma CampagneActive
module.exports = mongoose.model("Campagne_Active", CampagneActiveSchema);
