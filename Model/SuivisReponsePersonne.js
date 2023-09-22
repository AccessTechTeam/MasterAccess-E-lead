const  mongoose = require('mongoose');


const SuiviReponsePersonnesSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' , required :true },
    personneId : {type: mongoose.Schema.Types.ObjectId, ref : "Lien_Linkedin_Prospect", required :true}, 
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Campagne",
        required: true
    },
    link : {
        type : String,
        required : true,
    },
    prenom : {
        type : String,
        required : true,
    },
    nom : {
        type : String,
        required : true,
    },
    dateEnvoiMessage: {
    type: Date,
    required: true
    },
    dateDeuxiemeMessage: {
        type: Date
    },
    });

     

    module.exports = mongoose.model('SuiviReponsePersonnes', SuiviReponsePersonnesSchema);

