import { createStore, applyMiddleware } from "redux";
import makePersistence from './redux-localStorage';
import { Modes, Shapes } from '../const/brush';
//import logger from './redux-logger';

import reducer from "./reducer";

const defaultState = reducer(undefined, {});

const [initialState, persist] = makePersistence(
  "pxlr", 
  defaultState,
  function (state) {
    return {
      ...state,
      config: {
        ...state.config,
        mode: Modes[state.config.mode],
        brush: Shapes[state.config.brush]
      }
    }
  },
  function (json) {
    if (!json.config) return {};
    return {
      ...json,
      config: {
        ...json.config,
        mode: Modes[json.config.mode],
        brush: Shapes[json.config.brush]
      }
    }
  }
);

const middleware = [
  //logger, 
  persist
];

export default createStore(
  reducer, 
  initialState, 
  applyMiddleware(...middleware)
);
