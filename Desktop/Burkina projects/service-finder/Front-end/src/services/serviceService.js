// Importing the configured Axios instance from the api.js file
import api from './api';

/**
 * Fetches a list of services based on the provided filters.
 * @param {Object} filters - An object containing filter criteria (e.g., search term, category, rating, price range, location).
 * @param {string} [filters.search] - Search term to filter services by name or description.
 * @param {string} [filters.category] - Category to filter services.
 * @param {number} [filters.minRating] - Minimum rating to filter services.
 * @param {number} [filters.minPrice] - Minimum price to filter services.
 * @param {number} [filters.maxPrice] - Maximum price to filter services.
 * @param {boolean} [filters.useLocation] - Whether to filter services based on the user's location.
 * @returns {Promise} - A promise that resolves with the list of services or rejects with an error.
 */
export const getServices = (filters) => {
  const { search, category, minRating, minPrice, maxPrice, useLocation } = filters;

  // Construct query parameters based on the provided filters
  let params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  if (minRating) params.minRating = minRating;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (useLocation) params.useLocation = true;

  // Send a GET request to fetch services with the constructed query parameters
  return api.get('/services', { params });
};

/**
 * Fetches the details of a specific service by its ID.
 * @param {string} id - The ID of the service to retrieve.
 * @returns {Promise} - A promise that resolves with the service details or rejects with an error.
 */
export const getServiceDetails = (id) => {
  return api.get(`/services/${id}`);
};

/**
 * Creates a new service with the provided data.
 * @param {Object} serviceData - The data for the new service (e.g., name, description, price, category).
 * @returns {Promise} - A promise that resolves with the server's response or rejects with an error.
 */
export const createService = (serviceData) => {
  return api.post('/services', serviceData);
};

/**
 * Updates an existing service with the provided data.
 * @param {string} id - The ID of the service to update.
 * @param {Object} serviceData - The updated data for the service.
 * @returns {Promise} - A promise that resolves with the server's response or rejects with an error.
 */
export const updateService = (id, serviceData) => {
  return api.patch(`/services/${id}`, serviceData);
};

/**
 * Fetches services within a specified distance from a given location.
 * @param {number} distance - The radius within which to search for services.
 * @param {string} latlng - The latitude and longitude of the center point (e.g., "37.7749,-122.4194").
 * @param {string} unit - The unit of measurement for the distance (e.g., "km" or "mi").
 * @returns {Promise} - A promise that resolves with the list of services or rejects with an error.
 */
export const getServicesWithin = (distance, latlng, unit) => {
  return api.get(`/services/services-within/${distance}/center/${latlng}/unit/${unit}`);
};