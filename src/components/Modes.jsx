import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { modes } from '../store/config/tools';
import { upperFirst } from 'lodash';

export default connect(
  state => ({
    active: state.config.mode
  }),
  dispatch => ({
    updateMode: mode => dispatch({ type: "mode", payload: mode })
  })
)(({ active, updateMode }) => (
  <Fragment>{modes.map((mode, i) => (
    <label className={`tool-${mode}`} key={mode}>
      <input 
        type="radio" 
        name="tool-mode" 
        value={i} 
        checked={active === i}
        onChange={() => updateMode(i)}
      />
      <span>{upperFirst(mode)}</span>
    </label>))}
  </Fragment>
));
