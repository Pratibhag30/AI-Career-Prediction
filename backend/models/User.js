const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  skills: [String],
  interests: [String],
  aptitude: String,
  response: Object,
}, { timestamps: true });

module.exports = mongoose.model('User ', userSchema);
