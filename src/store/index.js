import { createStore, applyMiddleware } from "redux";
import makePersistence from './redux-localStorage';
//import logger from './redux-logger';

import reducer from "./reducer";
//import keybindings from './keyboard/middleware';

const defaultState = reducer(undefined, {});

const [initialState, persist] = makePersistence(
  "pxlr", 
  defaultState
);

const middleware = [
  //logger, 
  //keybindings, 
  persist
];

export default createStore(
  reducer, 
  initialState, 
  applyMiddleware(...middleware)
);
