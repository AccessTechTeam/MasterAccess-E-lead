const mongoose = require('mongoose');

// Définition du schéma pour la collection Relance
const relanceSchema = new mongoose.Schema({
  destinataire: {
    type: String,
    required: true // Champ obligatoire
  },
  sujet: {
    type: String,
    required: true // Champ obligatoire
  },
  message: {
    type: String,
    required: true // Champ obligatoire
  },
  dateEnvoi: {
    type: Date,
    required: true,
    default: Date.now // Date par défaut, obligatoire
  },
  dateDerniereRelance: {
    type: Date,
    required: true,
    default: Date.now // Date par défaut, obligatoire
  },
  nombreRelances: {
    type: Number,
    required: true,
    default: 0 // Valeur par défaut de 0
  }
});

// Création du modèle basé sur le schéma relanceSchema avec le nom "Relance"
const Relance = mongoose.model('Relance', relanceSchema);

// Export du modèle
module.exports = Relance;
