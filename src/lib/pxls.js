import { bfs } from '../util/search';

export function rect([cx, cy], height, width = height) {
  const out = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      out.push([
        Math.floor(cx - width / 2 + x),
        Math.floor(cy - height / 2 + y)
      ]);
    }
  }
  return out;
}

export function circle([cx, cy], diameter) {
  const out = [], radius = diameter / 2;
  for (let y = 0; y < diameter; y++) {
    for (let x = 0; x < diameter; x++) {
      const px = x - radius + 1/2
        , py = y - radius + 1/2;
      if (px**2 + py**2 < radius**2) out.push([
        Math.floor(cx - radius + x), 
        Math.floor(cy - radius + y)
      ]);
    }
  }
  return out;
}

export function polygon([cx, cy], radius, n) {
  // TODO
}

export function add(a, b) {
  return Object.assign({}, a, b);
}

export function subtract(a, b) {
  const copy = Object.assign({}, a);
  Object.keys(b).forEach(k => delete copy[k]);
  return copy;
}

export function keyToPoint(key) {
  return key.split(',').map(Number);
}

export function pointsToMap(points, mapPoint = I=>1) {
  return points.reduce((o, p) => (o[p] = mapPoint(p), o), {}); 
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
      out.push(pxls[[x,y]] || 0);
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
  return Object.entries(colorMap).reduce((o, [color, positions]) => 
    positions.reduce((o, p) => (o[p] = color, o), o)
  , {});
}

/**
 * rotate - rotate pxls about the center
 * pxls
 * clockwise - <true>
 * dimensions - [width, height]
 */
export function rotate90(pxls, cw = true, [width, height]) {
  return Object.entries(pxls).reduce((o, [key, val]) => {
      let [x,y] = key.split(',').map(Number);
      let pos = cw
        ? [height - y - 1, x]
        : [y, width - x - 1];
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
    let [x, y] = key.split(',').map(Number);
    let pos = [
      !vertical ? width - x - 1 : x,
      !vertical ? y : height - y - 1
    ];
    o[pos] = val;
    return o;
  }, {});
};

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
    ([x,y]) => [
      [x, y-1],
      [x, y+1],
      [x-1, y],
      [x+1, y]
    ],
    ([x,y]) => (
      x >= 0 && 
      x < width && 
      y >= 0 && 
      y < height && 
      pxls[[x,y]] === init
    )
  ).reduce((o, pos) => {
    o[pos] = color;
    return o;
  }, Object.assign({}, pxls));
}
