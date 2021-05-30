import makeEnum from '../../util/makeEnum';

export const types = makeEnum([
  "color",
  "setPaletteColor",
  "fromPalette"
]);

export function setColor(color) {
  return { type: types.color, payload: color };
}
export function setPaletteColor(index, color) {
  return { type: types.setPaletteColor, payload: { index, color } };
}
export function setPaletteIndex(n) {
  return { type: types.fromPalette, payload: n };
}

