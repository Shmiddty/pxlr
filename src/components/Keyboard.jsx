import React from 'react';
import Palette from './Palette';
import Brushes from './Brushes';
import Modes from './Modes';
import Toggles from './Toggles';
import Tools from './Tools';
import Keys from './Keys';
import Sizes from './Sizes';
import RotationalSymmetry from './RotationalSymmetry';
import cfg from './KeyboardConfig';

import '@mdi/font/css/materialdesignicons.min.css';
import './Keyboard.css';

export default function Keyboard() {
  return (
    <div className="keyboard">
      <Keys />
      { cfg.map((Key, i) => 
      <Key.component key={i} {...Key.props} />
      )}
      {/*
      <Palette />
      <Brushes />
      <Modes />
      <Toggles />
      <RotationalSymmetry />
      <Tools />
      <Sizes />
      */}
    </div>
  );
}
