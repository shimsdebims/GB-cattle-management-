const mongoose = require('mongoose');
const validator = require('validator');

// Defining the schema for users
const userSchema = new mongoose.Schema(
  {
    // The user's first name
    firstName: {
      type: String, // The first name must be a string
      required: [true, 'Please provide your first name'], // Validation to ensure this field is provided
      trim: true, // Removes extra whitespace from the beginning and end of the string
    },
    // The user's last name
    lastName: {
      type: String, // The last name must be a string
      required: [true, 'Please provide your last name'], // Validation to ensure this field is provided
      trim: true, // Removes extra whitespace from the beginning and end of the string
    },
    // The user's email address
    email: {
      type: String, // The email must be a string
      required: [true, 'Please provide your email'], // Validation to ensure this field is provided
      unique: true, // Ensures the email is unique
      lowercase: true, // Converts the email to lowercase
      validate: [validator.isEmail, 'Please provide a valid email'], // Validation to ensure the email is valid
    },
    // The user's phone number
    phone: {
      type: String, // The phone number must be a string
      required: [true, 'Please provide your phone number'], // Validation to ensure this field is provided
      validate: {
        validator: function (v) {
          return /^(\+226|0)[0-9]{8}$/.test(v); // Regex for Burkina Faso phone numbers
        },
        message: (props) => `${props.value} is not a valid Burkina Faso phone number!`, // Error message for invalid phone numbers
      },
    },
    // The user's password
    password: {
      type: String, // The password must be a string
      required: [true, 'Please provide a password'], // Validation to ensure this field is provided
      minlength: 8, // Minimum length of the password
      select: false, // Excludes the password from query results by default
    },
    // The user's password confirmation
    passwordConfirm: {
      type: String, // The password confirmation must be a string
      required: [true, 'Please confirm your password'], // Validation to ensure this field is provided
      validate: {
        validator: function (el) {
          return el === this.password; // Ensures the confirmation matches the password
        },
        message: 'Passwords are not the same!', // Error message for mismatched passwords
      },
    },
    // The user's role in the system
    role: {
      type: String, // The role must be a string
      enum: ['user', 'provider', 'admin'], // Restricts the value to one of the predefined roles
      default: 'user', // Default role is 'user'
    },
    // The user's profile photo
    profilePhoto: {
      type: String, // The profile photo must be a string (URL or filename)
      default: 'default.jpg', // Default profile photo
    },
    // The user's location (geospatial data)
    location: {
      type: {
        type: String, // The type of the location (e.g., Point)
        default: 'Point', // Default type is 'Point'
        enum: ['Point'], // Restricts the value to 'Point'
      },
      coordinates: [Number], // An array of numbers representing latitude and longitude
      address: String, // The address of the location
      city: {
        type: String, // The city must be a string
        required: [true, 'Please provide your city'], // Validation to ensure this field is provided
      },
      region: {
        type: String, // The region must be a string
        required: [true, 'Please provide your region'], // Validation to ensure this field is provided
      },
    },
    // Whether the user is verified
    isVerified: {
      type: Boolean, // The verification status must be a boolean
      default: false, // Default value is false
    },
    // Token for email verification
    verificationToken: String, // The verification token must be a string
    verificationTokenExpires: Date, // The expiration date of the verification token
    // Token for password reset
    passwordResetToken: String, // The password reset token must be a string
    passwordResetExpires: Date, // The expiration date of the password reset token
    // Whether the user is active
    active: {
      type: Boolean, // The active status must be a boolean
      default: true, // Default value is true
      select: false, // Excludes the active status from query results by default
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    toJSON: { virtuals: true }, // Includes virtual fields when converting to JSON
    toObject: { virtuals: true }, // Includes virtual fields when converting to objects
  }
);

// Index for geospatial queries
userSchema.index({ location: '2dsphere' }); // Enables geospatial queries on the `location` field

// Virtual populate for recommendations
userSchema.virtual('recommendations', {
  ref: 'Recommendation', // Reference to the Recommendation model
  foreignField: 'recommendedUser', // The field in the Recommendation model that references the User model
  localField: '_id', // The field in the User model that matches the foreignField
});

// Virtual populate for services
userSchema.virtual('services', {
  ref: 'Service', // Reference to the Service model
  foreignField: 'provider', // The field in the Service model that references the User model
  localField: '_id', // The field in the User model that matches the foreignField
});

// Virtual populate for reviews
userSchema.virtual('reviews', {
  ref: 'Review', // Reference to the Review model
  foreignField: 'provider', // The field in the Review model that references the User model
  localField: '_id', // The field in the User model that matches the foreignField
});

// Creating the User model from the schema
const User = mongoose.model('User', userSchema);

// Exporting the User model for use in other parts of the application
module.exports = User;