import React from 'react';
import cn from '../../util/classnames';
import Key from './Key';
import { WrappedIcon } from '../Icon';

function CarouselItem ({ value, icon, label, selected, ...rest }) {
  return (
    <label
      className={cn("carousel-item key", selected && "active")} 
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
  onPrevious,
  select,
  selectedIndex = 0,
  selectedItem = options[selectedIndex] || {},
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
      onKeyShift={onPrevious}
      onKeyAlt={() => select(options[0].value)} 
      {...props}
    > 
      { options.map((item,i,a,{ value, icon, label }=item) => ( 
        <CarouselItem
          key={label}
          selected={selectedItem === item}
          onClick={() => select(value)}
          value={value}
          icon={icon}
          label={label}
        /> 
      ))}
    </Key>
  );
}
