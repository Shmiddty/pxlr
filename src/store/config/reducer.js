import { symmetries } from "./tools";
import { Mirror, Modes, Shapes, shapes } from "../../const/brush";
import { Tools } from "../../const/tools";
import { types } from "./actions";

const initialState = {
  mode: Modes.pencil,
  brush: Shapes.square, // TODO: this should be shape, not brush, maybe.
  mirror: Mirror.none,
  rotationalSymmetry: false,
  size: 1,
  stroke: 1,
  background: "#3b3b3b",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.background:
      return {
        ...state,
        background: action.payload,
      };
    case types.mirror:
      return {
        ...state,
        mirror: state.mirror ^ action.payload,
      };
    case types.mode:
      return {
        ...state,
        mode: action.payload,
      };
    case types.brush:
      return {
        ...state,
        brush: action.payload,
      };
    case types.nextBrush:
      return {
        ...state,
        brush:
          Shapes[
            shapes[(1 + shapes.indexOf(Shapes[state.brush])) % shapes.length]
          ],
      };
    case types.previousBrush:
      return {
        ...state,
        brush:
          Shapes[
            shapes[
              (shapes.length - 1 + shapes.indexOf(Shapes[state.brush])) %
                shapes.length
            ]
          ],
      };
    case types.size:
      return {
        ...state,
        size: action.payload,
      };
    case types.stroke:
      return {
        ...state,
        stroke: action.payload,
      };
    case types.rotationalSymmetry:
      return {
        ...state,
        rotationalSymmetry: action.payload,
      };
    case types.nextSymmetry:
      return {
        ...state,
        rotationalSymmetry:
          symmetries[
            (1 + symmetries.indexOf(state.rotationalSymmetry)) %
              symmetries.length
          ],
      };
    case types.previousSymmetry:
      return {
        ...state,
        rotationalSymmetry:
          symmetries[
            (symmetries.length -
              1 +
              symmetries.indexOf(state.rotationalSymmetry)) %
              symmetries.length
          ],
      };
    case types.tool:
      switch (action.payload) {
        case Tools.increaseBrushSize:
          return {
            ...state,
            size: state.size + 1,
          };
        case Tools.decreaseBrushSize:
          return {
            ...state,
            size: Math.max(1, state.size - 1),
          };
        default:
          break;
      }
      break;
    default:
      break;
  }

  return state;
}
