import { palette, modes, toggles, tools } from '../config/tools';
import { setMode, toggleMirror, activateTool, resetSize, nextBrush } from '../config/actions';
import { resetSize as resetCanvasSize } from '../canvas/actions';
import { setPaletteIndex } from '../palette/actions';

export default {
  ...palette.reduce((o, { key, index }) => {
    if (key === '`') o[key] = { type: 'toggle-color-picker' };
    else o[key] = setPaletteIndex(index);
    return o;
  }, {}),
  ...modes.reduce((o, { key }, i) => {
    o[key] = setMode(i);
    return o;
  }, {}),
  ...toggles.reduce((o, { name, key }, i) => {
    o[key] = toggleMirror(name);
    return o;
  }, {}),
  ...tools.reduce((o, { name, key }, i) => {
    o[key] = activateTool(name);
    return o;
  }, {}),
  l: resetSize(),
  p: resetCanvasSize(),
  'Tab': nextBrush()
};
