import makeEnum from '../../util/makeEnum';
import { MIRROR } from './tools';

export const types = makeEnum([
  "mode",
  "brush",
  "nextBrush",
  "tool",
  "mirror",
  "size",
  "rotationalSymmetry",
  "nextSymmetry",
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

export function activateTool(tool) {
  return { type: types.tool, payload: tool };
}

export function setMirror(mirror) {
  return { type: types.mirror, payload: mirror };
}

export function toggleMirror(name) {
  switch (name) {
    case "mirror-vertically": return setMirror(MIRROR.VERTICAL);
    case "mirror-horizontally": return setMirror(MIRROR.HORIZONTAL);
    default: break;
  }
}

export function setSymmetry(degrees) {
  return { type: types.rotationalSymmetry, payload: degrees };
}

export function nextSymmetry() {
  return { type: types.nextSymmetry };
}

export function setSize(size) {
  return { type: types.size, payload: size };
}

export function resetSize() {
  return { type: types.size, payload: 1 };
}
