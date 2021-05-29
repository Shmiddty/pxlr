import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { upperFirst } from 'lodash';

import { tools } from '../store/config/tools';

export default connect(
  state => ({
  }),
  dispatch => ({
    activateTool: tool => dispatch({ type: "tool", payload: tool })
  })
)(({ activateTool }) => (
  <Fragment>{ tools.map(tool => (
    <button 
      key={tool} 
      className={`tool-${tool}`} 
      onClick={() => activateTool(tool)}
    >
      { upperFirst(tool) }
    </button>))}
  </Fragment>
));
