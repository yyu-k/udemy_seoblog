require('dotenv').config();
const { sendEmailWithNodemailer } = require("../helpers/email");
 
exports.contactForm = (req, res) => {
  const { name, email, message } = req.body; 
  const emailData = {
    from: process.env.OUTLOOK_EMAIL,
    to: process.env.TEST_RECIPIENT,
    subject: "Website Contact Form",
    text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
    html: `
        <h4>Email received from contact form:</h4>
        <p>Sender name: ${name}</p>
        <p>Sender email: ${email}</p>
        <p>Sender message: ${message}</p>
        <hr />
        <p>This email is sent as part of a web dev tutorial - please ignore</p>
    `,
  };
 
  sendEmailWithNodemailer(req, res, emailData);
};