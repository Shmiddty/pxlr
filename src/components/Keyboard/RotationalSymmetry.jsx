import React from 'react';
import { connect } from 'react-redux';
import cn from '../../util/classnames';
import { nextSymmetry, setSymmetry } from '../../store/config/actions';

import Carousel from './Carousel';

export const RotationalSymmetry = (props) => (
  <Carousel 
    className={cn("rotational-symmetry", props.selectedIndex && 'active')} 
    {...props}
  />
);

export default connect(
  (state, { options }) => ({
    selectedIndex: options.findIndex(
      ({ value }) => value === state.config.rotationalSymmetry
    )
  }),
  (dispatch, { options })  => ({
    onNext: () => dispatch(nextSymmetry()),
    select: value => dispatch(setSymmetry(value))
  })
)(RotationalSymmetry);
