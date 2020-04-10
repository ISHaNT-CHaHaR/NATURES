const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is necessary']
  },
  email: {
    type: String,
    required: [true, 'Email is necessary'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid Email']
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!']
  }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
