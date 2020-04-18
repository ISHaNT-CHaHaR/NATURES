const { promisify } = require('util');

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
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
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

exports.protect = catchAsync(async (req, res, next) => {
  ///1.) Getting the token and check if it exists.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in, please login to get access', 401)
    );
  }
  // 2.) verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exists.

  const currentUser = await User.findById(decoded.id); /// it is just to make sure that if user kust delete account at mean time.
  if (!currentUser) {
    return next(new AppError('The User does no longer exist', 401));
  }

  // 4) check if user change password after the jwt was issued.

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('USer recently changed password!, Please login again', 401)
    );
  }
  ///// GRant access tom protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //  roles is an array['admin','lead-guide];

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  /// 1)Get user besed on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    // saving all these user chamges here without validations
    validateBeforeSave: false //  this is special feature.
  });
  // 3) Send it back as an email.
});
exports.resetPassword = (req, res, next) => {};
