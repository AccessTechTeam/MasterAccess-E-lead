const mongoose = require('mongoose');

const kListSchema= new mongoose.Schema({
    linkId : {type : mongoose.Schema.Types.ObjectId , ref :"Lien_Linkedin_Prospect"},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' },
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Campagne",
        required: true
    },
    nom : {type : String , required : true},
    prenom : {type : String , required : true},
    url : {type : String , required : true},
    photo : {type : String , required : true},
    idOfUrl : {type : String }

})

module.exports = mongoose.model('klist' ,kListSchema )