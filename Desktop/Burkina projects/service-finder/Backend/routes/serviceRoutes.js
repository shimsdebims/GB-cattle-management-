const express = require('express');
const serviceController = require('../controllers/serviceController'); // Controller for handling service-related logic
const authController = require('../controllers/authController'); // Controller for handling authentication and authorization
const reviewRouter = require('./reviewRoutes'); // Router for handling review-related routes

const router = express.Router();

/**
 * Nested routes for reviews.
 * Allows handling reviews for a specific service using the `/services/:serviceId/reviews` route.
 */
router.use('/:serviceId/reviews', reviewRouter);

/**
 * Geo routes for location-based queries.
 * - `/services-within/:distance/center/:latlng/unit/:unit`: Retrieves services within a specified distance from a given location.
 * - `/distances/:latlng/unit/:unit`: Calculates distances to all services from a given location.
 */
router.get(
  '/services-within/:distance/center/:latlng/unit/:unit',
  serviceController.getServicesWithin // Controller to handle services-within queries
);
router.get(
  '/distances/:latlng/unit/:unit',
  serviceController.getDistances // Controller to handle distance calculations
);

/**
 * Routes for handling all services.
 * - GET: Retrieve all services.
 * - POST: Create a new service (restricted to authenticated providers).
 */
router
  .route('/')
  .get(serviceController.getAllServices) // Retrieve all services
  .post(
    authController.protect, // Middleware to ensure the user is authenticated
    authController.restrictTo('provider'), // Only providers can create services
    serviceController.setProviderUserIds, // Middleware to set the provider ID in the request body
    serviceController.checkProviderVerification, // Middleware to ensure the provider is verified
    serviceController.createService // Controller to handle service creation
  );

/**
 * Routes for handling a specific service by ID.
 * - GET: Retrieve a single service by its ID.
 * - PATCH: Update a service (restricted to providers and admins).
 * - DELETE: Delete a service (restricted to providers and admins).
 */
router
  .route('/:id')
  .get(serviceController.getService) // Retrieve a single service by its ID
  .patch(
    authController.protect, // Middleware to ensure the user is authenticated
    authController.restrictTo('provider', 'admin'), // Only providers and admins can update services
    serviceController.updateService // Controller to handle service updates
  )
  .delete(
    authController.protect, // Middleware to ensure the user is authenticated
    authController.restrictTo('provider', 'admin'), // Only providers and admins can delete services
    serviceController.deleteService // Controller to handle service deletion
  );

// Export the router for use in other parts of the application
module.exports = router;