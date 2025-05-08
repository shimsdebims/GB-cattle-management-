// Importing React and necessary libraries
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Icons for star ratings
import { format } from 'date-fns'; // Utility for formatting dates
import { fr } from 'date-fns/locale'; // French locale for date formatting

/**
 * Component to display a single review item.
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.review - The review object containing user, rating, comment, and createdAt.
 * @returns {JSX.Element} - A JSX element representing the review item.
 */
const ReviewItem = ({ review }) => {
  /**
   * Renders the star rating based on the review's rating value.
   * @param {number} rating - The rating value (e.g., 4.5).
   * @returns {JSX.Element[]} - An array of JSX elements representing the stars.
   */
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating); // Number of full stars
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

    // Loop to generate star icons
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Add full star
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Add half star
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        // Add empty star
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
      {/* User information and rating */}
      <div className="flex items-center mb-4">
        {/* User profile photo */}
        <img 
          src={review.user?.profilePhoto || '/images/default-user.png'} // Default photo if none exists
          alt={review.user?.firstName} // Alt text for accessibility
          className="w-12 h-12 rounded-full mr-4 object-cover" // Styling for the profile photo
        />
        <div>
          {/* User's name */}
          <h4 className="text-lg font-medium text-gray-900">
            {review.user?.firstName} {review.user?.lastName}
          </h4>
          {/* Rating stars and review date */}
          <div className="flex items-center">
            <div className="flex mr-2">
              {renderRatingStars(review.rating)} {/* Render star rating */}
            </div>
            <span className="text-sm text-gray-500">
              {format(new Date(review.createdAt), 'PPP', { locale: fr })} {/* Format review date */}
            </span>
          </div>
        </div>
      </div>
      {/* Review comment */}
      <p className="text-gray-600">{review.comment}</p>
    </div>
  );
};

export default ReviewItem;