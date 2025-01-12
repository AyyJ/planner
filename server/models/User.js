const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    artistPreferences: {
        type: Map,
        of: String,  // stores InterestLevel as string
        default: {}
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);