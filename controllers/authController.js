const { promisify } = require('util');

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('./../utils/email');
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
  await user.save({ validateBeforeSave: false });
  // 3) Send it back as an email.
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your passoword? Submit a PATCH request with your new password and 
  passwordConfirm to: ${resetURL}.\nIf you did'nt, ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min.)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to Email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({
      // saving all these user changes here without validations
      validateBeforeSave: false //  this is special feature.
    });
    return next(
      new AppError('There was an error sending the email, Try again later! '),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  console.log(user);
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  // createSendToken(user, 200, res);
});
