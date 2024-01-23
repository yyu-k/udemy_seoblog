require('dotenv').config();

const nodeMailer = require("nodemailer");
const { logger } = require('../backend_logger')
 
exports.sendEmailWithNodemailer = (req, res, emailData, successMsg = '') => {
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
        message: successMsg
      });
    })
    .catch((err) => {
      logger.error(`Problem sending email: ${err}`);
      return res.status(400).json({
        success : false,
        error : `Something has gone wrong with sending the email, please alert the administrator of the website`
      })
    });
};
 