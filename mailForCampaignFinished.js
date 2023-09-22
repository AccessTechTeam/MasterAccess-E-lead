const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur de messagerie
const transporter = nodemailer.createTransport({
  service: 'Outlook', // Service de messagerie (ex. Gmail, Outlook, etc.)
  auth: {
    user: process.env.MAIL,      // Adresse e-mail de l'expéditeur
    pass: process.env.PASS_MAIL  // Mot de passe de l'expéditeur
  }
});

// Fonction pour envoyer un e-mail de confirmation de campagne terminée
async function mailForCampagneFinished(mail, username, nameListProspect) {
  // Options de l'e-mail
  const mailOptions = {
    from: 'contactpro@access-energies.com', // Adresse e-mail de l'expéditeur
    to: `${mail}`,                          // Adresse e-mail du destinataire
    subject: 'Campagne Terminée',            // Sujet de l'e-mail
    text: `Bonjour ${username},\nVotre campagne ${nameListProspect} vient d'être terminée avec succès !` // Corps de l'e-mail
  };

  // Utilisation d'une promesse pour envoyer l'e-mail de manière asynchrone
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('E-mail envoyé avec succès: ' + info.response);
        resolve(true);
      }
    });
  });
}

module.exports = mailForCampagneFinished;
