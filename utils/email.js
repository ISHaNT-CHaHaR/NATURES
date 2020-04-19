const nodemailer = require('nodemailer');

const sendEmail = options => {
  //1) create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
    // Activate "less secure app"  option
  });
  //2) define the email options

  //3) Send the email
};
