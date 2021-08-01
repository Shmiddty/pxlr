import React, { Fragment, useRef, useMemo } from 'react';
import cn from '../../util/classnames';
import useKeypress from './useKeypress'; 
import Key from './Key';

export default function Numeric({ 
  inputProps: {
    min,
    max,
    step,
    value,
    onChange,
    onKey, 
    ...inputProps
  },
  decreaseProps,
  increaseProps,
  ...props 
}) {
  const ref = useRef();
  const focusOnKey = useMemo(() => {
    return () => {
      ref.current && ref.current.focus();
      onKey();
    }
  });

  return (
    <Fragment>
      <Key 
        className={cn('numeric', 'input')} 
        onKey={focusOnKey}
        { ...inputProps }
      >
        <input
          type="number"
          ref={ref}
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
