const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const nameListProspect = new mongoose.Schema(
    {
        nameListProspect: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'userInscription', required: true },
        active: { type: Boolean, default: false },
        date: { type: Date, required: false },
        completed: { type: Boolean, default: false },
        date_finished: { type: Date, required: false },
        step: { type: Number, default: 1 },
        Kaspr: { type: Boolean, default: true },
        timeline: [{

            event: { type: String },
            date: { type: Date },
            nombreTotal: { type: Number },
            numberOfadding: { type: Number, default: 0 },

        }]

    })


module.exports = mongoose.model('Campagne', nameListProspect)



