// Importing the configured Axios instance from the api.js file
import api from './api';

/**
 * Sends a POST request to log in a user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} - A promise that resolves with the user's login data or rejects with an error.
 */
export const login = (email, password) => {
  return api.post('/users/login', { email, password });
};

/**
 * Sends a POST request to register a new user.
 * @param {Object} userData - The data for the new user (e.g., name, email, password, etc.).
 * @returns {Promise} - A promise that resolves with the server's response or rejects with an error.
 */
export const register = (userData) => {
  return api.post('/users/signup', userData);
};

/**
 * Sends a GET request to retrieve the details of a specific user by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise} - A promise that resolves with the user's details or rejects with an error.
 */
export const getUserDetails = (id) => {
  return api.get(`/users/${id}`);
};

/**
 * Sends a PATCH request to update the profile of the currently authenticated user.
 * @param {Object} userData - The updated data for the user's profile (e.g., name, email, etc.).
 * @returns {Promise} - A promise that resolves with the server's response or rejects with an error.
 */
export const updateUserProfile = (userData) => {
  return api.patch('/users/updateMe', userData);
};

/**
 * Sends a GET request to search for users based on a search term.
 * @param {string} searchTerm - The term to search for users by name or other criteria.
 * @returns {Promise} - A promise that resolves with the list of matching users or rejects with an error.
 */
export const searchUsers = (searchTerm) => {
  return api.get(`/users/search?q=${searchTerm}`);
};