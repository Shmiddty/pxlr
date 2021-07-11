import React from 'react';
import Keys from './Keys';
import cfg from './KeyboardConfig';

import '@mdi/font/css/materialdesignicons.min.css';
import './Keyboard.css';

console.log(cfg);

export default function Keyboard() {
  return (
    <div className="keyboard">
      { cfg.map((Key, i) =>  <Key.component key={Key.props.code} {...Key.props} /> )}
      <Keys />
    </div>
  );
}
