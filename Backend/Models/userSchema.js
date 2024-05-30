const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png"
    },
    likedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
});
const User = mongoose.model('User', userSchema); 
module.exports = User; 
