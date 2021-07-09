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

function Brush({ 
  mode = Modes.pencil, 
  shape = Shapes.square,
  size = 1,
  color = "#000"
}) {
  
}
  
