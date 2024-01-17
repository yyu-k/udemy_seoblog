require('dotenv').config();

const nodeMailer = require("nodemailer");
const { logger } = require('../backend_logger')
 
exports.sendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.OUTLOOK_EMAIL, 
      pass: process.env.OUTLOOK_APP_PASSWORD
    },
    tls: {
      ciphers: "SSLv3",
    },
  });
 
  return transporter
    .sendMail(emailData)
    .then((info) => {
      return res.json({
        success: true,
      });
    })
    .catch((err) => logger.error(`Problem sending email: ${err}`));
};
 