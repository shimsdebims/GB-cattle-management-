const express = require('express');
const reviewController = require('../controllers/reviewController'); // Controller for handling review-related logic
const authController = require('../controllers/authController'); // Controller for handling authentication and authorization

// Create a new router instance with `mergeParams` to access route parameters from parent routes
const router = express.Router({ mergeParams: true });

// Middleware to protect all routes (requires authentication)
router.use(authController.protect);

/**
 * Routes for handling reviews.
 * - GET: Retrieve all reviews.
 * - POST: Create a new review (restricted to authenticated users).
 */
router
  .route('/')
  .get(reviewController.getAllReviews) // Retrieve all reviews
  .post(
    authController.restrictTo('user'), // Only users can create reviews
    reviewController.setServiceUserIds, // Middleware to set `service` and `user` IDs in the request body
    reviewController.createReview // Controller to handle review creation
  );

/**
 * Routes for handling a specific review by ID.
 * - GET: Retrieve a single review by its ID.
 * - PATCH: Update a review (restricted to users and admins).
 * - DELETE: Delete a review (restricted to users and admins).
 */
router
  .route('/:id')
  .get(reviewController.getReview) // Retrieve a single review by its ID
  .patch(
    authController.restrictTo('user', 'admin'), // Only users and admins can update reviews
    reviewController.updateReview // Controller to handle review updates
  )
  .delete(
    authController.restrictTo('user', 'admin'), // Only users and admins can delete reviews
    reviewController.deleteReview // Controller to handle review deletion
  );

// Export the router for use in other parts of the application
module.exports = router;