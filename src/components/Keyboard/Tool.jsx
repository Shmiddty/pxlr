import React from 'react';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';
import { activateTool } from '../../store/config/actions';
import Once from './Once';

export const Tool = ({ 
  code,
  name,
  icon,
  activate
}) => (
  <Once
    className="tool"
    label={upperFirst(name)} 
    code={code} 
    icon={icon} 
    onClick={activate} 
  />
);

export default connect(undefined, (dispatch, { tool }) => ({
  activate: () => dispatch(activateTool(tool))
}))(Tool);
