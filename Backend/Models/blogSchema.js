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
            enum: ['education', 'technology', 'travel', 'health', 'parenting', 'finance', 'photography', 'business/entrepreneurship', 'music', 'food', 'sports', 'lifestyle', 'history'],
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
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
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
