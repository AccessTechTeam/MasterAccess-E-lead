const mongoose = require("mongoose")

// Définition du schéma pour la collection userInscription
const inscription_Schema = new mongoose.Schema({
    nom: { 
        type: String, 
        required: true // Champ obligatoire
    },
    username: { 
        type: String, 
        required: true // Champ obligatoire
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // E-mail unique
    },
    password: { 
        type: String, 
        required: true // Champ obligatoire
    },
    repetedPassword: { 
        type: String, 
        required: true // Champ obligatoire
    },
    photo: [String], // Tableau de chaînes pour les photos
    date: { 
        type: Date, 
        default: Date.now // Date par défaut (date actuelle)
    },
    role: { 
        type: String, 
        required: true // Champ obligatoire
    },
    token: { 
        type: String // Token
    }
})

// Export du modèle basé sur le schéma inscription_Schema avec le nom "userInscription"
module.exports = mongoose.model("userInscription", inscription_Schema)
