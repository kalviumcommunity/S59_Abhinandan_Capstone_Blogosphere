    const mongoose = require('mongoose');
    const blogSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        selectedCategory: {
            type: String,
            enum: ['education', 'technology', 'travel', 'health'],
            required: true
        },
        content: {
            type: String
        },
        image: {
            type: String
        },
        username: {
            type: String
        },
        likedBy: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }   // relationship between entities
        ],
        likes: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });
    const Blog = mongoose.model('Blog', blogSchema); 
    module.exports = Blog; 
