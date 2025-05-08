// Importing required modules and utilities
const Review = require('../models/Review'); // Review model
const catchAsync = require('../utils/catchAsync'); // Utility to handle async errors
const factory = require('./handlerFactory'); // Factory functions for CRUD operations

/**
 * Middleware to set `service`, `user`, and `provider` IDs in the request body.
 * This is useful for nested routes where these IDs are passed as route parameters.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.setServiceUserIds = (req, res, next) => {
  // If the `service` field is not provided in the request body, set it from the route parameter
  if (!req.body.service) req.body.service = req.params.serviceId;

  // If the `user` field is not provided in the request body, set it to the currently authenticated user's ID
  if (!req.body.user) req.body.user = req.user.id;

  // If the `provider` field is not provided in the request body, set it from the route parameter
  if (!req.body.provider) req.body.provider = req.params.providerId;

  // Proceed to the next middleware
  next();
};

/**
 * Retrieves all reviews from the database.
 * Uses the factory function `getAll` to handle the logic.
 * @returns {Promise} - A promise that resolves with the list of reviews.
 */
exports.getAllReviews = factory.getAll(Review);

/**
 * Retrieves a single review by its ID.
 * Uses the factory function `getOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the review details.
 */
exports.getReview = factory.getOne(Review);

/**
 * Creates a new review in the database.
 * Uses the factory function `createOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the created review.
 */
exports.createReview = factory.createOne(Review);

/**
 * Updates an existing review in the database.
 * Uses the factory function `updateOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the updated review.
 */
exports.updateReview = factory.updateOne(Review);

/**
 * Deletes a review from the database.
 * Uses the factory function `deleteOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the deletion result.
 */
exports.deleteReview = factory.deleteOne(Review);