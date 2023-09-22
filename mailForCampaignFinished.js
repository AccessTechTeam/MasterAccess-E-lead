const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: 'Outlook',
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS_MAIL
  }
});


async function mailForCampagneFinished(mail , username , nameListProspect) {
    const mailOptions = {
        from: 'contactpro@access-energies.com',
        to: `${mail}`,
        subject: 'Campagne Terminée',
        text: `bonjour ${username}, 
    Votre campagne ${nameListProspect} viens d'etre terminée avec succes !`
    };
    
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log('E-mail envoyé avec succès: ' + info.response);
            mailCounter++;
            resolve(true);
            
        }
        });
    });






}


module.exports = mailForCampagneFinished