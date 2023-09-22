const Favoris = require("../Model/Favoris")
const NameListProspet = require("../Model/NameListProspet")

exports.deleteOneFavoris = (req, res)=>{
    const id = req.params.id
    
    Favoris.findByIdAndDelete({_id : id})
    .then(() => {
        res.status(200).json({message : 'Supprimé avec succès!'})
    })
    .catch((err)=>{
        res.status(500).json({message : "Erreur l'or de la suppression veuillez réessayer plus tard !"})
    })
} 

exports.deleteAllFavoris = (req, res)=>{
    const user = req.user.userId
    Favoris.deleteMany({userId : user })
    .then(()=>{
        res.status(200).json({message : 'La liste des favoris a été supprimée avec succès !'})
    })
}

exports.lancerCampagne = (req , res)=>{
    const user = req.user.userId
    const nameListProspect = req.body.nameListProspect
    const data = req.body.data
    console.log("USERRRR", user)
    console.log("NAMME", nameListProspect)
    console.log("DATAA", data)
    
    NameListProspet.find({userId : user , active : true })
    .then((result)=>{
        console.log(result)
        if(result.length > 0){
            res.status(500).json({message: "Une campagne est deja active , veuillez attendre que celle si sois terminé !"})
        }
        else{
            new NameListProspet({
                nameListProspect,
                userId : user , 
                active : true , 
                date : new Date()
            })
            .save()
            .then(()=>{
                res.status(200).json({message: "Campagne enregistrée et lancée !"})
            })
            .catch((err)=>{
                console.log()

            })
            
        }
    })
    

}

