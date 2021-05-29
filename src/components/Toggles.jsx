import React, { Fragment } from 'react';
import { MIRROR } from '../store/config/reducer';
import { connect } from 'react-redux';

export default connect(
  state => ({
    mirror: state.config.mirror
  }),
  dispatch => ({
    updateMirror: mirror => dispatch({ type: "mirror", payload: mirror })
  })
)(({ mirror, updateMirror }) => (
  <Fragment>
    <label className="tool-mirror-vertical">
      <input 
        type="checkbox" 
        name="mirror-vertical" 
        checked={mirror & MIRROR.VERTICAL}
        onChange={() => updateMirror(MIRROR.VERTICAL)}
      />
      <span>Mirror Vertically</span>
    </label>
    <label className="tool-mirror-horizontal">
      <input 
        type="checkbox" 
        name="mirror-horizontal"
        checked={mirror & MIRROR.HORIZONTAL}
        onChange={() => updateMirror(MIRROR.HORIZONTAL)}
      />
      <span>Mirror Horizontally</span>
    </label>
  </Fragment>
));
