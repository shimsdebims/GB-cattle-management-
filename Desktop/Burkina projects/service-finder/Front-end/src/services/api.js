// Importing the axios library for making HTTP requests
import axios from 'axios';

// Setting the base URL for the API. It uses an environment variable if available, 
// otherwise defaults to 'http://localhost:5000/api/v1'.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Creating an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL, // Base URL for all API requests
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
  },
  timeout: 10000, // Set a timeout of 10 seconds for all requests
});

// Adding a request interceptor to include the JWT token in the Authorization header
api.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle any errors that occur while setting up the request
    if (process.env.NODE_ENV === 'development') {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Adding a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    // If the response is successful, simply return it
    return response;
  },
  (error) => {
    // Handle errors in the response
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized errors
      if (status === 401) {
        // Remove the token from localStorage
        localStorage.removeItem('token');
        // Redirect the user to the login page
        window.location.href = '/login';
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        alert('You do not have permission to perform this action.');
      }

      // Handle 500 Internal Server Error
      if (status === 500) {
        alert('An internal server error occurred. Please try again later.');
      }

      // Handle custom error messages from the server
      if (data && data.message) {
        alert(data.message);
      }
    } else {
      // Handle network errors or other unexpected errors
      alert('A network error occurred. Please check your connection and try again.');
    }

    // Log the error in development mode for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Response Error:', error);
    }

    // Reject the promise with the error object
    return Promise.reject(error);
  }
);

// Exporting the configured axios instance for use in other parts of the application
export default api;