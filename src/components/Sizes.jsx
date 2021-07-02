import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { 
  resetSize as resetBrushSize, 
  setSize as setBrushSize
} from '../store/config/actions';
import { 
  resetSize as resetCanvasSize, 
  resize as setCanvasSize 
} from '../store/canvas/actions';

// TODO: properly enforce max canvas size

// TODO: might want to do this dynamically like the others
export default connect(
  state => ({
    brushSize: state.config.size,
    canvasSize: state.canvas.width
  }),
  dispatch => ({
    resetBrushSize: () => dispatch(resetBrushSize()),
    setBrushSize: e => dispatch(setBrushSize(+e.target.value)),
    resetCanvasSize: () => dispatch(resetCanvasSize()),
    setCanvasSize: e => dispatch(setCanvasSize(+e.target.value))
  })
)(({
  brushSize, 
  resetBrushSize,
  setBrushSize,

  canvasSize, 
  resetCanvasSize,
  setCanvasSize
}) => (
  <Fragment>
    <label
      data-key="p"
      className="size canvas-size"
    >
      <span>Canvas Size</span>
      <input
        type="number" 
        value={canvasSize}
        onChange={setCanvasSize}
        min="8"
        max="256"
      />
      <i className="mdi ">
        <span>{canvasSize}</span>
      </i>
    </label>
    <label 
      data-key="l"
      className="size brush-size"
    >
      <span>Brush Size</span>
      <input
        type="number" 
        value={brushSize}
        onChange={setBrushSize}
        min="1"
      />
      <i className="mdi ">
        <span>{brushSize}</span>
      </i>
    </label>
  </Fragment>
));
