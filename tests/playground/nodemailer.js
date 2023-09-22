const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

let transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "40d71a86d57279",
    pass: "17ed615adf2409"
  }
});

fs.readFile(path.join(__dirname, 'views/template_SMTP/temp1.html'), 'utf8', (err, html) => {
  if(err){
    console.error('Failed to read file', err);
    return;
  }

  const message = {
    from: 'rayanilyes75@gmail.com',
    to: 'rayanilyes75@gmail.com',
    subject: 'test',
    html: html
  };

  transport.sendMail(message, (err, info) => {
    if(err){
      console.error('Failed to send mail', err);
      return;
    }
    console.log('Mail sent successfully', info);
  });

});