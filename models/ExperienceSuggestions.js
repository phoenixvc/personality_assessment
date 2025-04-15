const mongoose = require('mongoose');

const experienceSuggestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExperienceSuggestion = mongoose.model('ExperienceSuggestion', experienceSuggestionSchema);

module.exports = ExperienceSuggestion;
