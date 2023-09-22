const mongoose = require('mongoose');

// Schéma pour les e-mails
const emailSchema = new mongoose.Schema({
  email: String, // Adresse e-mail
  valid: Boolean, // Indique si l'e-mail est valide
});

// Schéma pour les profils
const profileSchema = new mongoose.Schema({
  id: String, // Identifiant du profil
  name: String, // Nom complet
  firstName: String, // Prénom
  lastName: String, // Nom de famille
  emails: [emailSchema], // Liste d'adresses e-mail avec validation
  professionalEmail: String, // Adresse e-mail professionnelle
  starryProfessionalEmail: String, // Adresse e-mail professionnelle Starry
  professionalEmails: [String], // Liste d'adresses e-mail professionnelles
  personalEmail: String, // Adresse e-mail personnelle
  starryPersonalEmail: String, // Adresse e-mail personnelle Starry
  personalEmails: [String], // Liste d'adresses e-mail personnelles
  starryPhone: String, // Numéro de téléphone Starry
  phone: String, // Numéro de téléphone
  phones: [String], // Liste de numéros de téléphone
  location: String, // Lieu
  title: String, // Titre
  companyName: String, // Nom de l'entreprise
  fetchedAt: Date, // Date de récupération
  processingTime: Number, // Temps de traitement
});

// Schéma principal pour Kaspr, qui contient des profils
const kasprSchema = new mongoose.Schema({
  profiles: [profileSchema], // Liste de profils
});

// Création du modèle Kaspr basé sur le schéma kasprSchema
const Kaspr = mongoose.model('Kaspr', kasprSchema);

// Export du modèle Kaspr
module.exports = Kaspr;
