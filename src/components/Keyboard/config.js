import mr from '../../util/mapReduce';
import snek, { srs } from '../../util/snek';

import PaletteItem from './PaletteItem';
import Tool from './Tool';
import BrushMode from './Mode';
import BrushShape from './BrushShape';
import Mirror from './Mirror';
import RotationalSymmetry from './RotationalSymmetry';
import CanvasSize from './CanvasSize';
import BrushSize from './BrushSize';
import StrokeSize from './StrokeSize';
import BackgroundColor from './BackgroundColor';
import { Modes, Shapes, shapes } from '../../const/brush';
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
    'KeyD': { mode: Modes.dropper, icon: 'eyedropper' },
    'KeyZ': { mode: Modes.invert, icon: 'invert-colors' },
    'KeyX': { mode: Modes.mix, icon: 'bowl-mix' }
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
    'Minus': { tool: Tools.previousColor, icon: 'arrow-left-bold', className: "PreviousColor" },
    'Equal': { tool: Tools.nextColor,icon: 'arrow-right-bold', className: "NextColor" },
    'KeyR': { tool: Tools.rotateCounterClockwise, icon: 'format-rotate-90'},
    'KeyT': { tool: Tools.rotateClockwise, icon: { name: 'format-rotate-90', flipH: true } },
    'Backspace': { tool: Tools.clear, icon: 'trash-can'},
    'KeyU': { tool: Tools.undo, icon: 'undo'},
    'KeyI': { tool: Tools.redo, icon: 'redo'},
  }, ({ tool, icon, ...rest }, code, i) => ({
    component: Tool,
    props: {
      tool,
      code,
      icon,
      name: srs(Tools[tool]),
      ...rest
    }
  })),
  ...mr({
    'KeyV': { toggle: Toggles.mirrorVertically, icon: 'reflect-vertical' },
    'KeyB': { toggle: Toggles.mirrorHorizontally, icon: 'reflect-horizontal' }
  }, ({ toggle, icon }, code, i) => ({
    component: Mirror,
    props: {
      uid: toggle,
      code,
      icon,
      name: srs(Toggles[toggle])
    }
  })),
  {
    component: BrushShape,
    props: {
      code: 'Tab',
      options: shapes.map(s => (
        { value: Shapes[s], icon: snek(s), label: srs(s) }
      ))
    }
  },
  {
    component: RotationalSymmetry,
    props: {
      code: 'KeyC',
      icon: 'rotate-right',
      options: [0, 30, 45, 60, 90, 120, 180].map(value => ({
        value,
        label: value
      }))
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
        label: 'Smaller Image',
        icon: 'image-size-select-small'
      },
      increaseProps: {
        code: 'BracketRight',
        label: 'Bigger Image',
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
        max: 128
      },
      decreaseProps: {
        code: 'Semicolon',
        label: 'Smaller Brush',
        icon: 'pencil-minus'
      },
      increaseProps: {
        code: 'Quote',
        label: 'Bigger Brush',
        icon: 'pencil-plus'
      }
    }
  },
  {
    component: StrokeSize,
    props: {
      code: ['Comma', 'Period', 'Slash'],
      inputProps: {
        code: 'Comma',
        label: '',
        min: 1,
        step: 1,
        max: 128
      },
      decreaseProps: {
        code: 'Period',
        label: 'Smaller Stroke',
        icon: 'pencil-minus-outline'
      },
      increaseProps: {
        code: 'Slash',
        label: 'Bigger Stroke',
        icon: 'pencil-plus-outline'
      }
    }
  }


];
