// Importing the configured Axios instance from the api.js file
import api from './api';

/**
 * Sends a POST request to create a new recommendation for a user.
 * @param {Object} recommendationData - The data for the new recommendation (e.g., title, description, etc.).
 * @returns {Promise} - A promise that resolves with the server's response or rejects with an error.
 */
export const createRecommendation = (recommendationData) => {
  return api.post('/users/recommendations', recommendationData);
};

/**
 * Sends a GET request to retrieve all recommendations for the currently authenticated user.
 * @returns {Promise} - A promise that resolves with the list of recommendations or rejects with an error.
 */
export const getUserRecommendations = () => {
  return api.get('/users/recommendations');
};