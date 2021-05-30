import makeEnum from '../../util/makeEnum';

export const types = makeEnum([
  "pixelClicked",
  "resize",
  "resetSize",
  "bucket",
  "setPxl",
  "setPxls",
  "clearPxl",
  "clearPxls"
]);

export function pixelClicked(pos) {
  return { type: types.pixelClicked, payload: pos };
}

export function resize(side) {
  return { type: types.resize, payload: side };
}

export function resetSize() {
  return { type: types.resetSize };
}

export function bucket(position, color) {
  return { type: types.bucket, payload: { position, color } };
}

export function setPxl(position, color) {
  return { type: types.setPxl, payload: { [position]: color } };
}

export function setPxls(pxls) {
  return { type: types.setPxls, payload: pxls };
}

export function clearPxl(position) {
  return { type: types.clearPxl, payload: position };
}

export function clearPxls(positions) {
  return { type: types.clearPxls, payload: positions };
}
