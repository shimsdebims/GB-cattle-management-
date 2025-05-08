// Importing necessary libraries and tools for Redux store configuration
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'; // Redux Toolkit for easier store setup
import thunk from 'redux-thunk'; // Middleware for handling asynchronous actions
import { combineReducers } from 'redux'; // Combines multiple reducers into one
import { persistReducer, persistStore } from 'redux-persist'; // Tools for persisting Redux state
import storage from 'redux-persist/lib/storage'; // Default storage engine (localStorage)

// Importing Reducers
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userSearchReducer,
} from './reducers/userReducers'; // User-related reducers
import {
  serviceListReducer,
  serviceDetailsReducer,
  serviceCreateReducer,
  serviceUpdateReducer,
} from './reducers/serviceReducers'; // Service-related reducers
import { reviewCreateReducer } from './reducers/reviewReducers'; // Review-related reducer
import {
  recommendationCreateReducer,
  recommendationListReducer,
} from './reducers/recommendationReducers'; // Recommendation-related reducers

// Combining all reducers into a single root reducer
const reducer = combineReducers({
  // User-related state slices
  userLogin: userLoginReducer, // Handles user login state
  userRegister: userRegisterReducer, // Handles user registration state
  userDetails: userDetailsReducer, // Handles user details retrieval state
  userUpdateProfile: userUpdateProfileReducer, // Handles user profile update state
  userSearch: userSearchReducer, // Handles user search state

  // Service-related state slices
  serviceList: serviceListReducer, // Handles list of services
  serviceDetails: serviceDetailsReducer, // Handles details of a specific service
  serviceCreate: serviceCreateReducer, // Handles service creation
  serviceUpdate: serviceUpdateReducer, // Handles service updates

  // Review-related state slice
  reviewCreate: reviewCreateReducer, // Handles review creation

  // Recommendation-related state slices
  recommendationCreate: recommendationCreateReducer, // Handles recommendation creation
  recommendationList: recommendationListReducer, // Handles list of recommendations
});

// Configuration for persisting Redux state
const persistConfig = {
  key: 'root', // Key for the persisted state in storage
  storage, // Storage engine (localStorage)
  whitelist: ['userLogin'], // Only persist the `userLogin` slice of the state
};

// Wrapping the root reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, reducer);

// Creating the Redux store
const store = configureStore({
  reducer: persistedReducer, // Using the persisted reducer
  middleware: [...getDefaultMiddleware(), thunk], // Adding thunk middleware for async actions
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

// Creating the persistor to manage the persisted store
const persistor = persistStore(store);

// Exporting the store and persistor for use in the application
export { store, persistor };