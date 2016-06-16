import { createStore, applyMiddleware, compose } from "redux";
import DevTools from "./containers/devTools";
import reducers from "./reducers";
import thunk from "redux-thunk";

// Logging middleware
const logger = store => next => action => {
  const result = next(action);

  console.log("dispatching", action.type ? action.type : action.toString());
  // console.log("next state", store.getState());

  return result;
};

function configureStore(initialState) {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(logger, thunk),
      // (typeof window !== "undefined" && window.devToolsExtension) ?
      //   window.devToolsExtension() :
      //   DevTools.instrument(),
    )
  );

  if (process.env.NODE_ENV === "development" && module.hot) {
    module.hot.accept("./reducers", () => {
      store.replaceReducer(require("./reducers").default);
    });
  }

  if (typeof window !== "undefined") {
    window.$$store = store;
  }
  return store;
}

export default configureStore;
