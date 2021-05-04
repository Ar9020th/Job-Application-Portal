import {
  FETCH_MY_JOBS,
  JOBS_LOADING,
  FETCH_ALL_JOBS,
  FETCH_APPLICATIONS,
  ACCEPTED_EMPLOYEES,
  GET_ALL_RATINGS,
} from "../actions/types";

const initialState = {
  alljobs: null,
  myjobs: null,
  applicationsdata: null,
  acceptedEmployees: null,
  allRatings: null,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_MY_JOBS:
      return {
        ...state,
        myjobs: action.payload,
        loading: false,
      };
    case FETCH_ALL_JOBS:
      return {
        ...state,
        alljobs: action.payload,
        loading: false,
      };
    case JOBS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APPLICATIONS:
      return {
        ...state,
        applicationsdata: action.payload,
        loading: false,
      };
    case ACCEPTED_EMPLOYEES:
      return {
        ...state,
        acceptedEmployees: action.payload,
      };
    case GET_ALL_RATINGS:
      return {
        ...state,
        allRatings: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
