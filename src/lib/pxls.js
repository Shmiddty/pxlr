import memo from "../util/memo";
import { bfs } from "../util/search";
import * as V from './vectr';

export const rect = memo((width, height = width) => {
  const out = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      out.push([Math.floor(x - width / 2), Math.floor(y - height / 2)]);
    }
  }
  return out;
});

export const circle = memo((diameter) => {
  const out = [],
    radius = diameter / 2;
  for (let y = 0; y < diameter; y++) {
    for (let x = 0; x < diameter; x++) {
      const px = x - radius + 1 / 2,
        py = y - radius + 1 / 2;
      if (px ** 2 + py ** 2 < radius ** 2)
        out.push([Math.floor(x - radius), Math.floor(y - radius)]);
    }
  }
  return out;
});

// TODO: there might be an issue with this method. 
// when n = 4, sometimes a larger diameter results in a smaller brush than does a smaller diameter. 
export const polygon = memo((diameter, n, orientation = 0) => {
  const out = [],
    radius = diameter / 2,
    d = (2 * Math.PI) / n;
  const h = radius * Math.cos(d / 2);

  for (let y = 0; y < diameter; y++) {
    for (let x = 0; x < diameter; x++) {
      const px = x - radius,
        py = y - radius;
      const theta = Math.abs(
        (((9 / 2) * Math.PI - orientation + Math.atan2(py, px)) % d) - d / 2
      );
      const R = h / Math.cos(theta);
      if (px ** 2 + py ** 2 <= R ** 2)
        out.push([Math.floor(x - radius), Math.floor(y - radius)]);
    }
  }
  return out;
});

// y = mx + b
function intersection([m0, b0], [m1, b1]) {
  if (m0 === m1) {
    if (b0 !== b1) return null;
    return Infinity;
    // TODO: What's the best way to indicate that it 
    // intersects at all x positions?
  }
 
  const y = (m1 * b0 - m0 * b1) / (m1 - m0);
  const x = (y - b0) / m0;
  return [x, y]; 
}

function getLine(p0, p1) {
  const [dx, dy] = V.subtract(p0, p1);
  const m = dx ? dy / dx : Infinity;
  const [x, y] = p0;
  const b = y - m * x;
  return [m, b];
}

export const rayPoly = memo((diameter, n, orientation = 0) => {
  const segments = [];
  const radius = Math.floor(diameter / 2);
  const deltaTheta = (2 * Math.PI) / n;
  let lastPoint = V.scale(V.unit(orientation), radius);
  for (let i = 1; i <= n; i++) {
    const point = V.rotate(lastPoint, deltaTheta);
    segments.push([lastPoint, lastPoint = point]);
  }
  console.log(segments);
  const points = [];
  for (let y = 0; y < diameter; y++) {
    let intersections = segments
      .map(s => {
        let intersect = intersection(getLine(...s), [0, y - radius]);
        let [[ax, ay], [bx, by]] = s
          , [minX, maxX] = ax < bx ? [ax, bx] : [bx, ax]
          , [minY, maxY] = ay < by ? [ay, by] : [by, ay];

        // I think this is covered by other cases
        if (intersect === Infinity) return false;
        if (intersect === null) return false;

        let [ix, iy] = intersect;
        if (ix >= minX && ix <= maxX && iy >= minY && iy <= maxY) 
          return intersect
        
        return false;
      })
      .filter(Boolean)
      .sort(([ax], [bx]) => ax - bx)
    if (intersections.length === 2) {
      let [[ax], [bx]] = intersections;
      ax = Math.round(ax);
      bx = Math.round(bx);
      const rowPoints = [];
      for (let x = ax; x <= bx; x++) {
        rowPoints.push([x, y - radius]);
      }
      points.push(...rowPoints);
    }
  }
  return points;
});

rayPoly(9, 6, Math.PI / 4);

export function add(a, b) {
  return Object.assign({}, a, b);
}

export function subtract(a, b) {
  const copy = Object.assign({}, a);
  Object.keys(b).forEach((k) => delete copy[k]);
  return copy;
}
export function subtractPoints(a, b) {
  const bMap = pointsToMap(b);
  return a.filter((p) => !bMap[p]);
}

export function keyToPoint(key) {
  return key.split(",").map(Number);
}

export function pointsToMap(points, mapPoint = (I) => 1) {
  return points.reduce((o, p) => {
    o[p] = mapPoint(p);
    return o;
  }, {});
}

export function mapToPoints(map) {
  return Object.keys(map).map(keyToPoint);
}

/**
 * flattenPxls - convert pxls into flat array
 * pxls
 * width
 * height
 */
export function flattenPxls(pxls, width, height = width) {
  const out = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      out.push(pxls[[x, y]] || 0);
    }
  }
  return out;
}

/**
 * pxlsToColorMap - convert { [position]: color } to { [color]: ]positions] }
 * pxls
 */
export function pxlsToColorMap(pxls) {
  return Object.entries(pxls).reduce((o, [pos, col]) => {
    (o[col] || (o[col] = [])).push(pos);
    return o;
  }, {});
}

/**
 * colorMapToPxls - convert { [color]: [positions] } to { [position]: color }
 * colorMap
 */
export function colorMapToPxls(colorMap) {
  return Object.entries(colorMap).reduce(
    (o, [color, positions]) =>
      positions.reduce((o, p) => {
        o[p] = color;
        return o;
      }, o),
    {}
  );
}

/**
 * rotate - rotate pxls about the center
 * pxls
 * clockwise - <true>
 * dimensions - [width, height]
 */
export function rotate90(pxls, cw = true, [width, height]) {
  return Object.entries(pxls).reduce((o, [key, val]) => {
    let [x, y] = key.split(",").map(Number);
    let pos = cw ? [height - y - 1, x] : [y, width - x - 1];
    o[pos] = val;
    return o;
  }, {});
}

/**
 * flip - rotate pxls about the center
 * pxls
 * vertical - <true> flip about the vertical axis (otherwise the horizontal)
 * dimensions - [width, height]
 */
export function flip(pxls, vertical = false, [width, height]) {
  return Object.entries(pxls).reduce((o, [key, val]) => {
    let [x, y] = key.split(",").map(Number);
    let pos = [!vertical ? width - x - 1 : x, !vertical ? y : height - y - 1];
    o[pos] = val;
    return o;
  }, {});
}

export function flipPoints(points, vertical = false, [width, height]) {
  return points.map(([x, y]) => [
    !vertical ? width - x - 1 : x,
    !vertical ? y : height - y - 1,
  ]);
}

/**
 * fill - fill the contiguous area about the position with the color
 * pxls
 * position
 * color
 * dimensions - [width, height]
 */
export function fill(pxls, position, color, [width, height]) {
  let init = pxls[position];
  return bfs(
    position,
    ([x, y]) => [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
    ],
    ([x, y]) =>
      x >= 0 && x < width && y >= 0 && y < height && pxls[[x, y]] === init
  ).reduce((o, pos) => {
    o[pos] = color;
    return o;
  }, Object.assign({}, pxls));
}
