// models/Vinyl.js

const mongoose = require('mongoose');

const vinylSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  }
});

const Vinyl = mongoose.model('Vinyl', vinylSchema);

module.exports = Vinyl;
