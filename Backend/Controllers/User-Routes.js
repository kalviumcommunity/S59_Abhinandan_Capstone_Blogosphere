const express = require('express');
const router = express.Router();
require('dotenv').config()
const User = require('../Models/userSchema');
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    }
    catch (error) {
        res.json({error: 'An error has been caught - get'})
    }
})
router.post('/signUp', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } 
  catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;