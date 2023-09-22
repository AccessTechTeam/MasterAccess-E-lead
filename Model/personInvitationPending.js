
const  mongoose = require('mongoose');


const personInvitationPendingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' , required :true },
    personneId : {type: mongoose.Schema.Types.ObjectId, ref : "Lien_Linkedin_Prospect", required :true}, 
    campagneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Campagne",
        required: true
    },
    lien : {type : String , required :true}, 
    pending : {type : Boolean , required : true}, 
    

})

module.exports = mongoose.model('person_invitation_pending', personInvitationPendingSchema); 




