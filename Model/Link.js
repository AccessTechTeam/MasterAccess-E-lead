const mongoose = require('mongoose');


const Liens_linkedin_prospect = new mongoose.Schema({
    url: { type: String, unique: true },
    processed: { type: Boolean, default: false },
    nom: { type: String, required: true },
    messages: { type: String },
    nameListProspectId: { type: String },
    photo: { type: String },
    emploie: { type: String },
    lieu_emploie: { type: String },
    entreprise: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' },
    inQueue: { type: Boolean, default: false },
    step: { type: Number, default: 0 },
    date: { type: Date, required: true },
    messageSent: { type: Boolean, default: false },
    Kaspr: { type: Boolean, default: false },
    inProcess: { type: Boolean, default: true }, // Lien INPROCESS TRUE AU TOUT DEBUT DU LANCEMENT DE LA CAMPAGNE ET AVEC LES CONDITION CELA VARIE 
    responseMsg: { type: Boolean, default: false },
    SecondMessageSent: { type: Boolean, default: false },
    idOfUrl: { type: String, required: true },
    traited: { type: Boolean, default: false },
    toForce: { type: Boolean, default: false }

})

module.exports = mongoose.model("Lien_Linkedin_Prospect", Liens_linkedin_prospect)
