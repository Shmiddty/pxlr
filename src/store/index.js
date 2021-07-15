import { createStore, applyMiddleware } from "redux";
import makePersistence from './redux-localStorage';
import { Modes, Shapes } from '../const/brush';
import { pxlsToColorMap, colorMapToPxls } from '../lib/pxls';
//import logger from './redux-logger';

import reducer from "./reducer";

// TODO: investigate mapping to { [x,y,width,height]: color }
function dehydratePxls(pxls, width, height = width) {
  return pxlsToColorMap(pxls);
}

function isColorMap(colorMap) {
  let fk = Object.keys(colorMap)[0];
  return fk && fk[0] === '#';
}

function rehydratePxls(colorMap, width, height = width) {
  if (!isColorMap(colorMap)) return colorMap;

  return colorMapToPxls(colorMap);
}

const [initialState, persist] = makePersistence('pxlr', {
  defaultState: reducer(undefined, {}),
  dehydrate: function (state) {
    return {
      ...state,
      config: {
        ...state.config,
        mode: Modes[state.config.mode],
        brush: Shapes[state.config.brush]
      },
      canvas: {
        ...state.canvas,
        pxls: dehydratePxls(state.canvas.pxls, state.canvas.width)
      }
    }
  },
  rehydrate: function (json) {
    if (!json.config) return {};
    return {
      ...json,
      config: {
        ...json.config,
        mode: Modes[json.config.mode],
        brush: Shapes[json.config.brush]
      },
      canvas: {
        ...json.canvas,
        pxls: rehydratePxls(json.canvas.pxls, json.canvas.width)
      }
    }
  }
});

// TODO: I might want to give each layer its own storage key

const middleware = [
  //logger, 
  persist
];

export default createStore(
  reducer, 
  initialState, 
  applyMiddleware(...middleware)
);
