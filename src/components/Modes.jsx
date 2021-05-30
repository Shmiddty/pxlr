import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { modes } from '../store/config/tools';
import { setMode } from '../store/config/actions';

import { upperFirst } from 'lodash';

export default connect(
  state => ({
    active: state.config.mode
  }),
  dispatch => ({
    updateMode: e => dispatch(setMode(parseInt(e.target.value)))
  })
)(({ active, updateMode }) => (
  <Fragment>{modes.map(({ name, key, icon }, i) => (
    <label 
      key={name}
      data-key={key}
      className={`mode ${name}`} 
    >
      <input 
        type="radio" 
        name="tool-mode" 
        value={i}
        checked={active === i}
        onChange={updateMode}
      />
      <span>{upperFirst(name)}</span>
      <i className={icon} />
    </label>))}
  </Fragment>
));
