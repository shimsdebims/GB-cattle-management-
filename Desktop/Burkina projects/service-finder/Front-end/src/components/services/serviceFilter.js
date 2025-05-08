// Import React and useState for managing component state
import React, { useState } from 'react';

// Import icons from react-icons for visual elements
import { FaSearch, FaFilter, FaMapMarkerAlt, FaSyncAlt } from 'react-icons/fa';

// Define the ServiceFilter component, which takes `onFilter` and `categories` as props
const ServiceFilter = ({ onFilter, categories }) => {
  // State to track the search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');

  // State to track the selected category
  const [category, setCategory] = useState('');

  // State to track the minimum rating filter
  const [minRating, setMinRating] = useState(0);

  // State to track the price range filter (min and max values)
  const [priceRange, setPriceRange] = useState([0, 100000]);

  // State to toggle the visibility of advanced filters
  const [showAdvanced, setShowAdvanced] = useState(false);

  // State to track whether the "Use My Location" filter is enabled
  const [useLocation, setUseLocation] = useState(false);

  /**
   * Handles the form submission to apply filters.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Create a filters object with the current filter values
    const filters = {
      search: searchTerm,
      category,
      minRating,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      useLocation,
    };

    // Call the onFilter function passed as a prop with the filters object
    onFilter(filters);
  };

  /**
   * Resets all filters to their default values.
   */
  const resetFilters = () => {
    // Reset all state variables to their default values
    setSearchTerm('');
    setCategory('');
    setMinRating(0);
    setPriceRange([0, 100000]);
    setUseLocation(false);

    // Call the onFilter function with default filter values
    onFilter({
      search: '',
      category: '',
      minRating: 0,
      minPrice: 0,
      maxPrice: 100000,
      useLocation: false,
    });
  };

  return (
    // Main container for the filter form with styling
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Filter form */}
      <form onSubmit={handleSubmit}>
        {/* Basic search input and search button */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search input field */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="What service do you need?"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>

        {/* Advanced filters toggle and reset button */}
        <div className="flex justify-between items-center mb-4">
          {/* Toggle button for advanced filters */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaFilter className="mr-1" />
            {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
          </button>

          {/* Reset filters button */}
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <FaSyncAlt className="mr-1" />
            Reset
          </button>
        </div>

        {/* Advanced filters section */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum rating filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value="0">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Star</option>
              </select>
            </div>

            {/* Price range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (XOF)</label>
              <div className="flex items-center space-x-2">
                {/* Minimum price input */}
                <input
                  type="number"
                  className="block w-1/2 pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  min="0"
                />
                <span>-</span>
                {/* Maximum price input */}
                <input
                  type="number"
                  className="block w-1/2 pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  min="0"
                />
              </div>
            </div>

            {/* Use location filter */}
            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  id="use-location"
                  name="use-location"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={useLocation}
                  onChange={(e) => setUseLocation(e.target.checked)}
                />
                <label htmlFor="use-location" className="ml-2 block text-sm text-gray-700 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> Use My Location
                </label>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Export the ServiceFilter component for use in other parts of the application
export default ServiceFilter;