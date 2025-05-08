const mongoose = require('mongoose');
const User = require('./User'); // Importing the User model to update provider ratings

// Defining the schema for reviews
const reviewSchema = new mongoose.Schema({
  // The service being reviewed
  service: {
    type: mongoose.Schema.ObjectId, // Reference to the Service model
    ref: 'Service', // Establishes a relationship with the Service model
    required: [true, 'Review must belong to a service'], // Validation to ensure this field is provided
  },
  // The provider being reviewed
  provider: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', // Establishes a relationship with the User model
    required: [true, 'Review must be for a provider'], // Validation to ensure this field is provided
  },
  // The user who wrote the review
  user: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', // Establishes a relationship with the User model
    required: [true, 'Review must belong to a user'], // Validation to ensure this field is provided
  },
  // The rating given in the review
  rating: {
    type: Number, // The rating value
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
    required: [true, 'Review must have a rating'], // Validation to ensure this field is provided
  },
  // The comment provided in the review
  comment: {
    type: String, // The comment content
    trim: true, // Removes extra whitespace from the beginning and end of the string
  },
  // The date and time when the review was created
  createdAt: {
    type: Date, // The creation date
    default: Date.now(), // Default value is the current date and time
  },
});

// Prevent duplicate reviews from the same user for the same service
reviewSchema.index({ service: 1, user: 1 }, { unique: true });

/**
 * Static method to calculate average ratings for a provider.
 * Updates the provider's `ratingQuantity` and `ratingAverage` fields.
 * @param {ObjectId} providerId - The ID of the provider.
 */
reviewSchema.statics.calcAverageRatings = async function (providerId) {
  const stats = await this.aggregate([
    {
      $match: { provider: providerId }, // Match reviews for the given provider
    },
    {
      $group: {
        _id: '$provider', // Group by provider
        nRating: { $sum: 1 }, // Count the number of ratings
        avgRating: { $avg: '$rating' }, // Calculate the average rating
      },
    },
  ]);

  if (stats.length > 0) {
    // Update the provider's rating stats if reviews exist
    await User.findByIdAndUpdate(providerId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    // Reset the provider's rating stats if no reviews exist
    await User.findByIdAndUpdate(providerId, {
      ratingQuantity: 0,
      ratingAverage: 4.5, // Default average rating
    });
  }
};

/**
 * Post-save middleware to update provider ratings after saving a review.
 */
reviewSchema.post('save', function () {
  // Call the static method to calculate average ratings
  this.constructor.calcAverageRatings(this.provider);
});

/**
 * Post-remove middleware to update provider ratings after deleting a review.
 */
reviewSchema.post('remove', function () {
  // Call the static method to recalculate average ratings
  this.constructor.calcAverageRatings(this.provider);
});

// Creating the Review model from the schema
const Review = mongoose.model('Review', reviewSchema);

// Exporting the Review model for use in other parts of the application
module.exports = Review;