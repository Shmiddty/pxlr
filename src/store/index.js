import { createStore, applyMiddleware } from "redux";
import makePersistence from "./redux-localStorage";
import { Modes, Shapes } from "../const/brush";
import Pxls from "../lib/pxls";
//import logger from './redux-logger';

import reducer from "./reducer";

const [initialState, persist] = makePersistence("pxlr", {
  defaultState: reducer(undefined, {}),
  dehydrate: function (state) {
    return {
      ...state,
      config: {
        ...state.config,
        mode: Modes[state.config.mode],
        brush: Shapes[state.config.brush],
      },
      canvas: {
        ...state.canvas,
        pxls: Pxls.compress(
          state.canvas.pxls,
          state.canvas.width,
          state.canvas.height
        ),
      },
    };
  },
  rehydrate: function (json) {
    if (!json.config) return {};
    return {
      ...json,
      config: {
        ...json.config,
        mode: Modes[json.config.mode],
        brush: Shapes[json.config.brush],
      },
      canvas: {
        ...json.canvas,
        pxls: Pxls.decompress(
          json.canvas.pxls,
          json.canvas.width,
          json.canvas.height
        ),
      },
    };
  },
});

// TODO: I might want to give each layer its own storage key

const middleware = [
  //logger,
  persist,
];

export default createStore(
  reducer,
  initialState,
  applyMiddleware(...middleware)
);
