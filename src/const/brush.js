import makeEnum from '../util/makeEnum';

export const Modes = makeEnum([
  'pencil',
  'eraser',
  'darken',
  'lighten',
  'invert',
  'mix',
  'bucket',
  'dropper'
]);

export const Shapes = makeEnum([
  'circle',
  'square'
]);
