// Import the combineReducers function from Redux to combine multiple reducers into a single root reducer
import { combineReducers } from 'redux';

// Import user-related reducers for managing user authentication, registration, profile updates, and search
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userSearchReducer,
} from './userReducers';

// Import service-related reducers for managing service listings, details, creation, and updates
import {
  serviceListReducer,
  serviceDetailsReducer,
  serviceCreateReducer,
  serviceUpdateReducer,
} from './serviceReducers';

// Import review-related reducers for managing the creation of service reviews
import { reviewCreateReducer } from './reviewReducers';

// Import recommendation-related reducers for managing the creation and listing of recommendations
import {
  recommendationCreateReducer,
  recommendationListReducer,
} from './recommendationReducers';

// Combine all the reducers into a single root reducer
const reducer = combineReducers({
  // User-related reducers
  userLogin: userLoginReducer, // Manages the state for user login (e.g., loading, error, user info)
  userRegister: userRegisterReducer, // Manages the state for user registration
  userDetails: userDetailsReducer, // Manages the state for fetching user details
  userUpdateProfile: userUpdateProfileReducer, // Manages the state for updating user profiles
  userSearch: userSearchReducer, // Manages the state for searching users

  // Service-related reducers
  serviceList: serviceListReducer, // Manages the state for fetching a list of services
  serviceDetails: serviceDetailsReducer, // Manages the state for fetching details of a specific service
  serviceCreate: serviceCreateReducer, // Manages the state for creating a new service
  serviceUpdate: serviceUpdateReducer, // Manages the state for updating an existing service

  // Review-related reducers
  reviewCreate: reviewCreateReducer, // Manages the state for creating a new review for a service

  // Recommendation-related reducers
  recommendationCreate: recommendationCreateReducer, // Manages the state for creating a new recommendation
  recommendationList: recommendationListReducer, // Manages the state for fetching a list of recommendations
});

// Export the combined root reducer for use in the Redux store
export default reducer;