// models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: String,
    genre: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        enum: ['coachella', 'outdoor', 'sahara', 'mojave', 'gobi', 'yuma', 'sonora', 'quasar'],
        required: true
    }
});

module.exports = mongoose.model('Artist', artistSchema);