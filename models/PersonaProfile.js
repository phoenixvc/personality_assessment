const mongoose = require('mongoose');

const personaProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  traits: [
    {
      label: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['low', 'moderate', 'high'],
        required: true,
      },
    },
  ],
  experienceSuggestions: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PersonaProfile = mongoose.model('PersonaProfile', personaProfileSchema);

module.exports = PersonaProfile;
