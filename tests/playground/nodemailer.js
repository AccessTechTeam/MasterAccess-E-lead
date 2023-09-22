const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Fonction pour envoyer un e-mail
async function sendEmail(to, subject, htmlContent) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const message = {
      from: process.env.MAIL_SENDER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const info = await transport.sendMail(message);
    console.log('Mail sent successfully', info);
  } catch (error) {
    console.error('Failed to send mail', error);
  }
}

// Lire le contenu HTML du fichier
fs.readFile(path.join(__dirname, 'views/template_SMTP/temp1.html'), 'utf8', (err, html) => {
  if (err) {
    console.error('Failed to read file', err);
    return;
  }

  // Appel de la fonction sendEmail
  sendEmail('rayanilyes75@gmail.com', 'Test', html);
});
