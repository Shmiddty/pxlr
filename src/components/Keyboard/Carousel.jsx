import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';

export default function Carousel({ 
  className,
  options,
  onNext,
  selectedIndex = 0,
  selectedItem = options[selectedIndex],
  icon = selectedItem.icon,
  label = selectedItem ? selectedItem.label || selectedItem : '',
  ...props 
}) {
  return (
    <Key 
      className={cn('carousel', className)} 
      icon={icon}
      label={label}
      onClick={onNext}
      onKey={onNext}
      {...props}
      prependChildren 
    />
  );
}
