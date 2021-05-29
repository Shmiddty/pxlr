const initialState = {
  width: 24,
  height: 24,
  pxls: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "resize":
      return {
        ...state,
        width: action.payload,
        height: action.payload
      };
    case "setPxl": 
      return {
        ...state,
        pxls: {
          ...state.pxls,
          [action.payload.position]: action.payload.color
        }
      };
    default:
      break;
  }

  return state;
}
