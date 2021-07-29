import { Modes, Shapes, Mirror } from "../const/brush";
import { circle, rect, polygon, subtractPoints, flipPoints } from "../lib/pxls";
import {
  add,
  angle,
  fAdd,
  rotate,
  subtract,
  magnitude,
  scale,
  unit,
} from "../lib/vectr";

const adj = (N) => 2 * Math.ceil(1 / Math.cos(Math.PI / N));

export const getBrush = (size, shape, stroke, orientation = 0) => {
  let points;
  switch (shape) {
    case Shapes.square:
      points = rect(size);
      break;
    case Shapes.circle:
      points = circle(size);
      break;
    case Shapes.triangle:
      points = polygon(size, 3);
      break;
    case Shapes.pentagon:
      points = polygon(size, 5);
      break;
    case Shapes.hexagon:
      points = polygon(size, 6);
      break;
    case Shapes.octagon:
      points = polygon(size, 8);
      break;
    case Shapes.squareOutline:
      points = subtractPoints(rect(size), rect(Math.max(0, size - stroke * 2)));
      break;
    case Shapes.circleOutline:
      points = subtractPoints(
        circle(size),
        circle(Math.max(0, size - stroke * 2))
      );
      break;
    case Shapes.triangleOutline:
      points = subtractPoints(
        polygon(size, 3),
        polygon(Math.max(0, size - stroke * adj(3)), 3)
      );
      break;
    case Shapes.pentagonOutline:
      points = subtractPoints(
        polygon(size, 5),
        polygon(Math.max(0, size - stroke * adj(5)), 5)
      );
      break;
    case Shapes.hexagonOutline:
      points = subtractPoints(
        polygon(size, 6),
        polygon(Math.max(0, size - stroke * adj(6)), 6)
      );
      break;
    case Shapes.octagonOutline:
      points = subtractPoints(
        polygon(size, 8),
        polygon(Math.max(0, size - stroke * adj(8)), 8)
      );
      break;

    default:
      points = [];
  }

  if (orientation)
    return interpolate(points.map((p) => rotate(p, orientation)), .44);

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
  function floorEm(vector) {
    return vector.map(v => Math.floor(v));
  }

  const pointer = add(position, [size / 2 - 1 / 2, size / 2 - 1 / 2]);
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
    const pcVec = subtract(center, pointer);
    const R = magnitude(pcVec);
    const a0 = angle(pcVec);  
    for (let theta = rs; theta < 360; theta += rs) {
      const ang = (theta / 180) * Math.PI;
      positions.push(
        ...getBrush(size, shape, stroke, ang).map(
          fAdd(add(center, scale(unit(ang + a0), -R)))
        ).map(floorEm)
      );
    }
  }

  return positions;
}
