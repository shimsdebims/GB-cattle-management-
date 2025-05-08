// Import constants for service-related actions
import {
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAIL,
  SERVICE_DETAILS_REQUEST,
  SERVICE_DETAILS_SUCCESS,
  SERVICE_DETAILS_FAIL,
  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_UPDATE_REQUEST,
  SERVICE_UPDATE_SUCCESS,
  SERVICE_UPDATE_FAIL,
} from '../constants/serviceConstants';

/**
 * Reducer for fetching a list of services.
 * @param {Object} state - The current state of the service list.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const serviceListReducer = (state = { services: [] }, action) => {
  switch (action.type) {
    case SERVICE_LIST_REQUEST:
      // When a service list request is initiated, set loading to true and clear the services array
      return { loading: true, services: [] };
    case SERVICE_LIST_SUCCESS:
      // When the service list is successfully fetched, store the services data and pagination info
      return {
        loading: false,
        services: action.payload.services,
        pages: action.payload.pages,
        page: action.payload.page,
      };
    case SERVICE_LIST_FAIL:
      // When fetching the service list fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};

/**
 * Reducer for fetching details of a specific service.
 * @param {Object} state - The current state of the service details.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const serviceDetailsReducer = (state = { service: { reviews: [] } }, action) => {
  switch (action.type) {
    case SERVICE_DETAILS_REQUEST:
      // When a service details request is initiated, set loading to true while keeping the current state
      return { ...state, loading: true };
    case SERVICE_DETAILS_SUCCESS:
      // When the service details are successfully fetched, store the service data
      return { loading: false, service: action.payload };
    case SERVICE_DETAILS_FAIL:
      // When fetching the service details fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};

/**
 * Reducer for creating a new service.
 * @param {Object} state - The current state of the service creation process.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const serviceCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_CREATE_REQUEST:
      // When a service creation request is initiated, set loading to true
      return { loading: true };
    case SERVICE_CREATE_SUCCESS:
      // When the service is successfully created, set success to true and store the service data
      return { loading: false, success: true, service: action.payload };
    case SERVICE_CREATE_FAIL:
      // When the service creation fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};

/**
 * Reducer for updating an existing service.
 * @param {Object} state - The current state of the service update process.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const serviceUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SERVICE_UPDATE_REQUEST:
      // When a service update request is initiated, set loading to true
      return { loading: true };
    case SERVICE_UPDATE_SUCCESS:
      // When the service is successfully updated, set success to true and store the updated service data
      return { loading: false, success: true, service: action.payload };
    case SERVICE_UPDATE_FAIL:
      // When the service update fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};