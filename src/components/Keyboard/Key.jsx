import React, { useState, useMemo } from 'react';
import Icon from '../Icon';
import useKeypress from './useKeypress';
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
  activeTime = 250,
  ...rest // TODO: this is usually kinda finicky
}) {
  const [active, setActive] = useState(false);
  const activateOnKey = useMemo(() => {
    return function() {
      onKey();
      setActive(true);
      setTimeout(() => setActive(false), activeTime);
    }
  }, [activeTime, onKey]);
  useKeypress(code, activateOnKey);

  return (
    <label
      data-key={code}
      className={cn('key', className, active && "activated")} 
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
