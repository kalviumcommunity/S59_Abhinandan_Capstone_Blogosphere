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
        username: {
            type: String
        },
        image: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });
    const Blog = mongoose.model('Blog', blogSchema); 
    module.exports = Blog; 
