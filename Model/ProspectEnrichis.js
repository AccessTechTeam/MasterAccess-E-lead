const mongoose = require("mongoose")


const prospectEnrichis = new mongoose.Schema({
    nom_complet : {type : String , required : true},
    Entreprise : {type : String , required: false  , default : '0'},
    Poste : {type : String , required: true },
    NombreDeRelationDuProspect : {type : String , required: true },
    lien_linkedin_entreprise : {type : String , required: true  },
    experience : {type : String , required: true },
    entreprise_actuelle : {type : String , required: true },
    temp_en_entreprise : {type : String , required: true }, 
    nameListProspect : {type : mongoose.Schema.Types.ObjectId, ref : 'Campagne' , required : true},
    ProspectRechecheModels : {type : mongoose.Schema.Types.ObjectId, ref : 'Prospect' , required : true},
    

})


module.exports = mongoose.model("Prospect Enrichis" ,prospectEnrichis)