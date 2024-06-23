const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    username: {
        type: String
    },
    userId: {
        type: String
    },
    comment: {
        type: String,
        required: true
    },
    commentedFor : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Comment = mongoose.model('Comment', commentSchema); 
module.exports = Comment; 
