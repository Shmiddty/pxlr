import React from 'react';
import { connect } from 'react-redux';

export default connect(
  state => ({
    width: state.canvas.width,
    height: state.canvas.height
  })
)(({ width, height }) => (
  <div className="side-length">
    <span>{ width }</span>
  </div>
));
