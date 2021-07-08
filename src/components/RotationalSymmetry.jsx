import React from 'react';
import { connect } from 'react-redux';
import cn from '../util/classnames';
import { nextSymmetry } from '../store/config/actions';

export default connect(
  state => ({
    rotationalSymmetry: state.config.rotationalSymmetry
  }), 
  dispatch => ({
    nextSymmetry: () => dispatch(nextSymmetry())
  })
)(({ rotationalSymmetry,  nextSymmetry }) => (
  <label
    data-key="c"
    className={cn({
      "rotational-symmetry":true,
      "active": rotationalSymmetry !== 0
    })}
    data-value={rotationalSymmetry}
    onClick={nextSymmetry}
  >
    <i className="mdi mdi-rotate-right" />
    <span>{rotationalSymmetry}</span>
  </label>
));
