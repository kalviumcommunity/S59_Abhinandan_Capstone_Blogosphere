const mongoose = require('mongoose');

const TrialSchema = new mongoose.Schema({
    name: {
        type:String
    }
})

const Trial = mongoose.model('Trial', TrialSchema)

module.exports = Trial 