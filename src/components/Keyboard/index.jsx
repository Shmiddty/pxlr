import React from 'react';
import Keys from './Keys';
import cfg from './config';

import '@mdi/font/css/materialdesignicons.min.css';
import './Keyboard.css';

export default function Keyboard() {
  return (
    <div className="keyboard">
      { cfg.map((Key, i) =>  <Key.component key={Key.props.code} {...Key.props} /> )}
      <Keys />
    </div>
  );
}
