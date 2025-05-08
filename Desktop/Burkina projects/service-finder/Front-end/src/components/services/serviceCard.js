// Import React for building the component
import React from 'react';

// Import Link from react-router-dom for navigation
import { Link } from 'react-router-dom';

// Import icons from react-icons for visual elements
import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

// Define the ServiceCard component, which takes a `service` object as a prop
const ServiceCard = ({ service }) => {
  /**
   * Function to render rating stars based on the service's average rating.
   * @param {number} rating - The average rating of the service.
   * @returns {JSX.Element[]} - An array of star icons (full, half, or empty).
   */
  const renderRatingStars = (rating) => {
    const stars = []; // Array to hold the star icons
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there is a half star

    // Loop to generate 5 stars (full, half, or empty)
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Add a full star if the index is less than or equal to the number of full stars
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Add a half star if the index matches the half star position
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        // Add an empty star for the remaining positions
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars; // Return the array of star icons
  };

  return (
    // Main container for the service card with styling for hover effects
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
      <div className="p-6">
        {/* Header section with service category icon and title */}
        <div className="flex items-start">
          {/* Icon representing the service category */}
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3 text-white">
            {service.category === 'plumbing' && <FaStar size={24} />}
            {service.category === 'electrical' && <FaStar size={24} />}
            {service.category === 'painting' && <FaStar size={24} />}
            {service.category === 'medical' && <FaStar size={24} />}
            {service.category === 'transport' && <FaStar size={24} />}
            {service.category === 'security' && <FaStar size={24} />}
          </div>

          {/* Service title and rating */}
          <div className="ml-4">
            {/* Service name with a link to its details page */}
            <h3 className="text-lg font-semibold text-gray-900">
              <Link to={`/services/${service._id}`} className="hover:text-blue-600">
                {service.name}
              </Link>
            </h3>

            {/* Rating stars and review count */}
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderRatingStars(service.averageRating || 0)} {/* Render stars based on rating */}
              </div>
              <span className="text-gray-500 text-sm ml-1">
                ({service.reviews?.length || 0} reviews) {/* Display the number of reviews */}
              </span>
            </div>

            {/* Verified badge if the service provider is verified */}
            {service.provider?.isVerified && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                <FaCheckCircle className="mr-1" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Service description */}
        <div className="mt-4">
          <p className="text-gray-600 line-clamp-2">{service.description}</p>
        </div>

        {/* Service provider's location */}
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <FaMapMarkerAlt className="mr-1" />
          <span>{service.provider?.location?.address || 'Burkina Faso'}</span>
        </div>

        {/* Service availability status */}
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <FaClock className="mr-1" />
          <span>
            {service.availability === 'available'
              ? 'Available now'
              : service.availability === 'limited'
              ? 'Limited availability'
              : 'Currently unavailable'}
          </span>
        </div>

        {/* Pricing and details link */}
        <div className="mt-5 flex justify-between items-center">
          {/* Display hourly or fixed rate, or a fallback message */}
          <span className="text-lg font-semibold">
            {service.hourlyRate
              ? `${service.hourlyRate} XOF/hour`
              : service.fixedRate
              ? `${service.fixedRate} XOF fixed`
              : 'Contact for price'}
          </span>

          {/* Link to the service details page */}
          <Link
            to={`/services/${service._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// Export the ServiceCard component for use in other parts of the application
export default ServiceCard;