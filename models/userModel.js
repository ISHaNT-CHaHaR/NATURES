const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

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
    minlength: 8,
    select: false // it will never show up to client
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function(el) {
        /// This stuff will only work on .create or  SAVE!!!!!!!!
        return el === this.password; /// will return either true of false
      },
      message: 'Passwords are not the same!!'
    }
  }
});

userSchema.pre('save', async function(next) {
  // Only run this function if password is modified..
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // Hashed the password with cost of 12

  this.passwordConfirm = undefined; // removing passwordConfirm field.
  next();
});

userSchema.methods.correctPassword = async function(
  /// its a schema method for comparing password while logging.
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); // inbuild function
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
