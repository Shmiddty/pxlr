import { MIRROR, MODE, BRUSH, brushes, symmetries } from './tools';
import { Modes, Shapes } from '../../const/brush';
import { types } from './actions';

const initialState = {
  mode: Modes.pencil,
  brush: BRUSH.SQUARE,
  mirror: MIRROR.NONE,
  rotationalSymmetry: false,
  size: 1
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.mirror:
      return {
        ...state,
        mirror: state.mirror ^ action.payload
      };
    case types.mode:
      return {
        ...state,
        mode: action.payload
      };
    case types.brush:
      return {
        ...state,
        brush: action.payload
      };
    case types.nextBrush:
      return {
        ...state,
        brush: (brushes.length + state.brush + 1) % brushes.length
      };
    case types.size:
      return {
        ...state,
        size: action.payload
      };
    case types.rotationalSymmetry:
      return {
        ...state,
        rotationalSymmetry: action.payload
      };
    case types.nextSymmetry:
      return {
        ...state,
        rotationalSymmetry: symmetries[
          (1 + symmetries.indexOf(state.rotationalSymmetry)) % 
          symmetries.length
        ]
      };
    case types.tool:
      switch (action.payload) {
        case 'increase-brush-size':
          return {
            ...state,
            size: state.size + 1
          }
        case 'decrease-brush-size':
          return {
            ...state,
            size: Math.max(1, state.size - 1)
          }
        default:break;
      }
      break;
    default:break;
  }

  return state;
}
