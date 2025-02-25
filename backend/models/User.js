const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);