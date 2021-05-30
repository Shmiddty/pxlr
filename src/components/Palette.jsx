import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { palette as keys } from '../store/config/tools';
import { 
  setColor, 
  setPaletteColor, 
  setPaletteIndex
} from '../store/palette/actions';

export default connect(
  store => ({
    ...store.palette
  }),
  dispatch => ({
    setColor: e => dispatch(setColor(e.target.value)),
    setPaletteColor: e => dispatch(setPaletteColor(
      +e.target.dataset.index,
      e.target.value
    )),
    setPaletteIndex: e => dispatch(setPaletteIndex(+e.target.dataset.index))
  })
)(({ 
  color, 
  palette, 
  paletteIndex, 
  setColor, 
  setPaletteColor,
  setPaletteIndex
}) => (
  <Fragment>
    {keys.map(({ name, key, index }) => (
      <label 
        key={key} 
        data-key={key} 
        className="color"
        onClick={setPaletteIndex}
      >
        <input 
          type="color"
          data-index={index}
          onChange={setPaletteColor} 
          value={palette[index]} 
        />
        <input 
          type="radio" 
          name="palette" 
          value={palette[index]} 
          onChange={setColor}
          checked={index === paletteIndex}
        />
        <span>{key}</span>
        <i 
          className="mdi mdi-palette-outline" 
          style={{ background: palette[index] }}
        />
      </label>
    ))}
  </Fragment>
));
