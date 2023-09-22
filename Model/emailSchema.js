const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
    email : {type : String }, 
    sent : {type : Boolean }, 
    responseReceived : {type : Boolean}
})

module.exports= mongoose.model = ("Email" ,emailSchema )