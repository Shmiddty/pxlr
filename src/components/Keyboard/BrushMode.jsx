import React from 'react';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';
import { setMode } from '../../store/config/actions';
import Select from './Select';

export const BrushMode = ({ 
  code,
  name,
  icon,
  select,
  selected
}) => (
  <Select
    className="mode"
    group="mode"
    label={upperFirst(name)} 
    code={code} 
    icon={icon} 
    onSelect={select}
    selected={selected}
  />
);

export default connect(
  (state, { mode }) => ({ 
    selected: state.config.mode === mode
  }), 
  (dispatch, { mode }) => ({
    select: () => dispatch(setMode(mode))
  })
)(BrushMode);
