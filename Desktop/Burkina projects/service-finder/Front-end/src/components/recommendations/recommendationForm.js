// Import React and its hooks for managing state and side effects
import React, { useState, useEffect } from 'react';

// Import Redux hooks for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

// Import the action to create a recommendation
import { createRecommendation } from '../../actions/recommendationActions';

// Import icons for UI elements
import { FaUserCheck, FaTimes } from 'react-icons/fa';

// Import the action to search for users
import { searchUsers } from '../../actions/userActions';

// Define the RecommendationForm component
const RecommendationForm = () => {
  // State to track the search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');

  // State to store the user selected from the search results
  const [selectedUser, setSelectedUser] = useState(null);

  // State to track the selected service category
  const [serviceCategory, setServiceCategory] = useState('');

  // State to store the optional recommendation message
  const [message, setMessage] = useState('');

  // State to hold the list of users matching the search term
  const [searchResults, setSearchResults] = useState([]);

  // State to toggle the visibility of the search results dropdown
  const [showResults, setShowResults] = useState(false);

  // Initialize the dispatch function to send actions to the Redux store
  const dispatch = useDispatch();

  // Extract specific pieces of state from the Redux store
  const { loading, error, success } = useSelector(state => state.recommendationCreate); // Recommendation creation status
  const { userInfo } = useSelector(state => state.userLogin); // Logged-in user information
  const { users, loading: searchLoading } = useSelector(state => state.userSearch); // User search results and loading state

  // Effect to handle user search when the search term changes
  useEffect(() => {
    if (searchTerm.length > 2) {
      // Dispatch the searchUsers action if the search term is longer than 2 characters
      dispatch(searchUsers(searchTerm));
      setShowResults(true); // Show the search results dropdown
    } else {
      // Clear the search results and hide the dropdown if the search term is too short
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, dispatch]);

  // Effect to update the search results when the users or userInfo state changes
  useEffect(() => {
    if (users) {
      // Filter out the logged-in user from the search results
      setSearchResults(users.filter(u => u._id !== userInfo._id));
    }
  }, [users, userInfo]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Ensure a user is selected and a service category is chosen before submitting
    if (!selectedUser || !serviceCategory) return;

    // Dispatch the createRecommendation action with the selected user, category, and message
    dispatch(createRecommendation({
      recommendedUser: selectedUser._id,
      serviceCategory,
      message
    }));

    // Reset the form fields if the recommendation is successfully submitted
    if (success) {
      setSelectedUser(null);
      setSearchTerm('');
      setServiceCategory('');
      setMessage('');
    }
  };

  // Function to handle user selection from the search results
  const handleUserSelect = (user) => {
    setSelectedUser(user); // Set the selected user
    setSearchTerm(`${user.firstName} ${user.lastName}`); // Update the search term to display the user's name
    setShowResults(false); // Hide the search results dropdown
  };

  // Function to remove the selected user
  const removeSelectedUser = () => {
    setSelectedUser(null); // Clear the selected user
    setSearchTerm(''); // Reset the search term
  };

  // Render the form
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Form title */}
      <h2 className="text-xl font-semibold mb-4">Recommend a Service Provider</h2>
      
      {/* Form element */}
      <form onSubmit={handleSubmit}>
        {/* Search input for finding users */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Who do you want to recommend?
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a user..."
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={selectedUser} // Disable the input if a user is already selected
            />
            
            {/* Button to remove the selected user */}
            {selectedUser && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={removeSelectedUser}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>
          
          {/* Dropdown to display search results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="cursor-pointer hover:bg-blue-50 px-4 py-2 flex items-center"
                  onClick={() => handleUserSelect(user)}
                >
                  <img 
                    src={user.profilePhoto || '/images/default-user.png'} 
                    alt={user.firstName} 
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span>
                    {user.firstName} {user.lastName} ({user.email})
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* Display the selected user */}
          {selectedUser && (
            <div className="mt-2 flex items-center bg-blue-50 p-2 rounded-md">
              <FaUserCheck className="text-blue-500 mr-2" />
              <span>
                Recommending: {selectedUser.firstName} {selectedUser.lastName}
              </span>
            </div>
          )}
        </div>
        
        {/* Dropdown for selecting a service category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Category
          </label>
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="painting">Painting</option>
            <option value="medical">Medical</option>
            <option value="transport">Transport</option>
            <option value="security">Security</option>
            <option value="construction">Construction</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Text area for the optional recommendation message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Why are you recommending this person? (Optional)
          </label>
          <textarea
            rows="3"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Describe your experience with this service provider..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={!selectedUser || !serviceCategory || loading} // Disable if form is incomplete or loading
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Recommendation'}
        </button>
        
        {/* Display error message if submission fails */}
        {error && (
          <div className="mt-4 text-red-500 text-sm">{error}</div>
        )}
        
        {/* Display success message if submission succeeds */}
        {success && (
          <div className="mt-4 text-green-500 text-sm">
            Recommendation submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};

// Export the RecommendationForm component
export default RecommendationForm;