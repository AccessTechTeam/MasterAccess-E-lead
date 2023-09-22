
const mongoose = require('mongoose');


const favoris = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref :'userInscription' , required : true},
    photo_profile: { type: String, required: true },
    profile: { type: String, required: true },
    emploie: { type: String, required: false },
    lieu_emploie: { type: String, required: false },
    lien_linkedin: { type: String, required: true },
    nameListProspect : {type : mongoose.Schema.Types.ObjectId, ref : 'Campagne' , required : true},
    prospectId : {type: String, required: true},
    linkId : {type : mongoose.Schema.Types.ObjectId , ref : ''}
})

module.exports = mongoose.model("Favoris" , favoris)


