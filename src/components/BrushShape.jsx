import React from 'react';
import { connect } from 'react-redux';
import { nextBrush } from '../store/config/actions';

import Carousel from './Keyboard/Carousel';

export const BrushShape = (props) => (
  <Carousel className="brush-shape" {...props} />
);

export default connect(
  state => ({
    selectedIndex: state.config.brush
  }),
  (dispatch, { options })  => ({
    onNext: () => dispatch(nextBrush())
  })
)(BrushShape);
