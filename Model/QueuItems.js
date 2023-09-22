const mongoose = require('mongoose');

const QueueItemSchema = new mongoose.Schema({
    url: String,
    messages: String,
    processed: Boolean,
    nameListProspectId: String,
    photo: String,
    emploie: String,
    entreprise: String,
    user: String,
    inQueue: Boolean,
})

module.exports = mongoose.model('QueueItem', QueueItemSchema);