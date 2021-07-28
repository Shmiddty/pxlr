import React, { Fragment } from 'react';
import cn from '../../util/classnames';
import Key from './Key';

export default function Numeric({ 
  inputProps: {
    min,
    max,
    step,
    value,
    onChange,
    ...inputProps
  },
  decreaseProps,
  increaseProps,
  ...props 
}) {
  return (
    <Fragment>
      <Key 
        className={cn('numeric', 'input')} 
        { ...inputProps }
      >
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        /> 
      </Key>
      <Key
        className={cn('numeric', 'decrease')}
        disabled={value === min}
        { ...decreaseProps }
      />
      <Key
        className={cn('numeric', 'increase')}
        disabled={value === max}
        { ...increaseProps }
      />
    </Fragment>
  );
}
