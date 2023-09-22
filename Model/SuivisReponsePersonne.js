const mongoose = require('mongoose');

// Définition du schéma pour la collection Relance
const relanceSchema = new mongoose.Schema({
  destinataire: {
    type: String,
    required: true // Champ obligatoire : destinataire de la relance
  },
  sujet: {
    type: String,
    required: true // Champ obligatoire : sujet de la relance
  },
  message: {
    type: String,
    required: true // Champ obligatoire : contenu du message de relance
  },
  dateEnvoi: {
    type: Date,
    required: true,
    default: Date.now // Date par défaut, obligatoire : date d'envoi de la relance
  },
  dateDerniereRelance: {
    type: Date,
    required: true,
    default: Date.now // Date par défaut, obligatoire : date de la dernière relance
  },
  nombreRelances: {
    type: Number,
    required: true,
    default: 0 // Valeur par défaut de 0 : nombre de relances effectuées
  }
});

// Création du modèle basé sur le schéma relanceSchema avec le nom "Relance"
const Relance = mongoose.model('Relance', relanceSchema);

// Export du modèle
module.exports = Relance;
