const mongoose = require('mongoose');

// Définition du schéma pour la collection Email
const emailSchema = mongoose.Schema({
    email: { type: String },
    sent: { type: Boolean },
    responseReceived: { type: Boolean }
});

// Export du modèle basé sur le schéma emailSchema avec le nom "Email"
module.exports = mongoose.model("Email", emailSchema);
