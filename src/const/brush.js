import makeEnum from '../util/makeEnum';

export const modes = [
  'pencil',
  'eraser',
  'darken',
  'lighten',
  'invert',
  'mix',
  'bucket',
  'dropper'
];

export const Modes = makeEnum(modes);

export const shapes = [
  'square',
  'circle',
  'triangle',
  'pentagon',
  'hexagon',
  'octagon'
];

shapes.push(...shapes.map(s => s + 'Outline'));

export const Shapes = makeEnum(shapes);
