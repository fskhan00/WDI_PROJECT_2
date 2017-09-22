const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  releaseDate: { type: String },
  synopsis: { type: String },
  genre: { type: String },
  wikipedia: { type: String },
  images: [{ type: String }]
});

module.exports = mongoose.model('Film', filmSchema);
