const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
const userJoiSchema = require('../Models/Joi Schema/JoiUserSchema');
const dotenv = require('dotenv');
dotenv.config(); 
const saltRounds = 10;
const secret = process.env.SECRET;
const otpStore = {}; // Temporary OTP storage using in-memory object

// transporter for the nodemailer
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];


  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ message: "Unauthorized" });
  }
}

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST user signup route
router.post('/signUp', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const validationResult = userJoiSchema.validate({ username, email, password });
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const otp = generateOTP();
    otpStore[email] = otp;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP for registration is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      } else {
        console.log('OTP email sent:', info.response);
        res.status(200).json({ message: 'OTP sent to your email' });
      }
    });

  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST verify OTP route for user registration
router.post('/verifyOTP', async (req, res) => {
  const { username, email, password, otp } = req.body;
  try {
    if (otpStore[email] === otp) {
      delete otpStore[email];

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      res.status(200).json({ message: 'User registered successfully' });
    } 
    else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } 
  catch (error) {
    console.error('Error verifying OTP and registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST user sign-in route
router.post('/signIn', async (req, res) => {
  const { username, password } = req.body;
  try {

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, secret);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ token, username });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST Google sign-in route
router.post('/Google', async (req, res) => {
  const { username, email, photo } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);
      user = new User({ username, email, password: hashedPassword, profilePicture: photo });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, secret);
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ token, username, user });
  } catch (error) {
    console.error('Error with Google sign-in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', authenticateUser, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  res.json({ message: 'Logout successful' });
});

module.exports = router;
