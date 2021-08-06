import { types as canvasTypes } from "./actions";
import { types as configTypes } from "../config/actions";
import { Tools } from "../../const/tools";
import Pxls, { fill } from "../../lib/pxls";

// TODO: it is said that computations shouldn't be performed in reducers...

const maxWidth = 256;
const maxHeight = 256;
const minWidth = 8;
const minHeight = 8;

const initialState = {
  width: 24,
  height: 24,
  pxls: new Pxls(24, 24),
};

let hist = [];
let hidx = 0;

function removeNulls(pxls) {
  return Object.entries(pxls)
    .filter(([_, val]) => val !== null)
    .reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, {});
}
export default function (state = initialState, action) {
  let next;
  switch (action.type) {
    // TODO: this should probably resize the Pxls object?
    case canvasTypes.resize:
      next = {
        ...state,
        width: Math.max(minWidth, Math.min(maxWidth, action.payload)),
        height: Math.max(minHeight, Math.min(maxHeight, action.payload)),
      };
      next.pxls = Pxls.resize(next.pxls, next.width, next.height);
      break;
    case canvasTypes.resetSize:
      next = {
        ...state,
        width: initialState.width,
        height: initialState.height,
      };
      next.pxls = Pxls.resize(next.pxls, next.width, next.height);
      break;
    case canvasTypes.bucket:
      next = {
        ...state,
        pxls: fill(state.pxls, action.payload.position, action.payload.color, [
          state.width,
          state.height,
        ]),
      };
      break;
    case canvasTypes.setPxl:
      next = {
        ...state,
        pxls: Pxls.set(state.pxls, action.payload),
      };
      break;
    case canvasTypes.setPxls:
      next = {
        ...state,
        pxls: Pxls.union(state.pxls, action.payload),
      };
      break;
    case canvasTypes.clearPxl:
      next = {
        ...state,
        pxls: Pxls.clear(state.pxls, action.payload),
      };
      break;
    case canvasTypes.clearPxls:
      next = {
        ...state,
        pxls: Pxls.remove(state.pxls, action.payload),
      };
      break;
    // TODO: should this be a separate reducer?
    case configTypes.tool:
      switch (action.payload) {
        case Tools.clear:
          next = {
            ...state,
            pxls: new Pxls(state.width, state.height),
          };
          break;
        case Tools.increaseCanvasSize:
          next = {
            ...state,
            width: Math.min(maxWidth, state.width + 8),
            height: Math.min(maxHeight, state.height + 8),
          };
          next.pxls = Pxls.resize(next.pxls, next.width, next.height);
          break;
        case Tools.decreaseCanvasSize:
          next = {
            ...state,
            width: Math.max(minWidth, state.width - 8),
            height: Math.max(minHeight, state.height - 8),
          };
          next.pxls = Pxls.resize(next.pxls, next.width, next.height);
          break;
        case Tools.rotateClockwise:
          next = {
            ...state,
            pxls: Pxls.turn(state.pxls, true),
          };
          break;
        case Tools.rotateCounterClockwise:
          next = {
            ...state,
            pxls: Pxls.turn(state.pxls, false),
          };
          break;
        case Tools.flipHorizontally:
          next = {
            ...state,
            pxls: Pxls.flip(state.pxls, false),
          };
          break;
        case Tools.flipVertically:
          next = {
            ...state,
            pxls: Pxls.flip(state.pxls, true),
          };
          break;
        case Tools.undo:
          if (hidx > 0) next = hist[--hidx];
          else return state;
          break;
        case Tools.redo:
          if (hidx < hist.length - 1) next = hist[++hidx];
          else return state;
          break;
        default:
          return state;
      }
      break;
    default:
      return state;
  }

  if (!hist.includes(next)) {
    if (hidx < hist.length) {
      hist = hist.slice(0, hidx);
    }
    hist.push(state);
    hidx++;
  } else if (!hist.includes(state)) {
    hist.push(state);
  }
  console.log(next);
  return next || state;
}
