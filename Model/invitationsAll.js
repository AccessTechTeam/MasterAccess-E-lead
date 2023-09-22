const mongoose = require('mongoose');

const allInvitation = new mongoose.Schema({
    nom : {type : String , required : true },
    lien_linkedin : {type : String , required : true },
    statut : {type : String , required : true}, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' }
    
})
allInvitation.index({nom: 1, statut: 1 ,lien_linkedin: 1 }, {unique: true});

module.exports = mongoose.model("allinvitation" , allInvitation)
