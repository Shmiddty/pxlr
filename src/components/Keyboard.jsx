import React from 'react';
import Keys from './Keys';
import cfg from './KeyboardConfig';

import '@mdi/font/css/materialdesignicons.min.css';
import './Keyboard.css';

export default function Keyboard() {
  return (
    <div className="keyboard">
      <Keys />
      { cfg.map((Key, i) =>  <Key.component key={i} {...Key.props} /> )}
    </div>
  );
}
