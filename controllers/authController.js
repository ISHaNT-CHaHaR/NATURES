const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const AppError = require('./../utils/appError');

const catchAsync = require('./../utils/catchAsync');

const signToken = id => {
  /// function fro generating web token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    /// Here i initiated a JSON web token
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  }); ///can also used user.save or for updating too .save can be used.

  const token = signToken(newUser._id); // generating token

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  //2) check if the user exists and password is correct

  const user = await User.findOne({ email }).select('+password'); // this is done because i select: false in schema for password.

  //3) if everything is ok, send Token to client

  if (!user || !(await user.correctPassword(password, user.password))) {
    /// this will be wither true or false
    // return from the correct password function in models.
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',

    token
  });
});
