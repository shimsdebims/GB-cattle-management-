// Importing required modules and utilities
const Service = require('../models/Service'); // Service model
const User = require('../models/User'); // User model
const catchAsync = require('../utils/catchAsync'); // Utility to handle async errors
const AppError = require('../utils/appError'); // Custom error handling class
const factory = require('./handlerFactory'); // Factory functions for CRUD operations

/**
 * Middleware to set the `provider` field in the request body.
 * This is useful for nested routes where the provider ID is not explicitly provided.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.setProviderUserIds = (req, res, next) => {
  if (!req.body.provider) req.body.provider = req.user.id; // Set provider to the authenticated user's ID
  next();
};

/**
 * Middleware to check if the provider is verified before allowing service creation.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.checkProviderVerification = catchAsync(async (req, res, next) => {
  const provider = await User.findById(req.body.provider);

  if (!provider.isVerified) {
    return next(new AppError('Only verified providers can create services', 400));
  }

  next();
});

/**
 * Retrieves all services with advanced filtering, sorting, field limiting, and pagination.
 * @returns {Promise} - A promise that resolves with the list of services.
 */
exports.getAllServices = catchAsync(async (req, res, next) => {
  // 1) Filtering
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // 2) Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Service.find(JSON.parse(queryStr)).populate({
    path: 'provider',
    select: 'firstName lastName profilePhoto ratingAverage ratingQuantity isVerified',
  });

  // 3) Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 4) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  // 5) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // Execute query
  const services = await query;

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services,
    },
  });
});

/**
 * Retrieves services within a specified distance from a given location.
 * @param {Object} req - The request object containing distance, latlng, and unit parameters.
 * @returns {Promise} - A promise that resolves with the list of services.
 */
exports.getServicesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    return next(
      new AppError('Please provide latitude and longitude in the format lat,lng.', 400)
    );
  }

  const services = await Service.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  }).populate({
    path: 'provider',
    select: 'firstName lastName profilePhoto ratingAverage ratingQuantity isVerified location',
  });

  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services,
    },
  });
});

/**
 * Calculates distances to all services from a given location.
 * @param {Object} req - The request object containing latlng and unit parameters.
 * @returns {Promise} - A promise that resolves with the distances.
 */
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError('Please provide latitude and longitude in the format lat,lng.', 400)
    );
  }

  const distances = await Service.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      distances,
    },
  });
});

/**
 * Retrieves a single service by its ID, including its reviews.
 * Uses the factory function `getOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the service details.
 */
exports.getService = factory.getOne(Service, { path: 'reviews' });

/**
 * Creates a new service in the database.
 * Uses the factory function `createOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the created service.
 */
exports.createService = factory.createOne(Service);

/**
 * Updates an existing service in the database.
 * Uses the factory function `updateOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the updated service.
 */
exports.updateService = factory.updateOne(Service);

/**
 * Deletes a service from the database.
 * Uses the factory function `deleteOne` to handle the logic.
 * @returns {Promise} - A promise that resolves with the deletion result.
 */
exports.deleteService = factory.deleteOne(Service);