const express = require('express');
const router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../Models/userSchema');
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const secret = process.env.SECRET
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    }
    catch (error) {
        res.json({error: 'An error has been caught - get'})
    }
})

router.post('/signUp', async(req, res)=>{
  const {username, email, password} = req.body;
  try{
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = await User.create({username,
      email,
      password: bcrypt.hashSync(password, salt)
      })
    res.json(newUser);
  }
  catch(error) {
    res.status(400).json(error)
  }
})

router.post('/signIn', async(req, res) => {
  const { username, password } = req.body;
  const checkUser = await User.findOne({ username });
  
  if (!checkUser) {
    return res.status(400).json('User not found');
  }

  const passOk = bcrypt.compareSync(password, checkUser.password);
  
  if (passOk) {
    jwt.sign({ username, id: checkUser._id }, secret, {}, (err, token) => {
      if (err) {
        console.error('Error generating token:', err);
        return res.status(500).json('Internal server error');
      }
        res.cookie('token', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
        res.cookie('username', username, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
        res.json('ok');
    });
  } else {
    res.status(400).json('Wrong credentials');
  }
});


router.get('/profile', (req, res) => {
  if(!req.cookies.token){
    return res.json("Please Login")
  }
  const {token} = req.cookies;
  jwt.verify(token, secret, (err,info)=> {
      if(err){
        console.log(err)
      }
    res.json(info)
    console.log(info)
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('token',{expires:new Date(0), httpOnly: true});
  res.clearCookie('username', {expires:new Date(0), httpOnly: true});

  res.json({ message: 'Logout successful' });
}); 


module.exports = router;