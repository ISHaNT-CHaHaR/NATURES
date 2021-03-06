const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
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

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); /// generated a token here

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // encrypted the generated token

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

 
  return resetToken;
};

const User = mongoose.model('Users', userSchema);

module.exports = User;
