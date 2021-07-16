import mr from '../../util/mapReduce';

import PaletteItem from './PaletteItem';
import Tool from './Tool';
import BrushMode from './Mode';
import BrushShape from './BrushShape';
import Mirror from './Mirror';
import RotationalSymmetry from './RotationalSymmetry';
import CanvasSize from './CanvasSize';
import BrushSize from './BrushSize';
import BackgroundColor from './BackgroundColor';
import { Modes, Shapes } from '../../const/brush';
import { Tools } from '../../const/tools';
import { Toggles } from '../../const/toggles';

export default [
  { 
    component: BackgroundColor,
    props: {
      code: "Backquote",
      icon: "image"
    }
  },
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
    'Backspace': { tool: Tools.clear, icon: 'trash-can'},
    'KeyU': { tool: Tools.undo, icon: 'undo'},
    'KeyI': { tool: Tools.redo, icon: 'redo'},
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
    component: Mirror,
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
  },
  {
    component: CanvasSize,
    props: {
      code: ['KeyP', 'BracketLeft', 'BracketRight'],
      inputProps: {
        code: 'KeyP',
        label: '',
        min: 8,
        max: 256,
        step: 8
      },
      decreaseProps: {
        code: 'BracketLeft',
        label: '',
        icon: 'image-size-select-small'
      },
      increaseProps: {
        code: 'BracketRight',
        label: '',
        icon: 'image-size-select-large'
      }
    }
  },
  {
    component: BrushSize,
    props: {
      code: ['KeyL', 'Semicolon', 'Quote'],
      inputProps: {
        code: 'KeyL',
        label: '',
        min: 1,
        step: 1,
        max: 64
      },
      decreaseProps: {
        code: 'Semicolon',
        label: '',
        icon: 'minus-thick'
      },
      increaseProps: {
        code: 'Quote',
        label: '',
        icon: 'plus-thick'
      }
    }
  }

];
