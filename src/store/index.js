import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";

function makePersistence(key) {
  function Persist(store) {
    return next => action => {
      const result = next(action);
      
      localStorage.setItem(key, JSON.stringify(store.getState()));
      
      return result;
    };
  }

  return [
    JSON.parse(localStorage.getItem(key)) || {},
    Persist
  ];
}

const [initialState, persist] = makePersistence("pxlr");

const middleware = [persist]

export default createStore(
  reducer, 
  initialState, 
  applyMiddleware(...middleware)
);
