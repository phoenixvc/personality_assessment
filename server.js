const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Assessment = require('./models/Assessment');
const PersonaProfile = require('./models/PersonaProfile');
const ExperienceSuggestion = require('./models/ExperienceSuggestions');
const CosmosDB = require('./models/CosmosDB');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ocean', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'location'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/assessments', async (req, res) => {
  try {
    const assessment = new Assessment(req.body);
    await assessment.save();
    res.status(201).send(assessment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/assessments/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).send();
    }
    res.send(assessment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/api/assessments/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism', 'comments'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (assessment[update] = req.body[update]));
    await assessment.save();
    res.send(assessment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/assessments/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).send();
    }
    res.send(assessment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/persona-profiles', async (req, res) => {
  try {
    const personaProfile = new PersonaProfile(req.body);
    await personaProfile.save();
    res.status(201).send(personaProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/persona-profiles/:id', async (req, res) => {
  try {
    const personaProfile = await PersonaProfile.findById(req.params.id);
    if (!personaProfile) {
      return res.status(404).send();
    }
    res.send(personaProfile);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/api/persona-profiles/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['profileName', 'description', 'traits', 'experienceSuggestions'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const personaProfile = await PersonaProfile.findById(req.params.id);
    if (!personaProfile) {
      return res.status(404).send();
    }

    updates.forEach((update) => (personaProfile[update] = req.body[update]));
    await personaProfile.save();
    res.send(personaProfile);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/persona-profiles/:id', async (req, res) => {
  try {
    const personaProfile = await PersonaProfile.findByIdAndDelete(req.params.id);
    if (!personaProfile) {
      return res.status(404).send();
    }
    res.send(personaProfile);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/api/experience-suggestions', async (req, res) => {
  try {
    const experienceSuggestion = new ExperienceSuggestion(req.body);
    await experienceSuggestion.save();
    res.status(201).send(experienceSuggestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/experience-suggestions/:id', async (req, res) => {
  try {
    const experienceSuggestion = await ExperienceSuggestion.findById(req.params.id);
    if (!experienceSuggestion) {
      return res.status(404).send();
    }
    res.send(experienceSuggestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch('/api/experience-suggestions/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const experienceSuggestion = await ExperienceSuggestion.findById(req.params.id);
    if (!experienceSuggestion) {
      return res.status(404).send();
    }

    updates.forEach((update) => (experienceSuggestion[update] = req.body[update]));
    await experienceSuggestion.save();
    res.send(experienceSuggestion);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/api/experience-suggestions/:id', async (req, res) => {
  try {
    const experienceSuggestion = await ExperienceSuggestion.findByIdAndDelete(req.params.id);
    if (!experienceSuggestion) {
      return res.status(404).send();
    }
    res.send(experienceSuggestion);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
