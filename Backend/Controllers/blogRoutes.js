const express = require('express');
const router = express.Router();
require('dotenv').config()
const Blog = require('../Models/blogSchema');
const jwt = require('jsonwebtoken')
const multer = require('multer')
router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.status(200).json({ blogs });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/createPost', async (req, res) => {

    const {token} = req.cookies

    const decoded = jwt.decode(token)
    const username = decoded.username


    try {
      const { title, description, selectedCategory, content } = req.body;
  
      if (!title || !description || !selectedCategory || !content) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const newBlog = new Blog({
        title,
        description,
        selectedCategory,
        content,
        username,
        createdAt: new Date() 
      });
      const savedBlog = await newBlog.save();
  
      res.status(201).json({ message: 'Blog post created successfully', blog: savedBlog });
    } 
    catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router