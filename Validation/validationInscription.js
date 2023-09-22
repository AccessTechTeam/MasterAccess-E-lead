const Joi = require("joi");

function validationInscriptionSchema(body) {
  const userInscription = Joi.object({
    nom: Joi.string().min(2).max(12).trim().required()
      .messages({
        'string.base': `Le nom doit être une chaîne de caractères.`,
        'string.empty': `Le nom ne doit pas être vide.`,
        'string.min': `Le nom doit avoir au moins {#limit} caractères.`,
        'string.max': `Le nom ne peut pas dépasser {#limit} caractères.`,
        'any.required': `Le nom est requis.`,
      }),
    username: Joi.string().min(2).max(12).trim().required()
      .messages({
        'string.base': `Le nom d'utilisateur doit être une chaîne de caractères.`,
        'string.empty': `Le nom d'utilisateur ne doit pas être vide.`,
        'string.min': `Le nom d'utilisateur doit avoir au moins {#limit} caractères.`,
        'string.max': `Le nom d'utilisateur ne peut pas dépasser {#limit} caractères.`,
        'any.required': `Le nom d'utilisateur est requis.`,
      }),
    email: Joi.string().email().trim().required()
      .messages({
        'string.email': `L'adresse e-mail doit être valide.`,
        'string.empty': `L'adresse e-mail ne doit pas être vide.`,
        'any.required': `L'adresse e-mail est requise.`,
      }),
    password: Joi.string().required()
      .messages({
        'string.base': `Le mot de passe doit être une chaîne de caractères.`,
        'string.empty': `Le mot de passe ne doit pas être vide.`,
        'any.required': `Le mot de passe est requis.`,
      }),
    repetedPassword: Joi.string().valid(Joi.ref('password')).required()
      .messages({
        'any.only': `Les mots de passe doivent correspondre.`,
        'any.required': `La répétition du mot de passe est requise.`,
      }),
    role: Joi.string().required()
      .messages({
        'string.base': `Le rôle doit être une chaîne de caractères.`,
        'string.empty': `Le rôle ne doit pas être vide.`,
        'any.required': `Le rôle est requis.`,
      }),
    photo: Joi.binary().required()
      .messages({
        'binary.base': `La photo doit être une donnée binaire.`,
        'any.required': `La photo est requise.`,
      }),
  });

  const userConnexion = Joi.object({
    mail: Joi.string().email().trim().required()
      .messages({
        'string.email': `L'adresse e-mail doit être valide.`,
        'string.empty': `L'adresse e-mail ne doit pas être vide.`,
        'any.required': `L'adresse e-mail est requise.`,
      }),
    password: Joi.string().required()
      .messages({
        'string.base': `Le mot de passe doit être une chaîne de caractères.`,
        'string.empty': `Le mot de passe ne doit pas être vide.`,
        'any.required': `Le mot de passe est requis.`,
      }),
  });

  const li_at = Joi.object({
    li_at: Joi.string().required()
      .messages({
        'string.base': `Le token Li_at doit être une chaîne de caractères.`,
        'string.empty': `Le token Li_at ne doit pas être vide.`,
        'any.required': `Le token Li_at est requis.`,
      }),
  });

  return {
    userInscription: userInscription.validate(body),
    userConnexion: userConnexion.validate(body),
    li_at: li_at.validate(body),
  };
}

module.exports = validationInscriptionSchema;
