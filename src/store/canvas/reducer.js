import { bfs } from '../../util/search';
import { types as canvasTypes } from './actions';
import { types as configTypes } from '../config/actions';

const initialState = {
  width: 24,
  height: 24,
  pxls: {}
};

let hist = [];
let hidx = 0;

function removeNulls(pxls) {
  return Object.entries(pxls)
    .filter(([_,val]) => val !== null)
    .reduce((o, [k,v]) => {
      o[k] = v;
      return o;
    }, {});
}

function rotate (pxls, side, cw = true) {
  return Object.entries(pxls).reduce((o, [key, val]) => {
      let [x,y] = key.split(',').map(Number);
      let pos = cw
        ? [side - y - 1, x]
        : [y, side - x - 1];
      o[pos] = val;
      return o;
    }, {});
}


function flip (pxls, side, vertical = false) {
  return Object.entries(pxls).reduce((o, [key, val]) => {
    let [x, y] = key.split(',').map(Number);
    let pos = [
      !vertical ? side - x - 1 : x,
      !vertical ? y : side - y - 1
    ];
    o[pos] = val;
    return o;
  }, {});
};

function bucket ({ position, color }, pxls, side) {
  let init = pxls[position];
  return bfs(
    position, 
    ([x,y]) => [
      [x, y-1],
      [x, y+1],
      [x-1, y],
      [x+1, y]
    ],
    ([x,y]) => (
      x >= 0 && 
      x < side && 
      y >= 0 && 
      y < side && 
      pxls[[x,y]] === init
    )
  ).reduce((o, pos) => {
    o[pos] = color;
    return o;
  }, Object.assign({}, pxls));
}

export default function (state = initialState, action) {
  let next;
  switch (action.type) {
    case canvasTypes.resize:
      next = {
        ...state,
        width: action.payload,
        height: action.payload
      };
      break;
    case canvasTypes.resetSize:
      next = {
        ...initialState,
        pxls: state.pxls
      };
      break;
    case canvasTypes.bucket:
      next = {
        ...state,
        pxls: bucket(action.payload, state.pxls, state.width)
      };
      break;
    case canvasTypes.setPxl: 
      next = {
        ...state,
        pxls: removeNulls(Object.assign({}, state.pxls, action.payload))
      };
      break;
    case canvasTypes.setPxls:
      next = {
        ...state,
        pxls: removeNulls(Object.assign({}, state.pxls, action.payload))
      };
      break;
    case canvasTypes.clearPxl:
      next = {
        ...state,
        pxls: [action.payload].reduce(
          (o, pos) => {
            delete o[pos];
            return o;
          }, 
          Object.assign({}, state.pxls)
        ) 
      };
      break;
    case canvasTypes.clearPxls:
      next = {
        ...state,
        pxls: action.payload.reduce(
          (o, pos) => {
            delete o[pos];
            return o;
          }, 
          Object.assign({}, state.pxls)
        ) 
      };
      break;
    // TODO: should this be a separate reducer?
    case configTypes.tool:
      switch (action.payload) {
        case "clear":
          next = {
            ...state,
            pxls: {}
          };
          break;
        case "increase-dimensions":
          next = {
            ...state,
            width: state.width + 8,
            height: state.height + 8
          };
          break;
        case "decrease-dimensions":
          next = {
            ...state,
            width: Math.max(8, state.width - 8),
            height: Math.max(8, state.height - 8)
          };
          break;
        case "rotate-clockwise":
          next = {
            ...state,
            pxls: rotate(state.pxls, state.width, true)
          };
          break;
        case "rotate-counter-clockwise":
          next = {
            ...state,
            pxls: rotate(state.pxls, state.width, false)
          };
          break;
        case "flip-horizontally":
          next = {
            ...state,
            pxls: flip(state.pxls, state.width, false)
          };
          break;
        case "flip-vertically":
          next = {
            ...state,
            pxls: flip(state.pxls, state.width, true)
          };
          break;
        case "undo":
          if (hidx > 0) next = hist[--hidx];
          else return state;
          break;
        case "redo":
          if (hidx < hist.length - 1) next = hist[++hidx];
          else return state;
          break;
        default: return state;
      }
      break;
    default: return state;
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

  return next || state;
}
