// Import constants for recommendation-related actions
import {
  RECOMMENDATION_CREATE_REQUEST,
  RECOMMENDATION_CREATE_SUCCESS,
  RECOMMENDATION_CREATE_FAIL,
  RECOMMENDATION_LIST_REQUEST,
  RECOMMENDATION_LIST_SUCCESS,
  RECOMMENDATION_LIST_FAIL,
} from '../constants/recommendationConstants';

/**
 * Reducer for creating a new recommendation.
 * @param {Object} state - The current state of the recommendation creation process.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const recommendationCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case RECOMMENDATION_CREATE_REQUEST:
      // When a recommendation creation request is initiated, set loading to true
      return { loading: true };
    case RECOMMENDATION_CREATE_SUCCESS:
      // When the recommendation is successfully created, set success to true and store the recommendation data
      return { loading: false, success: true, recommendation: action.payload };
    case RECOMMENDATION_CREATE_FAIL:
      // When the recommendation creation fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};

/**
 * Reducer for fetching a list of recommendations.
 * @param {Object} state - The current state of the recommendation list.
 * @param {Object} action - The action dispatched to the reducer.
 * @returns {Object} - The updated state based on the action type.
 */
export const recommendationListReducer = (state = { recommendations: [] }, action) => {
  switch (action.type) {
    case RECOMMENDATION_LIST_REQUEST:
      // When a recommendation list request is initiated, set loading to true and clear the recommendations array
      return { loading: true, recommendations: [] };
    case RECOMMENDATION_LIST_SUCCESS:
      // When the recommendation list is successfully fetched, store the recommendations data
      return { loading: false, recommendations: action.payload };
    case RECOMMENDATION_LIST_FAIL:
      // When fetching the recommendation list fails, store the error message
      return { loading: false, error: action.payload };
    default:
      // Return the current state if no matching action type is found
      return state;
  }
};