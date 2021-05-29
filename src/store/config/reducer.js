import { modes } from './tools';

export const MIRROR = {
  NONE: 0,
  VERTICAL: 2**0,
  HORIZONTAL: 2**1,
  BOTH: 2**2
};

export const MODE = modes.reduce((o, t, i) => {
  o[t.toUpperCase()] = i;
  return o;
}, {});

const initialState = {
  mode: MODE.PENCIL,
  mirror: MIRROR.NONE 
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "mirror":
      return {
        ...state,
        mirror: state.mirror ^ action.payload
      };
    case "mode":
      return {
        ...state,
        mode: action.payload
      };
    default:
      break;
  }

  return state;
}
