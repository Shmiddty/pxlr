import React from 'react';
import cn from '../../utils/classnames';
import Key from './Key';

export default function Select({ className, group, onSelect, ...props }) {
  return (
    <Key 
      className={cn('select', className)} 
      {...props}
      prependChildren 
    >
      <input type="radio" name={group} onChange={onSelect} />
    </Key>
  );
}
