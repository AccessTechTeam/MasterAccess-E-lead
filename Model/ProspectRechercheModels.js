const mongoose = require('mongoose');

const prospectSchema = new mongoose.Schema({
    photo_profile: { type: String, required: true },
    profile: { type: String, required: true },
    emploie: { type: String, required: false },
    lieu_emploie: { type: String, required: false },
    entreprise_actuelle: { type: String, required: true },
    lien_linkedin: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: String, required: true },
    nameListProspect : {type : mongoose.Schema.Types.ObjectId, ref : 'Campagne' , required : true},
    
});

module.exports = mongoose.model('Prospect', prospectSchema);


