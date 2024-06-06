const express = require('express');
const router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../Models/userSchema');
const Blog = require('../Models/blogSchema');
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)
const secret = process.env.SECRET

const userJoiSchema = require('../Models/Joi Schema/JoiUserSchema')

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

    const newUser = await User.create({
      username,
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
    try {
      const checkUser = await User.findOne({ username });
      
      if (!checkUser) {
        return res.status(400).json(ErrorResponse('User not found'));
      }
      
      const passOk = bcrypt.compareSync(password, checkUser.password);
      
      if (passOk) {
        jwt.sign({ username, id: checkUser._id }, secret, {}, (err, token) => {
          if (err) {
            console.error('Error generating token:', err);
            return res.status(500).json(ErrorResponse('Internal server error'));
          }

          res.cookie('token', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
          res.cookie('username', username, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
          res.status(500).json('ok');
        });
      } 
      else {
        res.status(400).json(ErrorResponse('Wrong credentials'));
      }
    } 
    catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json(ErrorResponse('Internal server error'));
    }
  });

  router.post('/Google', async(req, res) => {
    const { username, email, photo } = req.body;
    try {

        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ username, id: user._id }, secret);
            const { password, ...rest } = user._doc;
            res.cookie('access_token', token, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
            res.cookie('username', username, { httpOnly: false, expires: new Date(Date.now() + 24 * 3600000) });
            res.status(200).json(rest);
        } 
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: username,
                email,
                password: hashedPassword,
                profilePicture: photo,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, secret);
            const { password, ...rest } = newUser._doc;
            res.cookie('access_token', token, { httpOnly: false });
            res.cookie('username', username, { httpOnly: false });
            res.status(200).json(rest);
        }
    } 
    catch (error) {
        res.status(400).json(error);
    }
});


router.get('/profile', async (req, res) => {
  try {
      if (!req.cookies.token && !req.cookies.access_token) {
          return res.json("Please Login");
      }

      let user;
      if (req.cookies.token) {
        const { token } = req.cookies;
        const decoded = jwt.verify(token, secret);
        user = await User.findById(decoded.id);
      } 
      else if (req.cookies.access_token) {
          const { access_token } = req.cookies;
          const decoded = jwt.verify(access_token, secret);
          user = await User.findById(decoded.id);
      }

      if (!user) {
          return res.json("User not found");
      }
      res.json(user);

  } catch (error) {
      res.status(400).json(error);
  }
});


router.get('/logout', (req, res) => {
  res.clearCookie('token',{expires:new Date(0), httpOnly: true});
  res.clearCookie('username', {expires:new Date(0), httpOnly: true});
  res.clearCookie('access_token', {expires:new Date(0), httpOnly: true});
  res.json({ message: 'Logout successful' });
}); 



const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token || req.cookies.access_token;

  if(!token) {
    return res.status(401).json({message : "Unauthorized"});
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    next();
  }
  catch(error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({message: "Unauthorized"});
  }
}


router.patch('/save/:postId', authenticateUser, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const [user, post] = await Promise.all([
      User.findById(userId),
      Blog.findById(postId)
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.json({ message: "Post saved successfully" });
  } catch (error) {
    console.error("Error saving the post: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch('/unsave/:postId', authenticateUser, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.savedPosts.includes(postId)) {
      return res.status(400).json({ message: 'Post not saved' });
    }

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
    await user.save();

    res.json({ message: 'Post unsaved successfully' });
  } 
  catch (error) {
    console.error("Error unsaving post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



module.exports = router;  