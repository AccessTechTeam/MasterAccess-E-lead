const mongoose = require('mongoose');

const relanceSchema = new mongoose.Schema({
  destinataire: {
    type: String,
    required: true
  },
  sujet: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  dateEnvoi: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateDerniereRelance: {
    type: Date,
    required: true,
    default: Date.now
  },
  nombreRelances: {
    type: Number,
    required: true,
    default: 0
  }
});

const Relance = mongoose.model('Relance', relanceSchema);

module.exports = Relance;
