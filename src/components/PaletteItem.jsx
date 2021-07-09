import React from 'react';
import { connect } from 'react-redux';
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
  icon
}) => (
  <Key 
    className="color"
    style={{ background: color }}
    code={code}
    icon={icon}
    label={color}
    prependChildren
  >
    <input type="color" onChange={update} value={color} />
    <input // TODO: might not need the radio, buuuuut 
      type="radio" 
      name="palette" 
      value={color}
      checked={selected}
      onChange={select}
    />
  </Key>
);

export default connect(
  (state, { index }) => ({
    color: state.palette.palette[index],
    selected: state.palette.paletteIndex === index,
  }),
  (dispatch, { index }) => ({
    update: e => dispatch(setPaletteColor(e.target.value)),
    select: () => dispatch(setPaletteIndex(index))
  }),
)(PaletteItem);
