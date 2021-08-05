import chunk from "lodash/chunk";
import memo from "../util/memo";
import { bfs } from "../util/search";

/**
 * Return a collection of points representing the pixels in a rectangle
 * of the specified size.
 *
 * width - the width of the rectangle
 * height - the height of the rectangle
 */
export const rect = memo((width, height = width) => {
  const out = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      out.push([Math.floor(x - width / 2), Math.floor(y - height / 2)]);
    }
  }
  return out;
});

/**
 * Return a collection of points representing the pixels in a circle
 * of the specified diameter.
 *
 * diameter - the diameter of the circle
 */
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

/**
 * Return an array of points representing the pixels in regular polygon
 * with the specified diameter, number of sides, and orientation.
 *
 * diameter - twice the length from the center to one of the points
 * n - number of sides/points
 * ori - the angle offset
 */
export const polygon = memo((diameter, n, ori = 0) => {
  const out = [],
    radius = diameter / 2,
    d = (2 * Math.PI) / n;
  const h = radius * Math.cos(d / 2);

  for (let y = 0; y < diameter; y++) {
    for (let x = 0; x < diameter; x++) {
      const px = x - radius,
        py = y - radius;
      const theta = Math.abs(
        (((7 / 2) * Math.PI + d / 2 - ori + Math.atan2(py, px)) % d) - d / 2
      );
      const R = h / Math.cos(theta);
      if (px ** 2 + py ** 2 <= R ** 2)
        out.push([Math.floor(x - radius), Math.floor(y - radius)]);
    }
  }
  return out;
});

/**
 * Add/Merge two pxl maps together. Values in both a and b will be
 * replaced by b.
 *
 * a - the base pxl map
 * b - the pxl map to layer on top of a
 */
export function add(a, b) {
  return Object.assign({}, a, b);
}

/**
 * Subtract the keys of b from the keys of a
 */
export function subtract(a, b) {
  const copy = Object.assign({}, a);
  Object.keys(b).forEach((k) => delete copy[k]);
  return copy;
}

/**
 * Given two collections of points, remove from the first collection
 * the points found in the second collection.
 */
export function subtractPoints(a, b) {
  const bMap = pointsToMap(b);
  return a.filter((p) => !bMap[pointToKey(p)]);
}

/**
 * Returns a function that will convert the index from a 1d imageData
 * into a 2d point
 *
 * width - the width of the 2d image
 */
export function indexToPoint(width) {
  return function (index) {
    return [index % width, Math.floor(index / width)];
  };
}

/**
 * Returns a function that will convert a 2d point into the
 * corresponding index from a 1d imageData
 *
 * width - the width of the 2d image
 */
export function pointToIndex(width) {
  return function ([x, y]) {
    return y * width + x;
  };
}

/**
 * Converts a 2d point into a key for use in an object map
 */
export function keyToPoint(key) {
  return key.split(",").map(Number);
}

/**
 * Converts the key from an object map into a 2d point
 */
export function pointToKey(point) {
  return point.toString();
}

/**
 * Convert a collection of 2d points into an object map
 *
 * points - the collection of points
 * mapPoint - Function - a mapping function for each point
 */
export function pointsToMap(points, mapPoint = (I) => 1) {
  return points.reduce((o, p) => {
    o[pointToKey(p)] = mapPoint(p);
    return o;
  }, {});
}

/**
 * Convert an object map into a collection of points
 *
 * map - the map to convert
 */
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
      out.push(pxls[pointToKey([x, y])] || 0);
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
        o[pointToKey(p)] = color;
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
    let [x, y] = keyToPoint(key);
    let pos = cw ? [height - y - 1, x] : [y, width - x - 1];
    o[pointToKey(pos)] = val;
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
    let [x, y] = keyToPoint(key);
    let pos = [!vertical ? width - x - 1 : x, !vertical ? y : height - y - 1];
    o[pointToKey(pos)] = val;
    return o;
  }, {});
}

