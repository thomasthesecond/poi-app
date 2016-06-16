import { combineReducers } from "redux";
import userAgent from "./userAgent";
import { routerReducer } from "react-router-redux";
import universalReducer from "../../universal/reducers";
import mobile from "./mobile";
import assign from "object-assign";

const reducers = assign({
  userAgent,
  mobile,
  routing: routerReducer,
}, universalReducer);

export default combineReducers(reducers);
