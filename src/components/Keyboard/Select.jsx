import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';

export default function Select({ 
  className, 
  group, 
  onSelect, 
  selected = false, 
  ...props 
}) {
  return (
    <Key 
      className={cn('select', className)} 
      onKey={onSelect}
      {...props}
      prependChildren 
    >
      <input 
        type="radio" 
        name={group} 
        onChange={onSelect} 
        checked={selected} 
      />
    </Key>
  );
}
