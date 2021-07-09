import React from 'react';
import Icon from '../Icon';
import cn from '../../utils/classnames';

const WrappedIcon = ({ icon }) => (
  typeof icon === "string"
    ? <Icon name={icon} />
    : <Icon {...icon} /> // TODO: safety dance
);


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
      <WrappedIcon icon={icon} />
      {!prependChildren && children}
    </label>
  );
}
