import React from 'react';
import cn from '../utils/classnames';

export default function Icon({ 
  name, 
  rotate = 0, 
  flipV = false, 
  flipH = false,
  spin = false
}) {
  return (
    <i 
      className={cn({
        "mdi": true,
        ["mdi-" + name]: true,
        ["mdi-rotate-" + rotate]: [45,90,135,180,225,270,315].includes(rotate),
        "mdi-flip-h": flipH,
        "mdi-flip-v": flipV,
        "mdi-spin": spin
      })}
    />
  );
}
