import React from 'react'
import { connect } from 'react-redux';
import { 
  resetSize, 
  setSize
} from '../../store/config/actions';

import Numeric from './Numeric';

function doStep(size, dir = 1, minSize = 8, maxSize = 256, stepSize = 8) {
  return Math.max(minSize, Math.min(maxSize, size + dir * stepSize));
}

export const BrushSize = ({ 
  inputProps,
  decreaseProps,
  increaseProps
}) => (
  <Numeric
    inputProps={inputProps}
    decreaseProps={decreaseProps}
    increaseProps={increaseProps}
  />
);

export default connect(
  state => ({
    size: state.config.size
  }),
  dispatch => ({
    resetSize: () => dispatch(resetSize()),
    setSize: size => dispatch(setSize(size))
  }),
  (
    { size }, 
    { resetSize, setSize }, 
    { 
      inputProps: { min, max, step }, 
      inputProps, 
      decreaseProps, 
      increaseProps 
    }
  ) => ({
    inputProps: {
      ...inputProps,
      value: size,
      onKey: I=>I,
      onKeyShift: resetSize,
      onChange: e => setSize(+e.target.value)
    },
    decreaseProps: {
      ...decreaseProps,
      onKey: () => setSize(doStep(size, -1, min, max, step)),
      onClick: () => setSize(doStep(size, -1, min, max, step))
    },
    increaseProps: {
      ...increaseProps,
      onKey: () => setSize(doStep(size, 1, min, max, step)),
      onClick: () => setSize(doStep(size, 1, min, max, step))
    }
  })
)(BrushSize);
