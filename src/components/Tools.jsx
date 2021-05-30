import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';

import { tools } from '../store/config/tools';
import { activateTool } from '../store/config/actions';

export default connect(
  state => ({
  }),
  dispatch => ({
    activateTool: tool => dispatch(activateTool(tool))
  })
)(({ activateTool }) => (
  <Fragment>{ tools.map(({ name, key, icon }) => (
    <button 
      key={name}
      data-key={key}
      className={`tool ${name}`} 
      onClick={() => activateTool(name)}
    >
      <span>{ upperFirst(name) }</span>
      <i className={icon} />
    </button>))}
  </Fragment>
));
