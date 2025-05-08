const mongoose = require('mongoose');

// Defining the schema for services
const serviceSchema = new mongoose.Schema(
  {
    // The name of the service
    name: {
      type: String, // The name must be a string
      required: [true, 'A service must have a name'], // Validation to ensure this field is provided
      trim: true, // Removes extra whitespace from the beginning and end of the string
    },
    // A description of the service
    description: {
      type: String, // The description must be a string
      required: [true, 'A service must have a description'], // Validation to ensure this field is provided
      trim: true, // Removes extra whitespace from the beginning and end of the string
    },
    // The category of the service
    category: {
      type: String, // The category must be a string
      required: [true, 'A service must belong to a category'], // Validation to ensure this field is provided
      enum: [
        'plumbing', // Plumbing services
        'electrical', // Electrical services
        'painting', // Painting services
        'carpentry', // Carpentry services
        'cleaning', // Cleaning services
        'medical', // Medical services
        'transport', // Transport services
        'security', // Security services
        'construction', // Construction services
        'other', // Other services
      ], // Restricts the value to one of the predefined categories
    },
    // The provider offering the service
    provider: {
      type: mongoose.Schema.ObjectId, // Reference to the User model
      ref: 'User', // Establishes a relationship with the User model
      required: [true, 'A service must belong to a provider'], // Validation to ensure this field is provided
    },
    // The hourly rate for the service
    hourlyRate: {
      type: Number, // The hourly rate must be a number
    },
    // The fixed rate for the service
    fixedRate: {
      type: Number, // The fixed rate must be a number
    },
    // The availability status of the service
    availability: {
      type: String, // The availability must be a string
      enum: ['available', 'unavailable', 'limited'], // Restricts the value to one of the predefined statuses
      default: 'available', // Default status is 'available'
    },
    // The number of years of experience the provider has
    experienceYears: {
      type: Number, // The experience must be a number
      min: 0, // Minimum value is 0
    },
    // The skills associated with the service
    skills: [String], // An array of strings representing skills
    // Portfolio images for the service
    portfolioImages: [String], // An array of strings representing image URLs
    // Whether the service is verified
    isVerified: {
      type: Boolean, // The verification status must be a boolean
      default: false, // Default value is false
    },
    // The date when the service was verified
    verificationDate: {
      type: Date, // The verification date must be a date
    },
    // The date when the service was created
    createdAt: {
      type: Date, // The creation date must be a date
      default: Date.now(), // Default value is the current date and time
    },
  },
  {
    toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
    toObject: { virtuals: true }, // Include virtual fields when converting to objects
  }
);

// Virtual populate for reviews
serviceSchema.virtual('reviews', {
  ref: 'Review', // Reference to the Review model
  foreignField: 'service', // The field in the Review model that references the Service model
  localField: '_id', // The field in the Service model that matches the foreignField
});

// Virtual field to calculate the average rating for the service
serviceSchema.virtual('averageRating').get(function () {
  if (this.reviews && this.reviews.length > 0) {
    // Calculate the sum of all ratings
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    // Return the average rating
    return sum / this.reviews.length;
  }
  // Return 0 if there are no reviews
  return 0;
});

// Creating the Service model from the schema
const Service = mongoose.model('Service', serviceSchema);

// Exporting the Service model for use in other parts of the application
module.exports = Service;