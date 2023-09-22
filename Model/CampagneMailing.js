const mongoose = require('mongoose');


const MailingSchema = new mongoose.Schema({
    nameListProspect : { type : mongoose.Schema.Types.ObjectId, ref : 'Campagne' , required : true},
    prospect : { type : mongoose.Schema.Types.ObjectId, ref : 'Prospect' , required : true},
    nameCampagne : { type : String, required : true},
    date : { type : Date, required : false},
    nb_invitation : { type : Number, required : false},
    nb_message : { type : Number, required : false},
    nb_invitation_envoyé : { type : Number, required : false},
    nb_message_envoyé : { type : Number, required : false},
    nb_invitation_non_envoyé : { type : Number, required : false},
    nb_message_non_envoyé : { type : Number, required : false},
});

module.exports = mongoose.model('Campagne_invitation_linkedin', MailingSchema);



