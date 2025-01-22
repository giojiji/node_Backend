import nodemailer from "nodemailer"
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
  user: "giojiji923test@gmail.com",
  pass: process.env.GMAILPASS
  }
});

export const sendRegistrationEmail = async (email: string, id: string) => {
    const emailBody = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="color: #007bff;">🎉 Registration Successful!</h1>
    <p>Start your journey with us! Finish your registration by verifying your email.</p>
    <p>
      <strong>Click the link below to verify your email:</strong><br>
      <a href="/verifyEmail/${id}" 
         style="color: white; background-color: #28a745; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block;">
         Verify Your Email
      </a>
    </p>
    <p>If you did not request this, please ignore this email.</p>
    <hr>
    <p style="font-size: 12px; color: #667;">This is an automated email, please do not reply.</p>
  </div>
`;
    
    const mailOptions = {
        from: 'node.js <gio-jiji-node@gmail.com>',
        to: email,
        subject: '🎉 Congratulations! Registration Successful',
        html: emailBody
        }
      transporter.sendMail(mailOptions, (err) => {
        if(err) {
          console.log(err)
        }
      })
}

export const sendresetEmail = async (password: string, email: string) => {
  const emailBody = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h1 style="color: #007bff;">New password is ready!</h1>
  <p>Your temporary password is <strong>"${password}"</strong>. Please sign in and update your password for security reasons.</p>
  <hr>
  <p style="font-size: 12px; color: #667;">This is an automated email, please do not reply.</p>
</div>
`;
  
  const mailOptions = {
      from: 'node.js <gio-jiji-node@gmail.com>',
      to: email,
      subject: 'Reset password',
      html: emailBody
      }
    transporter.sendMail(mailOptions, (err) => {
      if(err) {
        console.log(err)
      }
    })
}