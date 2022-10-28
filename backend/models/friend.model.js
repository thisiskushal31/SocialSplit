const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const friendSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true,
    index: { unique: true },
  },
  friends: {
    type: [String],
    default: [],
  },
  requests: {
    type: [String],
    default: [],
  },
  adds: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
