const nodemailer = require('nodemailer');
const pug = require('pug');

const sendEmail = async (options, req) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // sending the HTML for the email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${options.resetToken}`;

  const html = pug.renderFile(`${__dirname}/../views/emailPasswordReset.pug`, {
      firstName: this.firstName,
      url: resetURL,
      subject: "Forgot Password"      
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Avdhesh Gautam <hello@avdhesh.io>',
    to: options.email,
    subject: options.subject,  
    html,
    text: options.message
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
      console.log("error in the transporter",  err);
  }
};

module.exports = sendEmail;    

