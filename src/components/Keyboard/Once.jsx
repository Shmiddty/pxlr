import React from 'react';
import Key from './Key';
import cn from '../../util/classnames';

export default function Once({ className, onClick, ...props }) {
  return (
    <Key className={cn("once", className)} {...props}>
      <button onClick={onClick} />
    </Key>
  );
}
