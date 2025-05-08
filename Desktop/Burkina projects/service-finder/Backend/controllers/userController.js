// Importing required modules and utilities
const User = require('../models/User'); // User model
const Recommendation = require('../models/Recommendation'); // Recommendation model
const catchAsync = require('../utils/catchAsync'); // Utility to handle async errors
const AppError = require('../utils/appError'); // Custom error handling class
const factory = require('./handlerFactory'); // Factory functions for CRUD operations

/**
 * Filters an object to only include allowed fields.
 * @param {Object} obj - The object to filter.
 * @param {...string} allowedFields - The fields to allow.
 * @returns {Object} - The filtered object.
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * Middleware to set the `id` parameter to the currently authenticated user's ID.
 * This is useful for routes like `/me`.
 */
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 * Updates the currently authenticated user's details.
 * Prevents updating sensitive fields like passwords.
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filter out unwanted fields
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'email',
    'phone',
    'profilePhoto',
    'location',
    'city',
    'region'
  );

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // Return the updated document
    runValidators: true, // Validate the update
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

/**
 * Deactivates the currently authenticated user's account.
 * Marks the user as inactive instead of deleting the account.
 */
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Creates a recommendation for another user.
 * Ensures the recommender is not recommending themselves.
 */
exports.createRecommendation = catchAsync(async (req, res, next) => {
  const { recommendedUserId, serviceCategory, message } = req.body;

  // Check if the recommended user exists
  const recommendedUser = await User.findById(recommendedUserId);
  if (!recommendedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Check if the recommender is trying to recommend themselves
  if (req.user.id === recommendedUserId) {
    return next(new AppError('You cannot recommend yourself', 400));
  }

  // Create the recommendation
  const recommendation = await Recommendation.create({
    recommender: req.user.id,
    recommendedUser: recommendedUserId,
    serviceCategory,
    message,
  });

  res.status(201).json({
    status: 'success',
    data: {
      recommendation,
    },
  });
});

/**
 * Retrieves all recommendations for the currently authenticated user.
 * Populates the recommender's details in the response.
 */
exports.getUserRecommendations = catchAsync(async (req, res, next) => {
  const recommendations = await Recommendation.find({
    recommendedUser: req.user.id,
  }).populate('recommender', 'firstName lastName profilePhoto');

  res.status(200).json({
    status: 'success',
    results: recommendations.length,
    data: {
      recommendations,
    },
  });
});

/**
 * Verifies a user if they have at least 2 approved recommendations.
 * Updates the user's `isVerified` status and sets the verification date.
 */
exports.verifyUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Check if user has at least 2 approved recommendations
  const approvedRecommendations = await Recommendation.countDocuments({
    recommendedUser: user.id,
    status: 'approved',
  });

  if (approvedRecommendations < 2) {
    return next(
      new AppError(
        'User does not have enough recommendations to be verified',
        400
      )
    );
  }

  user.isVerified = true;
  user.verificationDate = Date.now();
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

/**
 * Retrieves all users from the database.
 * Uses the factory function `getAll` to handle the logic.
 */
exports.getAllUsers = factory.getAll(User);

/**
 * Retrieves a single user by their ID.
 * Uses the factory function `getOne` to handle the logic.
 */
exports.getUser = factory.getOne(User);

/**
 * Updates a user's details by their ID.
 * Uses the factory function `updateOne` to handle the logic.
 */
exports.updateUser = factory.updateOne(User);

/**
 * Deletes a user by their ID.
 * Uses the factory function `deleteOne` to handle the logic.
 */
exports.deleteUser = factory.deleteOne(User);