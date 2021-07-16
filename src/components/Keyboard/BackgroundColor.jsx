import React, { useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import { setBackgroundColor } from '../../store/config/actions';

import Key from './Key';

export const BackgroundColor = ({
  code,
  icon,
  color, 
  update,
}) => {
  const inp = useRef();
  const activatePicker = useMemo(() => {
    return function() {
      inp.current.click();
    }
  }, [inp]);

  return (
    <Key 
      className={"color background-color"}
      style={{ background: color }}
      code={code}
      icon={icon}
      onKey={activatePicker}
      label={"Background Color"}
      prependChildren
    >
      <input ref={inp} type="color" onChange={update} value={color} />
    </Key>
  )
};

export default connect(
  state => ({
    color: state.config.background
  }),
  dispatch => ({
    update: e => dispatch(setBackgroundColor(e.target.value))
  }),
)(BackgroundColor);
