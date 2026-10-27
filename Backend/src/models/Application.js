
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Application", applicationSchema);

