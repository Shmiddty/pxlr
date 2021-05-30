import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { resetSize } from '../store/config/actions';
import { resetSize as resetCanvasSize } from '../store/canvas/actions';

// TODO: might want to do this dynamically like the others
export default connect(
  state => ({
    size: state.config.size,
    canvasSize: state.canvas.width
  }),
  dispatch => ({
    resetSize: () => dispatch(resetSize()),
    resetCanvasSize: () => dispatch(resetCanvasSize())
  })
)(({ size, resetSize, canvasSize, resetCanvasSize }) => (
  <Fragment>
    <label
      data-key="p"
      className="size canvas-size"
      onClick={resetCanvasSize}
    >
      <span>Canvas Size</span>
      <i className="mdi ">
        <span>{canvasSize}</span>
      </i>
    </label>
    <label 
      data-key="l"
      className="size brush-size"
      onClick={resetSize}
    >
      <span>Brush Size</span>
      <i className="mdi ">
        <span>{size}</span>
      </i>
    </label>
  </Fragment>
));
