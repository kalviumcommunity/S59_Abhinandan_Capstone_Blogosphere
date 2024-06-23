const express = require('express');
const router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken')
const Comment = require('../Models/commentSchema');

router.post('/addComment', async (req, res) => {
    try {
        const { username, userId, comment, commentedFor } = req.body;

        const newComment = new Comment({
            username,
            userId,
            comment,
            commentedFor
        });
        
        const savedComment = await newComment.save();
        res.status(201).json(savedComment)
    } 
    catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        } 
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
});

// Update a comment
router.put('/updateComment/:id', async (req, res) => {
    const commentId = req.params.id;
    const { comment } = req.body;
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment: comment },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json(updatedComment);
    } 
    catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        } 
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
});

router.delete('/deleteComment/:id', async (req, res) => {
    const commentId = req.params.id;
    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


router.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find(); 
        res.status(200).json(comments);
    } 
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});


module.exports = router