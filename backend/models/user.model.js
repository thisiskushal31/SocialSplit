const mongoose = require('mongoose');

/* define a schema for the users. */
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    unique: true,
    index: { unique: true},
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
    unique: true,
    index: { unique: true},
  }
}, {
  timestamps: true,
});


// first arg is the collection name.
const User = mongoose.model('User', userSchema);

module.exports = User;
