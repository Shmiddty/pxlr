import React, { useState, useMemo } from 'react';
import { WrappedIcon } from '../Icon';
import useKeypress from './useKeypress';
import cn from '../../util/classnames';

export default function Key({ 
  code,
  label = code,
  className = '',
  icon, 
  children,
  prependChildren = false,
  onKey = NP => NP,
  onKeyShift = NP => NP,
  onKeyCtrl = NP => NP,
  onKeyAlt = NP => NP,
  isRepeatable = false,
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
  useKeypress(code, activateOnKey, { repeat: isRepeatable });
  useKeypress(code, onKeyShift, { shift: true, repeat: isRepeatable });
  useKeypress(code, onKeyCtrl, { ctrl: true, repeat: isRepeatable });
  useKeypress(code, onKeyAlt, { alt: true, repeat: isRepeatable });
  
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
