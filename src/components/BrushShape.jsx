import React from 'react';
import { connect } from 'react-redux';
import { nextBrush } from '../store/config/actions';

import Carousel from './Keyboard/Carousel';

export const BrushShape = (props) => (
  <Carousel className="brush-shape" {...props} />
);

export default connect(
  (state, { options }) => ({
    selectedItem: options.find(b => b.shape === state.config.brush)
  }),
  dispatch => ({
    onNext: () => dispatch(nextBrush())
  })
)(BrushShape);
