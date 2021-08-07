import { Shapes, Mirror } from "../const/brush";
import {
  circle,
  rect,
  poly as polygon,
  subtractPoints,
  flipPoints,
} from "../lib/pxls";
import { add, fAdd, rotate, scale, floorEm, roundEm } from "../lib/vectr";

const adj = (N) => 2 * Math.ceil(1 / Math.cos(Math.PI / N));

const numSides = {
  [Shapes.circle]: 360,
  [Shapes.circleOutline]: 360,
  [Shapes.triangle]: 3,
  [Shapes.triangleOutline]: 3,
  [Shapes.square]: 4,
  [Shapes.squareOutline]: 4,
  [Shapes.pentagon]: 5,
  [Shapes.pentagonOutline]: 5,
  [Shapes.hexagon]: 6,
  [Shapes.hexagonOutline]: 6,
  [Shapes.octagon]: 8,
  [Shapes.octagonOutline]: 8,
};

export const getBrush = (size, shape, stroke, orientation = 0) => {
  let points,
    n = numSides[shape];
  switch (shape) {
    case Shapes.circle:
      points = circle(size);
      break;
    case Shapes.square:
    case Shapes.triangle:
    case Shapes.pentagon:
    case Shapes.hexagon:
    case Shapes.octagon:
      points = polygon(size, n, orientation);
      break;
    case Shapes.circleOutline:
      points = subtractPoints(
        circle(size),
        circle(Math.max(0, size - stroke * 2))
      );
      break;
    case Shapes.squareOutline:
    case Shapes.triangleOutline:
    case Shapes.pentagonOutline:
    case Shapes.hexagonOutline:
    case Shapes.octagonOutline:
      points = subtractPoints(
        polygon(size, n, orientation),
        polygon(Math.max(0, size - stroke * adj(n)), n, orientation)
      );
      break;
    default:
      points = [];
  }

  return points;
};

// return an array of points with opacities for a given point
export function explode([x, y]) {
  // Shift the coordinates by this value to avoid dealing with zeros.
  const shift = 4096;
  const x0 = x + shift,
    y0 = y + shift;
  const rx = x0 % 1,
    ry = y0 % 1;
  const bx = Math.floor(x0) - shift,
    by = Math.floor(y0) - shift;
  let p = [bx, by];
  p.alpha = (1 - rx) * (1 - ry);
  const out = [p];
  if (rx > 0) {
    p = [bx + 1, by];
    p.alpha = rx * (1 - ry);
    out.push(p);
  }

  if (ry > 0) {
    p = [bx, by + 1];
    p.alpha = (1 - rx) * ry;
    out.push(p);
  }

  if (rx > 0 && ry > 0) {
    p = [bx + 1, by + 1];
    p.alpha = rx * ry;
    out.push(p);
  }

  return out;
}

// TODO: moar efficient
// TODO: threshold here might be an anti-pattern
export function interpolate(points, threshold = 0.5) {
  return Object.entries(
    points.reduce((o, p) => {
      return explode(p).reduce((o, p) => {
        o[p] = (o[p] || 0) + p.alpha;
        return o;
      }, o);
    }, {})
  ).reduce((o, [p, a]) => {
    if (a < threshold) return o;
    let v = p.split(",").map(Number);
    o.push(v);
    return o;
  }, []);
}

export function getBrushPositions(
  position,
  {
    mode,
    brush: shape,
    size,
    mirror,
    width,
    height,
    stroke,
    rotationalSymmetry: rs,
  }
) {
  const cAdj = scale([1, 1], (size % 2) / 2);
  const pointer = add(position, add(cAdj, scale([1, 1], size / 2)));
  const brush = getBrush(size, shape, stroke).map(fAdd(pointer)).map(floorEm);

  const positions = [...brush];
  if (mirror & Mirror.vertical)
    positions.push(...flipPoints(brush, true, [width, height]));
  if (mirror & Mirror.horizontal)
    positions.push(...flipPoints(brush, false, [width, height]));
  if (mirror === Mirror.both)
    positions.push(
      ...flipPoints(flipPoints(brush, true, [width, height]), false, [
        width,
        height,
      ])
    );

  if (rs) {
    const center = [width / 2, height / 2];
    for (let theta = rs; theta < 360; theta += rs) {
      const ang = (theta / 180) * Math.PI;
      positions.push(
        ...getBrush(size, shape, stroke, ang)
          .map(fAdd(rotate(pointer, ang, center)))
          .map(roundEm)
      );
    }
  }

  return positions;
}
