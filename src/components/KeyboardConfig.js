import mr from '../util/mapReduce';

import PaletteItem from './PaletteItem';
import Tool from './Tool';
import BrushMode from './Mode';
import BrushShape from './BrushShape';
import Toggle from './Toggle';
import RotationalSymmetry from './RotationalSymmetry';
import { Modes, Shapes } from '../const/brush';
import { Tools } from '../const/tools';
import { Toggles } from '../const/toggles';

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
    'KeyQ': { mode: Modes.pencil, icon: 'pencil' },
    'KeyW': { mode: Modes.bucket, icon: 'format-color-fill' },
    'KeyE': { mode: Modes.eraser, icon: 'eraser-variant' },
    'KeyA': { mode: Modes.darken, icon: {name:'brightness-6', flipH:true} },
    'KeyS': { mode: Modes.lighten, icon: 'brightness-6' },
    'KeyD': { mode: Modes.dropper, icon: 'eyedropper' }
  }, ({ mode, icon }, code, i) => ({
    component: BrushMode,
    props: {
      code,
      icon,
      mode,
      name: Modes[mode]
    }
  })),
  ...mr({
    'KeyF': { tool: Tools.flipVertically, icon: 'flip-vertical' },
    'KeyG': { tool: Tools.flipHorizontally,  icon: 'flip-horizontal'},
    'Minus': { tool: Tools.previousColor, icon: 'arrow-left-bold' },
    'Equal': { tool: Tools.nextColor,icon: 'arrow-right-bold'},
    'KeyR': { tool: Tools.rotateCounterClockwise, icon: 'format-rotate-90'},
    'KeyT': { tool: Tools.rotateClockwise, icon: { name: 'format-rotate-90', flipH: true } },
    'BracketLeft': { tool: Tools.decreaseCanvasSize, icon: 'image-size-select-small'},
    'BracketRight': { tool: Tools.increaseCanvasSize, icon: 'image-size-select-large'},
    'Backspace': { tool: Tools.clear, icon: 'trash-can'},
    'KeyU': { tool: Tools.undo, icon: 'undo'},
    'KeyI': { tool: Tools.redo, icon: 'redo'},
    'Semicolon': { tool: Tools.decreaseBrushSize, icon: 'minus-thick'},
    'Quote': { tool: Tools.increaseBrushSize, icon: 'plus-thick'}
  }, ({ tool, icon }, code, i) => ({
    component: Tool,
    props: {
      tool,
      code,
      icon,
      name: Tools[tool]
    }
  })),
  ...mr({
    'KeyZ': { toggle: Toggles.mirrorVertically, icon: 'reflect-vertical' },
    'KeyX': { toggle: Toggles.mirrorHorizontally, icon: 'reflect-horizontal' }
  }, ({ toggle, icon }, code, i) => ({
    component: Toggle,
    props: {
      uid: toggle,
      code,
      icon,
      name: Toggles[toggle]
    }
  })),
  {
    component: BrushShape,
    props: {
      code: 'Tab',
      options: [
        { shape: Shapes.square, icon: 'square-outline', label: 'Square' },
        { shape: Shapes.circle, icon: 'circle-outline', label: 'Circle' }
      ]
    }
  },
  {
    component: RotationalSymmetry,
    props: {
      code: 'KeyC',
      icon: 'rotate-right',
      options: [0, 30, 45, 60, 90, 120, 180]
    }
  }
];
