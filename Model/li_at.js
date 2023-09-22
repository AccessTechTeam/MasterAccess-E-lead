const mongoose = require('mongoose');

// Définition du schéma pour la collection li_at
const li_atSchema = new mongoose.Schema({
    li_at: {
        type: String,
        required: true // Champ obligatoire
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userInscription' // Référence à la collection userInscription
    }
});

// Export du modèle basé sur le schéma li_atSchema avec le nom "li_at"
module.exports = mongoose.model('li_at', li_atSchema);