/**
 * Flip the given points about the specified central axis in the
 * given rectangle.
 *
 * points - the points to flip
 * vertical - Boolean - true to flip vertically, false for horizontally
 * rect - [width, height]
 */
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
  let init = pxls[pointToKey(position)];
  return Object.assign(
    pointsToMap(
      bfs(
        position,
        ([x, y]) => [
          [x, y - 1],
          [x, y + 1],
          [x - 1, y],
          [x + 1, y],
        ],
        ([x, y]) =>
          x >= 0 &&
          x < width &&
          y >= 0 &&
          y < height &&
          pxls[pointToKey([x, y])] === init
      ),
      () => color
    ),
    Object.assign({}, pxls)
  );
}

export function imageDataToPxls({ data, width, height }) {
  return chunk(data, 4).reduce((o, [r, g, b, a], i) => {
    let x = i % width,
      y = Math.floor(i / width);
    if (a === 0) return o;

    o[pointToKey([x, y])] = [r, g, b, a].reduce(
      (o, v) => o + v.toString(16).padStart(2, "0"),
      "#"
    );
    return o;
  }, {});
}

// TODO: I think could also support translations fairly simply by adding an offset member with the type point. Would need to adjust the indexToPoint and pointToIndex calls to account for the offset. Negative indices could be problematic.
export default class Pxls extends Array {
  constructor(width, height = width) {
    super(width * height);
    this.width = width;
    this.height = height;
    this.__p2i = pointToIndex(width);
    this.__i2p = indexToPoint(width);
  }

  get(point) {
    return this[this.__p2i(point)];
  }

  set(point, color) {
    // TODO: if color is empty or transparent, should I delete instead of setting?
    this[this.__p2i(point)] = color;
    return this;
  }

  union(pxls) {
    pxls.flatten().forEach(([point, color]) => this.set(point, color));
    return this;
  }

  difference(pxls, symmetric = false) {
    if (symmetric) {
      pxls.flatten().forEach(([point, color]) => {
        if (this.get(point)) this.clear(point);
        else this.set(point, color);
      });
    } else this.remove(pxls.flatten());
    return this;
  }

  clear(point) {
    delete this[this.__p2i(point)];
    return this;
  }

  remove(points) {
    points.forEach((point) => this.clear(point));
    return this;
  }

  // Flip about a central axis
  // TODO: there's some name confusion here
  // as the idiom seems to be that flipping horizontally is a
  // reflection on the vertical axis
  flip(vertical = false) {
    // TODO: is slice necessary to not cause weirdness by mutating it while enumerating it?
    this.slice().forEach((color, i) => {
      const [x, y] = this.__i2p(i);
      const pt = [
        !vertical ? this.width - x - 1 : x,
        !vertical ? y : this.height - y - 1,
      ];
      this[this.__p2i(pt)] = color;
    });
    return this;
  }

  // Rotate 90 degrees
  turn(clockwise = true) {
    this.slice().forEach((color, i) => {
      let [x, y] = this.__i2p(i);
      let pos = clockwise ? [this.height - y - 1, x] : [y, this.width - x - 1];
      this[this.__p2i(pos)] = color;
    });
    return this;
  }

  // TODO: better name... Serialize maybe?
  flatten() {
    return this.map((c, i) => [this.__i2p(i), c]).filter(Boolean);
  }

  // how should this work?
  // if b is a subset of a, what should the resulting width/height be?
  // should the points be offset by the relative position of b within a?
  // could have the width/height be the larger of the two in cases where they differ.
  // or could calculate the width/height after the difference has been found
  static intersection(a, b) {
    throw new Error("Not implemented");
  }

  static fromFlat(arr, width, height) {
    if (!width) width = Math.max(...arr.map(([[x]]) => x)) + 1;
    if (!height) height = width;

    return arr.reduce((o, args) => o.set(...args), new Pxls(width, height));
  }

  static fromImageData({ data, width, height }) {
    return chunk(data, 4).reduce((o, [r, g, b, a], i) => {
      if (a === 0) return o;
      o[i] = [r, g, b].reduce(
        (o, v) => o + v.toString(16).padStart(2, "0"),
        "#"
      );
      return o;
    }, new Pxls(width, height));
  }
}
