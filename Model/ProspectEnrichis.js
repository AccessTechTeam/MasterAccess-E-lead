const mongoose = require("mongoose")

// Définition du schéma pour la collection Prospect Enrichis
const prospectEnrichis = new mongoose.Schema({
    nom_complet: {
        type: String,
        required: true // Champ obligatoire
    },
    Entreprise: {
        type: String,
        required: false,
        default: '0' // Valeur par défaut '0'
    },
    Poste: {
        type: String,
        required: true // Champ obligatoire
    },
    NombreDeRelationDuProspect: {
        type: String,
        required: true // Champ obligatoire
    },
    lien_linkedin_entreprise: {
        type: String,
        required: true // Champ obligatoire
    },
    experience: {
        type: String,
        required: true // Champ obligatoire
    },
    entreprise_actuelle: {
        type: String,
        required: true // Champ obligatoire
    },
    temp_en_entreprise: {
        type: String,
        required: true // Champ obligatoire
    },
    nameListProspect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campagne', // Référence à la collection Campagne
        required: true // Champ obligatoire
    },
    ProspectRechecheModels: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prospect', // Référence à la collection Prospect
        required: true // Champ obligatoire
    }
})

// Export du modèle basé sur le schéma prospectEnrichis avec le nom "Prospect Enrichis"
module.exports = mongoose.model("Prospect Enrichis", prospectEnrichis)
