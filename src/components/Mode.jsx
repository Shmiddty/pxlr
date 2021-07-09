import React from 'react';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';
import { setMode } from '../store/config/actions';
import Select from './Keyboard/Select';

export const Mode = ({ 
  code,
  name,
  icon,
  select
}) => (
  <Select
    className="mode"
    label={upperFirst(name)} 
    code={code} 
    icon={icon} 
    onSelect={select} 
  />
);

export default connect(undefined, (dispatch, { mode }) => ({
  select: () => dispatch(setMode(mode))
}))(Mode);
