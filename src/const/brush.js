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

export const Mirror = {
  none: 0,
  vertical: 2**0,
  horizontal: 2**1,
  both: 2**0 + 2**1,
  0: "none",
  1: "vertical",
  2: "horizontal",
  3: "both"
};

