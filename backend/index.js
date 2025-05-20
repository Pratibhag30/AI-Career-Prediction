
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const careerRoutes = require('./careerRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use(bodyParser.json());
app.use(express.static('frontend'));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/careerAI')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', careerRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
