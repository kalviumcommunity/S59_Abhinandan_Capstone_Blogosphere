const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../Models/userSchema');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const messages = [
  "Something new is there, go and check it out!",
  "New content awaits you!",
  "Check out the latest updates!",
  "Discover what's new on our site!",
  "We've got fresh content for you!",
  "Don't miss out on new updates!",
  "See what's new today!",
  "Explore our latest posts!",
  "Find out what's new!",
  "New updates have arrived!",
];

const getRandomMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

const sendEmailToAllUsers = async () => {
  try {
    const users = await User.find();

    users.forEach(user => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Check out what\'s new!',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #0066cc; padding: 20px;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Hello ${user.username},</h1>
              </div>
              <div style="padding: 20px;">
                <p style="font-size: 18px; color: #333333; margin-bottom: 10px;">${getRandomMessage()}</p>
              </div>
              <div style="background-color: #f4f4f4; padding: 10px; text-align: center;  font-size: 14px; color: #999999;">
                <p style="margin: 0;">&copy; 2024 Blogosphere. Made by Abhinandan Gupta</p>
                <p style="margin: 0;">Thank you for being a part of our web app.</p>
              </div>
            </div>
          </div>
        `
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } 

        else {
          console.log('Email sent:', info.response);
        }

      });
    });
  } 

  catch (error) {
    console.error('Error fetching users or sending emails:', error);
  }
  
};

const scheduleEmails = () => {
  cron.schedule('0 0 */7 * *', () => {
    sendEmailToAllUsers();
  });
};

module.exports = scheduleEmails;
