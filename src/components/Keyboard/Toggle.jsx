import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';

export default function Toggle({ className, onToggle, checked, ...props }) {
  return (
    <Key
      className={cn('toggle', className)} 
      onKey={onToggle}
      {...props}
      prependChildren 
    >
      <input type="checkbox" onChange={onToggle} checked={checked} />
    </Key>
  );
}
