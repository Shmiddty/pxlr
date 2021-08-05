export function vector(x, y) {
  return [x, y];
}

// adapted from matter-js
export function rotate([x, y], angle, [cx, cy] = [0, 0]) {
  const cos = Math.cos(angle),
    sin = Math.sin(angle);
  return [
    cx + (x - cx) * cos - (y - cy) * sin,
    cy + (x - cx) * sin + (y - cy) * cos,
  ];
}

export function fRotate(angle, center = [0, 0]) {
  return function (vector) {
    return rotate(vector, angle, center);
  };
}

export function add([ax, ay], [bx, by]) {
  return [ax + bx, ay + by];
}

export function fAdd(delta) {
  return function (vector) {
    return add(vector, delta);
  };
}

export function subtract([ax, ay], [bx, by]) {
  return [ax - bx, ay - by];
}

export function fSubtract(delta) {
  return function (vector) {
    return subtract(vector, delta);
  };
}

export function scale(vector, scalar) {
  return vector.map((v) => v * scalar);
}

export function fScale(scalar) {
  return function (vector) {
    return scale(vector, scalar);
  };
}
export function magnitude([x, y]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

export function unit(theta = 0) {
  return [Math.cos(theta), Math.sin(theta)];
}

export function angle([x, y]) {
  return Math.atan2(y, x);
}

export function floorEm(vector) {
  return vector.map((v) => Math.floor(v));
}

export function ceilEm(vector) {
  return vector.map((v) => Math.ceil(v));
}

export function roundEm(vector) {
  return vector.map((v) => Math.round(v));
}
