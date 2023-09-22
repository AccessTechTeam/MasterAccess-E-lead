const mongoose = require('mongoose');

const Campagne_invitation_linkedin = mongoose.Schema({
    nameListProspect : { type : mongoose.Schema.Types.ObjectId, ref : 'Campagne' , required : true},
    prospect : { type : mongoose.Schema.Types.ObjectId, ref : 'Prospect' , required : true},
    nameCampagne : { type : String, required : true},
    date : { type : Date, required : true},
    nb_invitation : { type : Number, required : true},
    nb_message : { type : Number, required : true},
    nb_invitation_envoyé : { type : Number, required : true},
    nb_message_envoyé : { type : Number, required : true},
    nb_invitation_non_envoyé : { type : Number, required : true},
    nb_message_non_envoyé : { type : Number, required : true},
    
})

module.exports = mongoose.model('Campagne_invitation_linkedin', Campagne_invitation_linkedin);