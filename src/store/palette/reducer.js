const initialState = {
  color: "#000"
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "color":
      return {
        ...state,
        color: action.payload
      };
    default:
      break;
  }

  return state;
}
