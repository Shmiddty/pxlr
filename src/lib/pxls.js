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

