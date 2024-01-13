const nodemailer = require('nodemailer')
const OTPModel = require('../model/OTPModel')
const bcrypt = require('bcrypt')

let transporter = nodemailer.createTransport({
  service:'gmail' ,
  host: 'smtp.gmail.com',
    port: 587,
    secure: true, 
  auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass: process.env.NODE_MAILER_PASS,
  } 
});


let mailSender = async (email,id,htmlContent) => {
  try {
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const mailOptions = {
          from: process.env.NODE_MAILER_EMAIL,
          to: email,
          subject: "OTP VERIFICATION",
          html: `${htmlContent}

          <h1>${otp}<h1>`,
      };
      // Send the email
      const hashedOTP = await bcrypt.hash(otp,10);
      await transporter.sendMail(mailOptions);
      const newOtp = new OTPModel({
          user_id:id,
          email: email,
          otp: hashedOTP,
      });
      await newOtp.save();
      console.log("Email sent successfully");
  } catch (error) {
      console.error("Error sending dsfdfs email:", error);
    }
};


module.exports ={
   mailSender
};