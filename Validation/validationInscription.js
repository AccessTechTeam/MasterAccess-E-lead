const joi = require("joi")


function validationInscriptionSchema(body){
    const userInscription = joi.object({
        nom : joi.string().min(2).max(12).trim().required(),
        username : joi.string().min(2).max(12).trim().required(),
        email : joi.string().email().trim().required(),
        password : joi.string().required(),
        repetedPassword : joi.string().required(),
        role : joi.string().required(), 
        photo: joi.binary().required()
    })

    const userConnexion = joi.object({
        mail : joi.string().email().trim().required(),
        password : joi.string().required()
    })

    const li_at = joi.object({
        li_at : joi.string().required(),
        
    })

    return {
        userInscription : userInscription.validate(body),
        userConnexion : userConnexion.validate(body), 
        li_at : li_at.validate(body)
    }

}


module.exports = validationInscriptionSchema
