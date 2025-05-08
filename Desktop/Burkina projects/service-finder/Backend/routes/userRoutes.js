const express = require('express');
const userController = require('../controllers/userController'); // Controller for handling user-related logic
const authController = require('../controllers/authController'); // Controller for handling authentication and authorization

const router = express.Router();

/**
 * Public routes for authentication and password management.
 * - POST `/signup`: Register a new user.
 * - POST `/login`: Log in an existing user.
 * - GET `/logout`: Log out the current user.
 * - POST `/forgotPassword`: Request a password reset token.
 * - PATCH `/resetPassword/:token`: Reset the password using a valid token.
 */
router.post('/signup', authController.signup); // User signup
router.post('/login', authController.login); // User login
router.get('/logout', authController.logout); // User logout
router.post('/forgotPassword', authController.forgotPassword); // Request password reset
router.patch('/resetPassword/:token', authController.resetPassword); // Reset password

/**
 * Middleware to protect all routes after this point.
 * Ensures that only authenticated users can access the following routes.
 */
router.use(authController.protect);

/**
 * Routes for managing the authenticated user's account.
 * - PATCH `/updateMyPassword`: Update the user's password.
 * - GET `/me`: Retrieve the authenticated user's details.
 * - PATCH `/updateMe`: Update the authenticated user's details.
 * - DELETE `/deleteMe`: Deactivate the authenticated user's account.
 */
router.patch('/updateMyPassword', authController.updatePassword); // Update password
router.get('/me', userController.getMe, userController.getUser); // Get user details
router.patch('/updateMe', userController.updateMe); // Update user details
router.delete('/deleteMe', userController.deleteMe); // Deactivate account

/**
 * Routes for handling recommendations.
 * - POST `/recommendations`: Create a recommendation for another user.
 * - GET `/recommendations`: Retrieve recommendations for the authenticated user.
 */
router.post('/recommendations', userController.createRecommendation); // Create recommendation
router.get('/recommendations', userController.getUserRecommendations); // Get recommendations

/**
 * Middleware to restrict access to admin-only routes.
 * Ensures that only users with the `admin` role can access the following routes.
 */
router.use(authController.restrictTo('admin'));

/**
 * Admin routes for managing users.
 * - GET `/`: Retrieve all users.
 * - POST `/`: Create a new user.
 * - GET `/:id`: Retrieve a user by their ID.
 * - PATCH `/:id`: Update a user's details by their ID.
 * - DELETE `/:id`: Delete a user by their ID.
 * - PATCH `/verify/:id`: Verify a user by their ID.
 */
router
  .route('/')
  .get(userController.getAllUsers) // Retrieve all users
  .post(userController.createUser); // Create a new user

router
  .route('/:id')
  .get(userController.getUser) // Retrieve a user by ID
  .patch(userController.updateUser) // Update a user by ID
  .delete(userController.deleteUser); // Delete a user by ID

router.patch('/verify/:id', userController.verifyUser); // Verify a user by ID

// Export the router for use in other parts of the application
module.exports = router;