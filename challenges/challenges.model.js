const mongoose = require('mongoose');

// https://mongoosejs.com/docs/subdocs.html

const fileSchema = mongoose.Schema({
    originalname: {
        required: true,
        type: String
    },
    encoding: {
        required: true,
        type: String
    },
    mimetype: {
        required: true,
        type: String
    },
    buffer: {
        required: true,
        type: Buffer
    },
    size: {
        required: true,
        type: Number
    }
})

const challengeSchema = mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    points: {
        required: true,
        type: Number
    },
    ressources: [fileSchema]
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;