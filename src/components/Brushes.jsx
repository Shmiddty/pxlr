import React from 'react';
import { connect } from 'react-redux';
import { setBrush, nextBrush } from '../store/config/actions';
import { brushes } from '../store/config/tools';

export default connect(
  state => ({
    brush: state.config.brush
  }),
  dispatch => ({
    setBrush: e => dispatch(setBrush(+e.target.value)),
    nextBrush: e => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(nextBrush());
    }
  })
)(({ brush, setBrush, nextBrush }) => (
  <span
    className="brushes select"
    data-key="Tab"
    onClickCapture={nextBrush}
  >
    {brushes.map((b, i) => (
      <label
        key={b.name}
        className={`${i === brush ? "active" : ""}`}
      >
        <input 
          type="radio"
          value={i}
          checked={i === brush}
          onChange={setBrush}
        />
        <span>{b.name}</span>
        <i className={b.icon} />
      </label>
    ))}
  </span>
));
