// Importing action type constants from userConstants.js
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_SEARCH_REQUEST,
  USER_SEARCH_SUCCESS,
  USER_SEARCH_FAIL,
} from '../constants/userConstants';

// Reducer for handling user login state
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      // When login request is initiated, set loading to true
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      // On successful login, set loading to false and store user info
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      // On login failure, set loading to false and store error message
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      // On logout, reset the state to an empty object
      return {};
    default:
      // Return the current state if no matching action type
      return state;
  }
};

// Reducer for handling user registration state
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      // When registration request is initiated, set loading to true
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      // On successful registration, set loading to false and store user info
      return { loading: false, userInfo: action.payload };
    case USER_REGISTER_FAIL:
      // On registration failure, set loading to false and store error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type
      return state;
  }
};

// Reducer for handling user details retrieval state
export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      // When user details request is initiated, set loading to true
      return { ...state, loading: true };
    case USER_DETAILS_SUCCESS:
      // On successful retrieval, set loading to false and store user details
      return { loading: false, user: action.payload };
    case USER_DETAILS_FAIL:
      // On failure, set loading to false and store error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type
      return state;
  }
};

// Reducer for handling user profile update state
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      // When profile update request is initiated, set loading to true
      return { loading: true };
    case USER_UPDATE_PROFILE_SUCCESS:
      // On successful update, set loading to false, success to true, and store updated user info
      return { loading: false, success: true, userInfo: action.payload };
    case USER_UPDATE_PROFILE_FAIL:
      // On failure, set loading to false and store error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type
      return state;
  }
};

// Reducer for handling user search state
export const userSearchReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case USER_SEARCH_REQUEST:
      // When search request is initiated, set loading to true and reset users array
      return { loading: true, users: [] };
    case USER_SEARCH_SUCCESS:
      // On successful search, set loading to false and store the list of users
      return { loading: false, users: action.payload };
    case USER_SEARCH_FAIL:
      // On failure, set loading to false and store error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type
      return state;
  }
};