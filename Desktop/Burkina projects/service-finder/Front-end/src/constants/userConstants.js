// Constants for user login actions
export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST'; // Dispatched when a login request is initiated
export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS'; // Dispatched when login is successful
export const USER_LOGIN_FAIL = 'USER_LOGIN_FAIL';       // Dispatched when login fails
export const USER_LOGOUT = 'USER_LOGOUT';               // Dispatched when the user logs out

// Constants for user registration actions
export const USER_REGISTER_REQUEST = 'USER_REGISTER_REQUEST'; // Dispatched when a registration request is initiated
export const USER_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS'; // Dispatched when registration is successful
export const USER_REGISTER_FAIL = 'USER_REGISTER_FAIL';       // Dispatched when registration fails

// Constants for fetching user details
export const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST'; // Dispatched when a request for user details is initiated
export const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS'; // Dispatched when user details are successfully fetched
export const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL';       // Dispatched when fetching user details fails

// Constants for updating user profile
export const USER_UPDATE_PROFILE_REQUEST = 'USER_UPDATE_PROFILE_REQUEST'; // Dispatched when a profile update request is initiated
export const USER_UPDATE_PROFILE_SUCCESS = 'USER_UPDATE_PROFILE_SUCCESS'; // Dispatched when profile update is successful
export const USER_UPDATE_PROFILE_FAIL = 'USER_UPDATE_PROFILE_FAIL';       // Dispatched when profile update fails

// Constants for searching users
export const USER_SEARCH_REQUEST = 'USER_SEARCH_REQUEST'; // Dispatched when a user search request is initiated
export const USER_SEARCH_SUCCESS = 'USER_SEARCH_SUCCESS'; // Dispatched when user search results are successfully fetched
export const USER_SEARCH_FAIL = 'USER_SEARCH_FAIL';       // Dispatched when user search fails