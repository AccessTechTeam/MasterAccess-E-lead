const { required } = require('joi');
const mongoose = require('mongoose');


const EvolutionLinkedInSchema = new mongoose.Schema({
    Relation : {type : Number , default: 0},
    enAttente : {type : Number, default: 0 },
    VuesDuProfil : {type : Number, default: 0 },
    userId : {type: mongoose.Schema.Types.ObjectId , ref : 'userInscription' , required : true},
    


}, { timestamps: true })

module.exports = mongoose.model('EvolutionLinkedIn', EvolutionLinkedInSchema);



