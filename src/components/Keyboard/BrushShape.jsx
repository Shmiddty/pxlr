import React from 'react';
import { connect } from 'react-redux';
import { nextBrush, setBrush } from '../../store/config/actions';

import Carousel from './Carousel';

export const BrushShape = (props) => (
  <Carousel className="brush-shape" {...props} />
);

export default connect(
  (state, { options }) => ({
    selectedItem: options.find(b => b.value === state.config.brush)
  }),
  dispatch => ({
    onNext: () => dispatch(nextBrush()),
    select: shape => dispatch(setBrush(shape))
  })
)(BrushShape);
