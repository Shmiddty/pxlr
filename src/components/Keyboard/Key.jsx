import React from 'react';
import Icon from '../Icon';
import cn from '../../utils/classnames';

export default function Key({ 
  code,
  label = code,
  className = '',
  icon, 
  children,
  prependChildren = false,
  ...rest // TODO: this is usually kinda finicky
}) {
  return (
    <label
      data-key={code}
      className={cn('key', className)} 
      title={`(${code}) ${label}`}
      {...rest}
    >
      {prependChildren && children}
      <span>{label}</span>
      <Icon name={icon} />
      {!prependChildren && children}
    </label>
  );
}
