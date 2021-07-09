import mr from '../util/mapReduce';

import PaletteItem from './PaletteItem';
import Tool from './Tool';
import Mode from './Mode';
import { Modes } from '../const/brush';



// TODO: should maybe use keyCodes instead?
export default [
  ...[].map.call('1234567890', (d, i) => ({
    component: PaletteItem,
    props: {
      code: 'Digit' + d,
      index: i
    } 
  })),
  ...mr({
    [Modes.pencil]: { code: 'KeyQ', icon: 'pencil' },
    [Modes.bucket]: { code: 'KeyW', icon: 'format-color-fill' },
    [Modes.eraser]: { code: 'KeyE', icon: 'eraser-variant' },
    [Modes.darken]: { code: 'KeyA', icon: { name: 'brightness-6', flipH: true } },
    [Modes.lighten]:{ code: 'KeyS', icon: 'brightness-6' },
    [Modes.dropper]:{ code: 'KeyD', icon: 'eyedropper' }
  }, ({ code, icon }, mode) => ({
    component: Mode,
    props: {
      code,
      mode,
      icon,
      name: Modes[mode]
    }
  }))
];
