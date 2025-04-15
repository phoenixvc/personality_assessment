const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  openness: {
    type: Number,
    required: true,
  },
  conscientiousness: {
    type: Number,
    required: true,
  },
  extraversion: {
    type: Number,
    required: true,
  },
  agreeableness: {
    type: Number,
    required: true,
  },
  neuroticism: {
    type: Number,
    required: true,
  },
  comments: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Assessment = mongoose.model('Assessment', assessmentSchema);

module.exports = Assessment;
