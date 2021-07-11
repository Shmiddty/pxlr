import { types as paletteTypes } from './actions';
import { types as configTypes } from '../config/actions';
import { Tools } from '../../const/tools';

const initialState = {
  palette: ["#ff0000", "#ffa200", "#eeff00", "#44ff00", "#00ffee", "#0400ff", "#a600ff", "#ff00ea", "#000000", "#ffffff"],
  paletteIndex: 0
};

function updateItemAt(arr, index, val) {
  let next = arr.slice();
  next[index] = val;
  return next;
}

export default function (state = initialState, action) {
  let paletteIndex;
  switch (action.type) {
    case paletteTypes.color:
      return {
        ...state,
        palette: updateItemAt(state.palette, state.paletteIndex, action.payload)
      };
    case paletteTypes.setPaletteColor:
      return {
        ...state,
        paletteIndex: action.payload.index,
        palette: updateItemAt(state.palette, action.payload.index, action.payload.color)
      };
    case paletteTypes.fromPalette:
      return {
        ...state,
        paletteIndex: action.payload,
      };
    case configTypes.tool:
      switch (action.payload) {
        case Tools.nextColor:
          paletteIndex = 
            (state.paletteIndex + 1) % 
            state.palette.length;
          return {
            ...state,
            paletteIndex,
          };
        case Tools.previousColor:
          paletteIndex = 
            (state.palette.length + state.paletteIndex - 1) % 
            state.palette.length;
          return {
            ...state,
            paletteIndex,
          };
        default: break;
      }
      break;
    default:
      break;
  }

  return state;
}
