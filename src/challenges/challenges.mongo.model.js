const mongoose = require('mongoose');
const logger = require('../utils/logger');

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
});

const challengeSchema = mongoose.Schema({
  author: {
    required: true,
    type: Number
  },
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
  active: {
    default: false,
    type: Boolean
  },
  flag: {
    required: true,
    type: String
  },
  resources: {
    required: false,
    type: [fileSchema]
  }
});

challengeSchema.post('findOneAndUpdate', (doc) => {
  logger.info(`${doc._id} updated`);
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
