import React, { Fragment } from 'react';
import { MIRROR } from '../store/config/tools';
import { setMirror } from '../store/config/actions';
import { connect } from 'react-redux';

// TODO: might want to do this dynamically like the others
export default connect(
  state => ({
    mirror: state.config.mirror
  }),
  dispatch => ({
    setMirror: mirror => dispatch(setMirror(mirror))
  })
)(({ mirror, setMirror }) => (
  <Fragment>
    <label 
      data-key="z"
      className="toggle mirror-vertical"
    >
      <input 
        type="checkbox" 
        name="mirror-vertical" 
        checked={mirror & MIRROR.VERTICAL}
        onChange={() => setMirror(MIRROR.VERTICAL)}
      />
      <span>Mirror Vertically</span>
      <i className="mdi mdi-reflect-vertical" />
    </label>
    <label
      data-key="x"
      className="toggle mirror-horizontal"
    >
      <input 
        type="checkbox" 
        name="mirror-horizontal"
        checked={mirror & MIRROR.HORIZONTAL}
        onChange={() => setMirror(MIRROR.HORIZONTAL)}
      />
      <span>Mirror Horizontally</span>
      <i className="mdi mdi-reflect-horizontal" />
    </label>
  </Fragment>
));
