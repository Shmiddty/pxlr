import React from 'react';
import cn from '../util/classnames';

export const WrappedIcon = ({ icon }) => (
  typeof icon === "string"
    ? <Icon name={icon} />
    : typeof icon === "object"
    ? <Icon {...icon} /> // TODO: safety dance
    : false
);

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
        "icon": true,
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
