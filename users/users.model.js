const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: {
        type: String,
        unique: true,        // username must be unique
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;