import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';
import { WrappedIcon } from '../Icon';

function CarouselItem ({ value, icon, label, ...rest }) {
  return (
    <label
      className="carousel-item key" 
      {...rest}
    >
      <WrappedIcon icon={icon} />
      <span>{label}</span>
    </label>
  );
}

export default function Carousel({ 
  className,
  options,
  onNext,
  select,
  selectedIndex = 0,
  selectedItem = options[selectedIndex],
  icon = selectedItem.icon,
  label = selectedItem.label,
  ...props 
}) {
  return (
    <Key 
      className={cn('carousel', className)} 
      icon={icon}
      label={label}
      onKey={onNext}
      {...props}
    > 
      { options.map(({ value, icon, label }) => ( 
        <CarouselItem
          key={label}
          onClick={() => select(value)}
          value={value}
          icon={icon}
          label={label}
        /> 
      ))}
    </Key>
  );
}
