const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,  
      }
    });

    const mailOptions = {
      from: `"Devine" <${process.env.EMAIL_USER}>`,
      to: to,            
      subject: subject,  
      html: html,  
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendEmail;