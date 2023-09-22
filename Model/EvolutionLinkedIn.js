const { required } = require('joi');  
const mongoose = require('mongoose');

// Définition du schéma pour la collection EvolutionLinkedIn
const EvolutionLinkedInSchema = new mongoose.Schema({
    Relation: { type: Number, default: 0 }, // Le nombre de relations
    enAttente: { type: Number, default: 0 }, // Le nombre de demandes en attente
    VuesDuProfil: { type: Number, default: 0 }, // Le nombre de vues du profil
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription', required: true } // Référence à la collection userInscription
}, { timestamps: true }); // Ajoutez des horodatages (timestamps) automatiquement

// Export du modèle basé sur le schéma EvolutionLinkedInSchema
module.exports = mongoose.model('EvolutionLinkedIn', EvolutionLinkedInSchema);
