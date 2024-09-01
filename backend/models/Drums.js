// models/Drums.js
const mongoose = require('mongoose');

const drumsSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  }
});

const Drums = mongoose.model('Drums', drumsSchema);

module.exports = Drums;
