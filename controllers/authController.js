const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');

const AppError = require('./../utils/appError');

const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  }); ///can also used user.save or for updating too .save can be used.

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    /// Here i initiated a JSON web token
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  //2) check if the user exists and password is correct
  const user = User.findOne({ email: email });

  //3) if everything is ok, send Token to client
  const token = '';
  res.status(200).json({
    status: 'success',
    token
  });
};
