// Importing required modules and utilities
const crypto = require('crypto'); // For generating secure tokens
const { promisify } = require('util'); // To convert callback-based functions to promises
const jwt = require('jsonwebtoken'); // For generating and verifying JSON Web Tokens (JWT)
const User = require('../models/User'); // User model
const catchAsync = require('../utils/catchAsync'); // Utility to handle async errors
const AppError = require('../utils/appError'); // Custom error handling class
const Email = require('../utils/email'); // Utility for sending emails

/**
 * Generates a JWT token for a given user ID.
 * @param {string} id - The user ID.
 * @returns {string} - The signed JWT token.
 */
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time
  });
};

/**
 * Sends a JWT token to the client via cookies and JSON response.
 * @param {Object} user - The user object.
 * @param {number} statusCode - The HTTP status code.
 * @param {Object} res - The response object.
 */
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id); // Generate JWT token

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Cookie expiration time
    ),
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  };

  // Secure cookies in production
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send the token as a cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  // Send the response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

/**
 * Handles user signup.
 * Creates a new user, generates a verification token, and sends a welcome email.
 */
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    location: req.body.location,
    city: req.body.city,
    region: req.body.region,
  });

  // Generate a verification token
  const verificationToken = newUser.createVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // Send a verification email
  try {
    const verificationURL = `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${verificationToken}`;
    await new Email(newUser, verificationURL).sendWelcome();

    createSendToken(newUser, 201, res); // Send token to the client
  } catch (err) {
    // Reset verification token fields if email sending fails
    newUser.verificationToken = undefined;
    newUser.verificationTokenExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the verification email. Try again later!',
        500
      )
    );
  }
});

/**
 * Handles user login.
 * Verifies user credentials and sends a JWT token to the client.
 */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) Check if the user is verified
  if (!user.isVerified) {
    return next(
      new AppError(
        'Your account is not verified. Please check your email for the verification link.',
        401
      )
    );
  }

  // 4) If everything is okay, send the token to the client
  createSendToken(user, 200, res);
});

/**
 * Middleware to protect routes.
 * Ensures that only authenticated users can access protected routes.
 */
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token from the request headers or cookies
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if the user changed their password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // Grant access to the protected route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

/**
 * Middleware to restrict access to specific roles.
 * @param {...string} roles - The roles allowed to access the route.
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Handles forgot password requests.
 * Sends a password reset token to the user's email.
 */
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on the provided email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // 2) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the reset token to the user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!', 500)
    );
  }
});

/**
 * Handles password reset requests.
 * Updates the user's password if the reset token is valid.
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If the token is valid, update the password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Log the user in and send a new token
  createSendToken(user, 200, res);
});

/**
 * Handles password updates for logged-in users.
 * Verifies the current password and updates it with the new password.
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from the collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if the current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log the user in and send a new token
  createSendToken(user, 200, res);
});