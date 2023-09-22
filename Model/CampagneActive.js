const mongoose = require('mongoose');


const CampagneActive = mongoose.Schema({
    nameListProspectId: { type: String, required: true },
    active: { type: Boolean, default: true },
    step: { type: Number, default: 0 },
    timeline: [{
        event: { type: String },
        date: { type: Date }
    }]
})

module.exports = mongoose.model("Campagne_Active", CampagneActive)