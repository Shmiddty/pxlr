import React, { Component } from 'react';
import { connect } from 'react-redux';
import Color from 'color';
import debounce from 'lodash/debounce';
import { setColor, setPaletteIndex } from '../store/palette/actions';
import { setPxls, bucket } from '../store/canvas/actions';
import { MIRROR } from '../store/config/tools';
import { Modes, Shapes } from '../const/brush';
import "./Canvas.css";
import Icon from './Icon';

const modeIconSize = 32;

function magSqr([x,y]) {
  return x**2 + y**2;
}

// adapted from matter-js
function rotateVector([vx, vy], angle, [px, py] = [0, 0]) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [
    px + (vx - px) * cos - (vy - py) * sin,
    py + (vx - px) * sin + (vy - py) * cos
  ]; 
}

// return an array of points with opacities for a given point
function explode([x, y]) {
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
function interpolate(points, threshold = 0.5) {
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

function getBrushPositions (position, { 
  mode, 
  brush, 
  size, 
  mirror, 
  width, 
  height,
  rotationalSymmetry: rs
}) {
  if ([Modes.bucket, Modes.dropper].includes(mode)) return [position];
  
  let [px, py] = position;
  let positions = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let [x, y] = [px + j, py + i];
      let r = size / 2;
      let a = j - size / 2 + 1/2, b = i - size / 2 + 1/2;
      if (
        brush === Shapes.square || 
        (brush === Shapes.circle && magSqr([a, b]) < r**2)
      ) {
        positions.push(...[
          [x, y], 
          mirror & MIRROR.VERTICAL && [x, height - y - 1],
          mirror & MIRROR.HORIZONTAL && [width - x - 1, y],
          mirror === MIRROR.BOTH && [width - x - 1, height - y - 1]
        ].filter(Boolean));
      }
    }
  }

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

export class Canvas extends Component {
  constructor (props) {
    super(props);
    this.bg = React.createRef();
    this.canvas = React.createRef();
    this.cursor = React.createRef();
    this.mode = React.createRef();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUpdate = this.handlePointerUpdate.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);

    this.dbPointerUp = debounce(this.handlePointerUp, 250);

    this.pxlCache = {};
    this._mouse = null;
    this._lastMouse = null;
  }

  updateCanvasProps() {
    this._ctx = this.canvas.current.getContext('2d');
    this._bgCtx = this.bg.current.getContext('2d');
    this._cursorCtx = this.cursor.current.getContext('2d');
    const { width, height } = this.canvas.current.getBoundingClientRect();
    this._width = width;
    this._height = height;
  }

  componentDidMount() {
    this.updateCanvasProps();
    this.paintPxls();
    this.paintBg();

    const can = this.canvas.current;
    can.addEventListener("pointerdown", this.handlePointerDown);
    can.addEventListener("pointerrawupdate", this.handlePointerUpdate);
    can.addEventListener("pointerup", this.handlePointerUp);
    can.addEventListener("pointerleave", this.handlePointerLeave);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.af);
    cancelAnimationFrame(this.baf);
    cancelAnimationFrame(this.maf);
    
    const can = this.canvas.current;
    can.removeEventListener("pointerdown", this.handlePointerDown);
    can.removeEventListener("pointerrawupdate", this.handlePointerUpdate);
    can.removeEventListener("pointerup", this.handlePointerUp);
    can.removeEventListener("pointerleave", this.handlePointerLeave);
  }
  componentDidUpdate({ size, pxls, width, mode, brush, mirror }) {
    if (width !== this.props.width || pxls !== this.props.pxls) {
      cancelAnimationFrame(this.af);
      this.af = requestAnimationFrame(() => this.paintPxls());
    }
    
    if (width !== this.props.width) {
      cancelAnimationFrame(this.baf);
      this.baf = requestAnimationFrame(() => this.paintBg());
    }

    // TODO: may need to revisit this
    this.paintCursor(true)
  }

  handlePointerDown (e) {
    if (e.which === 3) return; // right click
    this._down = true;
    this._moved = false;
  }
  handlePointerUp (e) {
    if (!this._down) return; // click outside of canvas

    this.dbPointerUp.cancel();
    
    if (this._moved) {
      this.props.updatePxls(this.pxlCache, this.props);
    }
    else {
      this.apply([e.offsetX, e.offsetY], false); // already a nativeEvent
    }

    this.pxlCache = {};
    this._moved = this._down = false;
  }
  handlePointerUpdate (e) {
    if (e.pointerType === "touch") this.dbPointerUp(e);

    this._mouse = [e.offsetX, e.offsetY];
    this._moved = true;
    if (this._down && e.target === this.canvas.current) 
      this.apply([e.offsetX, e.offsetY], true);

    cancelAnimationFrame(this.maf);
    this.maf = requestAnimationFrame(() => this.paintCursor());
  }
  handlePointerLeave (e) {
    this._mouse = null;
    this.paintCursor();
  }

  pointerToPos ([ offsetX, offsetY ]) {
    const { 
      width: cols, 
      height: rows,
      mode,
      size
    } = this.props;
    const isSinglePixelMode = [Modes.bucket, Modes.dropper].includes(mode);
    const s = isSinglePixelMode ? 1 : size;
    return [
      Math.floor(offsetX / this._width * cols - s/2),
      Math.floor(offsetY / this._height * rows - s/2)
    ];
  }

  apply (pointer, multi = false) {
    const { 
      pixelClicked, 
      getPxls
    } = this.props;
    const pos = this.pointerToPos(pointer);

    if (multi) {
      const newPxls = getPxls(pos, this.props);
      this.pxlCache = Object.assign(
        {}, 
        this.pxlCache, 
        newPxls
      );
      cancelAnimationFrame(this.paf);
      this.paf = requestAnimationFrame(() => this.paintPxls(this.pxlCache));
    } else {
      pixelClicked(pos, this.props);
    }
  }
  getPxls() {
    return Object.assign({}, this.props.pxls, this.pxlCache)
  }

  paintBg() {
    const { width, height } = this.props;
    const ctx = this._bgCtx;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#7777";
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if ((x % 2) + (y % 2) === 1) { 
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  paintPxls(newPxls) {
    const { width, height } = this.props; 
    const pxls = newPxls || this.getPxls();
    const ctx = this._ctx;

    if (!newPxls) ctx.clearRect(0, 0, width, height);
    
    Object.entries(pxls).forEach(([pos, color]) => {
      let [x, y] = pos.split(',').map(Number);
      if (!color) return ctx.clearRect(x, y, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  }

  paintCursor(clearAll) {
    const { width, size, mode } = this.props;
    const ctx = this._cursorCtx;
    const rat = this._width / width;
    
    if (!clearAll && this._lastMouse) {
      getBrushPositions(this.pointerToPos(this._lastMouse), this.props)
        .forEach(([x,y]) => 
          ctx.clearRect(x, y, 1, 1)
        );
    } else ctx.clearRect(0, 0, width, width);

    if (this._mouse) {
      this._lastMouse = this._mouse;

      const pos = this.pointerToPos(this._mouse); 
      const [x, y] = pos.map(c => c * rat);

      // TODO: maybe show darken/lighten as well?
      ctx.fillStyle = mode === Modes.pencil
        ? this.props.color
        : "#7777"
        ;

      getBrushPositions(pos, this.props).forEach(([x,y]) => {
        ctx.fillRect(x, y, 1, 1);
      });
      
      let s = [Modes.bucket, Modes.dropper].includes(mode)
        ? rat
        : size * rat
        ;
      
      const modeIcon = this.mode.current;
      modeIcon.style.transform = `translate(${ x + s }px, ${ y - modeIconSize }px)`;
    }
  }

  render () {
    const { width, height } = this.props;
    let modeIcon;
    switch (this.props.mode) {
      case Modes.pencil: modeIcon = 'pencil';break;
      case Modes.bucket: modeIcon = 'format-color-fill'; break;
      case Modes.eraser: modeIcon = 'eraser-variant'; break;
      case Modes.darken: modeIcon = 'brightness-6 mdi-flip-h'; break;
      case Modes.lighten: modeIcon = 'brightness-6'; break;
      case Modes.dropper: modeIcon = 'eyedropper'; break;
      default: break;
    }
    return (
      <div id="container">
        <canvas
          id="background"
          ref={this.bg}
          width={width}
          height={height}
        />
        <canvas
          id="canvas"
          ref={this.canvas}
          width={width}
          height={height}
        />
        <canvas
          id="cursor"
          ref={this.cursor}
          width={width}
          height={height}
        />
        <span id="mode" ref={this.mode}>
          <Icon name={modeIcon} />
        </span>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.canvas,
    ...state.config,
    ...state.palette,
    color: state.palette.palette[state.palette.paletteIndex]
  }),
  dispatch => ({
    getPxls: function(position, props) {
      const { 
        mode,
        color, 
        pxls
      } = props;
      return getBrushPositions(position, props).reduce((o, p) => {
        switch (mode) {
          case Modes.pencil:
            o[p] = color;
            break;
          case Modes.eraser:
            o[p] = null;
            break;
          case Modes.darken:
            if (pxls[p]) o[p] = Color(pxls[p]).darken(0.1).hex();
            break;
          case Modes.lighten:
              if (pxls[p]) o[p] = Color(pxls[p]).lighten(0.1).hex();
            break;
          default: break;
        }
        return o;
      }, {});
    },
    // TODO: could probably mostly do away with this
    pixelClicked: function(position, props) { 
      const {
        mode,
        color, 
        palette,
        pxls
      } = props;
      let positions = getBrushPositions(position, props);
      
      switch (mode) {
        case Modes.pencil:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = color;
              return o;
            }, {}))
          );
        case Modes.bucket:
          return dispatch(bucket(position, color));
        case Modes.eraser:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = null;
              return o;
            }, {}))
          );
        case Modes.darken:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              if (pxls[p]) o[p] = Color(pxls[p]).darken(0.1).hex();
              return o;
            }, {}))
          );
        case Modes.lighten:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              if (pxls[p]) o[p] = Color(pxls[p]).lighten(0.1).hex();
              return o;
            }, {}))
          );
        case Modes.dropper:
          if (pxls[position]) {
            // Switch to the color already in the palette instead of changing the current color
            if (palette.includes(pxls[position])) {
              return dispatch(setPaletteIndex(palette.indexOf(pxls[position])));
            }
            
            return dispatch(setColor(pxls[position]));
          }
          break;
        default: break;
      }
    },
    updatePxls: function(pxls, { mode }) {
      if (mode === Modes.bucket || mode === Modes.dropper) return;
      dispatch(setPxls(pxls));
    }
  })
)(Canvas);
