const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: String,
    genre: String,
    stage: {
        type: String,
        enum: ['coachella', 'outdoor', 'sahara', 'mojave', 'gobi', 'yuma', 'sonora']
    },
    schedule: {
        startTime: Date,
        endTime: Date,
        day: {
            type: String,
            enum: ['friday', 'saturday', 'sunday']
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Artist', artistSchema);