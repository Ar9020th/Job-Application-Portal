import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import jobReducer from "./jobReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  job: jobReducer,
});
