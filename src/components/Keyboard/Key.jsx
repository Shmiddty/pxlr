import React from 'react';
import Icon from '../Icon';
import useKeypress from '../useKeypress';
import cn from '../../util/classnames';

const WrappedIcon = ({ icon }) => (
  typeof icon === "string"
    ? <Icon name={icon} />
    : typeof icon === "object"
    ? <Icon {...icon} /> // TODO: safety dance
    : false
);


export default function Key({ 
  code,
  label = code,
  className = '',
  icon, 
  children,
  prependChildren = false,
  onKey = NP => NP,
  ...rest // TODO: this is usually kinda finicky
}) {
  useKeypress(code, onKey);

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
