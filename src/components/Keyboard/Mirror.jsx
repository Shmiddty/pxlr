import React from 'react';
import { connect } from 'react-redux';
import upperFirst from 'lodash/upperFirst';
import ToggleKey from './Toggle';

// TODO: get rid of the icky hacky
import { setMirror } from '../../store/config/actions';
import { Toggles } from '../../const/toggles';

export const Mirror = ({ 
  code,
  name,
  icon,
  checked,
  toggle,
  uid
}) => (
  <ToggleKey
    label={upperFirst(name)} 
    code={code} 
    icon={icon} 
    checked={checked}
    onToggle={toggle} 
  />
);

export default connect(
  (state, { uid }) => ({
    checked: uid === Toggles.mirrorVertically 
      ? state.config.mirror & 1
      : state.config.mirror & 2
  }), 
  (dispatch, { uid }) => ({
    toggle: () => dispatch(setMirror(
      uid === Toggles.mirrorVertically
        ? 1
        : 2
    ))
  })
)(Mirror);
