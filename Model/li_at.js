const mongoose = require('mongoose');

const li_atSchema = new mongoose.Schema({
    li_at : { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'userInscription' }

})


module.exports = mongoose.model('li_at', li_atSchema);


