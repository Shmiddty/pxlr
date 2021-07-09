import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';

export default function Toggle({ className, onToggle, ...props }) {
  return (
    <Key
      className={cn('toggle', className)} 
      {...props}
      prependChildren 
    >
      <input type="checkbox" onChange={onToggle} />
    </Key>
  );
}
