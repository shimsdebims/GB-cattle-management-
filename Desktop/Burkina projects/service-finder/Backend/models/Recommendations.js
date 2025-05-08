const mongoose = require('mongoose');

// Defining the schema for recommendations
const recommendationSchema = new mongoose.Schema({
  // The user who is making the recommendation
  recommender: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', // Establishes a relationship with the User model
    required: [true, 'A recommendation must have a recommender'], // Validation to ensure this field is provided
  },
  // The user who is being recommended
  recommendedUser: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User', // Establishes a relationship with the User model
    required: [true, 'A recommendation must have a recommended user'], // Validation to ensure this field is provided
  },
  // The service category for which the recommendation is being made
  serviceCategory: {
    type: String, // The category of the service
    required: [true, 'A recommendation must be for a specific service category'], // Validation to ensure this field is provided
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
  // An optional message provided by the recommender
  message: {
    type: String, // The message content
    trim: true, // Removes extra whitespace from the beginning and end of the string
  },
  // The status of the recommendation (e.g., pending, approved, rejected)
  status: {
    type: String, // The status of the recommendation
    enum: ['pending', 'approved', 'rejected'], // Restricts the value to one of the predefined statuses
    default: 'pending', // Default status is 'pending'
  },
  // The date and time when the recommendation was created
  createdAt: {
    type: Date, // The creation date
    default: Date.now(), // Default value is the current date and time
  },
});

// Creating the Recommendation model from the schema
const Recommendation = mongoose.model('Recommendation', recommendationSchema);

// Exporting the Recommendation model for use in other parts of the application
module.exports = Recommendation;