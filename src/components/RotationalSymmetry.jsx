import React from 'react';
import { connect } from 'react-redux';
import cn from '../util/classnames';
import { nextSymmetry } from '../store/config/actions';

import Carousel from './Keyboard/Carousel';

export const RotationalSymmetry = (props) => (
  <Carousel 
    className={cn("rotational-symmetry", props.selectedIndex && 'active')} 
    {...props}
  />
);

export default connect(
  (state, { options }) => ({
    selectedIndex: options.indexOf(state.config.rotationalSymmetry)
  }),
  (dispatch, { options })  => ({
    onNext: () => dispatch(nextSymmetry())
  })
)(RotationalSymmetry);
