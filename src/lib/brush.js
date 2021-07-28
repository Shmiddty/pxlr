import { Modes, Shapes, Mirror } from '../const/brush';
import { 
  circle, 
  rect, 
  polygon,
  subtract, 
  mapToPoints, 
  pointsToMap,
  flip
} from '../lib/pxls';


const adj = N => 2 * Math.ceil(1 / Math.cos(Math.PI / N));

export function getBrush(position, { size, shape, mode, stroke }) {
  if ([Modes.bucket, Modes.dropper].includes(mode)) return [position];
  const [x, y] = position;
  const center = [Math.floor(x + size / 2 + 1/2), Math.floor(y + size / 2 + 1/2)];

  switch (shape) {
    case Shapes.square:
      return rect(center, size);
    case Shapes.circle:
      return circle(center, size);
    case Shapes.triangle:
      return polygon(center, size, 3);
    case Shapes.pentagon:
      return polygon(center, size, 5);
    case Shapes.hexagon:
      return polygon(center, size, 6);
    case Shapes.octagon:
      return polygon(center, size, 8);
    case Shapes.squareOutline:
      return mapToPoints(
        subtract(
          pointsToMap(rect(center, size)),
          pointsToMap(rect(center, Math.max(0, size - stroke * 2)))
        )
      );
    case Shapes.circleOutline:
      return mapToPoints(
        subtract(
          pointsToMap(circle(center, size)),
          pointsToMap(circle(center, Math.max(0, size - stroke * 2)))
        )
      );
    case Shapes.triangleOutline:
      return mapToPoints(
        subtract(
          pointsToMap(polygon(center, size, 3)),
          pointsToMap(polygon(center, Math.max(0, size - stroke * adj(3)), 3))
        )
      );
    case Shapes.pentagonOutline:
      return mapToPoints(
        subtract(
          pointsToMap(polygon(center, size, 5)),
          pointsToMap(polygon(center, Math.max(0, size - stroke * adj(5)), 5))
        )
      );
    case Shapes.hexagonOutline:
      return mapToPoints(
        subtract(
          pointsToMap(polygon(center, size, 6)),
          pointsToMap(polygon(center, Math.max(0, size - stroke * adj(6)), 6))
        )
      );
    case Shapes.octagonOutline:
      return mapToPoints(
        subtract(
          pointsToMap(polygon(center, size, 8)),
          pointsToMap(polygon(center, Math.max(0, size - stroke * adj(8)), 8))
        )
      );

    default: return [position];
  }

}

// adapted from matter-js
export function rotateVector([vx, vy], angle, [px, py] = [0, 0]) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [
    px + (vx - px) * cos - (vy - py) * sin,
    py + (vx - px) * sin + (vy - py) * cos
  ]; 
}

// return an array of points with opacities for a given point
export function explode([x, y]) {
  // Shift the coordinates by this value to avoid dealing with zeros.
  const shift = 4096;
  const x0 = x + shift, y0 = y + shift;
  const rx = x0 % 1, ry = y0 % 1;
  const bx = Math.floor(x0) - shift, by = Math.floor(y0) - shift;
  let p = [bx, by];
  p.alpha = (1-rx) * (1-ry);
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
  return Object.entries(points.reduce((o, p) => {
    return explode(p).reduce((o, p) => {
      o[p] = (o[p] || 0) + p.alpha;
      return o;
    }, o);
  }, {})).reduce((o, [p,a]) => {
    if (a < threshold) return o;
    let v = p.split(',').map(Number);
    v.alpha = a; // TODO: maybe not include this?
    o.push(v);
    return o;
  }, []);
}


export function getBrushPositions (position, { 
  mode, 
  brush, 
  size, 
  mirror, 
  width, 
  height,
  stroke,
  rotationalSymmetry: rs
}) {
  const bruhhh = getBrush(position, { mode, size, shape: brush, stroke });
  
  // TODO: this is less efficient, but more elegant. hmmmm
  const bMap = pointsToMap(bruhhh);
  const positions = [...bruhhh]
  if (mirror & Mirror.vertical) positions.push(...mapToPoints(
    flip(bMap, true, [width, height])
  )); 
  if (mirror & Mirror.horizontal) positions.push(...mapToPoints(
    flip(bMap, false, [width, height])
  ));
  if (mirror === Mirror.both) positions.push(...mapToPoints(
    flip(flip(bMap, true, [width, height]), false, [width, height])
  ));
 
  if (rs) {
    const rots = [], cx = width / 2 - 1/2, cy = height / 2 - 1/2;
    for (let theta = rs; theta < 360; theta += rs) {
      const pots = positions.map(p => rotateVector(
        p, 
        theta / 180 * Math.PI, 
        [cx, cy]
      ));
      rots.push(
        ...interpolate(pots, .44)
      );
    }
    positions.push(...rots);
  }

  return positions;
}


