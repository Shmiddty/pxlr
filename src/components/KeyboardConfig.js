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
    // this is funny, isn't it?
    [Modes[Modes.pencil]]: { code: 'KeyQ', icon: 'pencil' },
    [Modes[Modes.bucket]]: { code: 'KeyW', icon: 'format-color-fill' },
    [Modes[Modes.eraser]]: { code: 'KeyE', icon: 'eraser-variant' },
    [Modes[Modes.darken]]: { code: 'KeyA', icon: { name: 'brightness-6', flipH: true } },
    [Modes[Modes.lighten]]:{ code: 'KeyS', icon: 'brightness-6' },
    [Modes[Modes.dropper]]:{ code: 'KeyD', icon: 'eyedropper' }
  }, ({ code, icon }, name, i) => ({
    component: Mode,
    props: {
      code,
      icon,
      name,
      mode: i // TODO: maybe use mode name instead?
    }
  }))
];
