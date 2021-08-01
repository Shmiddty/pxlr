import makeEnum from '../../util/makeEnum';
import { Mirror } from '../../const/brush';

export const types = makeEnum([
  "mode",
  "brush",
  "nextBrush",
  "previousBrush",
  "tool",
  "mirror",
  "size",
  "stroke",
  "rotationalSymmetry",
  "nextSymmetry",
  "previousSymmetry",
  "background"
]);


export function setBackgroundColor(color) {
  return { type: types.background, payload: color };
}

export function setMode(mode) {
  return { type: types.mode, payload: mode };
}

export function setBrush(brush) {
  return { type: types.brush, payload: brush };
}

export function nextBrush() {
  return { type: types.nextBrush };
}

export function previousBrush() {
  return { type: types.previousBrush };
}
export function activateTool(tool) {
  return { type: types.tool, payload: tool };
}

export function setMirror(mirror) {
  return { type: types.mirror, payload: mirror };
}

export function toggleMirror(name) {
  switch (name) {
    case "mirror-vertically": return setMirror(Mirror.vertical);
    case "mirror-horizontally": return setMirror(Mirror.horizontal);
    default: break;
  }
}

export function setSymmetry(degrees) {
  return { type: types.rotationalSymmetry, payload: degrees };
}

export function nextSymmetry() {
  return { type: types.nextSymmetry };
}

export function previousSymmetry() {
  return { type: types.previousSymmetry };
}

export function setSize(size) {
  return { type: types.size, payload: size };
}

export function resetSize() {
  return { type: types.size, payload: 1 };
}

export function setStroke(size) {
  return { type: types.stroke, payload: size };
}

export function resetStroke() {
  return { type: types.stroke, payload: 1 };
}
