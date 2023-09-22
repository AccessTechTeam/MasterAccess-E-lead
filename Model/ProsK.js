const mongoose = require('mongoose');


const prosK = new mongoose.Schema({
    linkId: {type : mongoose.Schema.Types.ObjectId , ref :"Lien_Linkedin_Prospect"},
    nom : {type : String , required : true}, 
    prenom : {type : String , required : true },
    campagneId :{type : mongoose.Schema.Types.ObjectId , ref : "Campagne"},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' },
    email : {type : String}, 
    num : {type : String }, 
    mailSent: {type : Boolean , default : false},
    ToCall : {type : Boolean , default : false}
})

module.exports = mongoose.model("ProsK" , prosK)