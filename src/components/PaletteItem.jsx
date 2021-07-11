import React from 'react';
import { connect } from 'react-redux';
import cn from '../util/classnames';
import Key from './Keyboard/Key';
import { 
  setPaletteColor, 
  setPaletteIndex
} from '../store/palette/actions';

export const PaletteItem = ({
  code,
  color, 
  selected, 
  update,
  select,
  icon = "palette-outline"
}) => (
  <Key 
    className={cn("color", selected && 'selected')}
    style={{ background: color }}
    code={code}
    icon={icon}
    label={color}
    onClick={select}
    onKey={select}
    prependChildren
  >
    <input type="color" onChange={update} value={color} />
  </Key>
);

export default connect(
  (state, { index }) => ({
    color: state.palette.palette[index],
    selected: state.palette.paletteIndex === index,
  }),
  (dispatch, { index }) => ({
    update: e => dispatch(setPaletteColor(index, e.target.value)),
    select: () => dispatch(setPaletteIndex(index))
  }),
)(PaletteItem);
