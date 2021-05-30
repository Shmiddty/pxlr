import React, { Component } from 'react';
import { connect } from 'react-redux';
import Color from 'color';
import { setColor, setPaletteIndex } from '../store/palette/actions';
import { setPxls, bucket } from '../store/canvas/actions';
import { MODE, MIRROR, modes, BRUSH } from '../store/config/tools';
import "./Canvas.css";

const curCanSize = 720; // TODO: should this be a prop? but... it's also in css
const modeIconSize = 32;

function magSqr([x,y]) {
  return x**2 + y**2;
}

function getBrushPositions (position, { brush, size, mirror, width, height }) {
  let [px, py] = position;
  let positions = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let [x, y] = [px + j, py + i];
      let r = size / 2;
      let a = j - size / 2 + 1/2, b = i - size / 2 + 1/2;
      if (
        brush === BRUSH.SQUARE || 
        (brush === BRUSH.CIRCLE && magSqr([a, b]) < r**2)
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
  return positions;
}

export class Canvas extends Component {
  constructor (props) {
    super(props);
    this.bg = React.createRef();
    this.canvas = React.createRef();
    this.cursor = React.createRef();
    this.mode = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

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
    window.addEventListener("mouseup", this.handleMouseUp);
    this.updateCanvasProps();
    this.paintPxls();
    this.paintBg();
  }
  componentWillUnmount() {
    window.removeEventListener("mouseup", this.handleMouseUp);
    cancelAnimationFrame(this.af);
    cancelAnimationFrame(this.baf);
    cancelAnimationFrame(this.maf);
  }
  componentDidUpdate({ size, pxls, width, mode, brush }) {
    if (width !== this.props.width || pxls !== this.props.pxls) {
      cancelAnimationFrame(this.af);
      this.af = requestAnimationFrame(() => this.paintPxls());
    }
    
    if (width !== this.props.width) {
      cancelAnimationFrame(this.baf);
      this.baf = requestAnimationFrame(() => this.paintBg());
    }

    if (
      mode !== this.props.mode || 
      width !== this.props.width || 
      size !== this.props.size ||
      brush !== this.props.brush
    ) {
      cancelAnimationFrame(this.maf);
      this.maf = requestAnimationFrame(() => this.paintCursor(size !== this.props.size));
    }
  }

  handleMouseDown (e) {
    if (e.nativeEvent.which === 3) return; // right click
    this._down = true;
    this._moved = false;
    this.pxlCache = {};
  }
  handleMouseUp (e) {
    if (!this._down) return; // click outside of canvas

    if (this._moved) {
      this.props.updatePxls(this.pxlCache, this.props);
      this.pxlCache = {};
    }
    else this.apply(e, false); // already a nativeEvent

    this._moved = this._down = false;
  }
  handleMouseMove (e) {
    this._mouse = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    this._moved = true;
    if (this._down && e.target === this.canvas.current) this.apply(e.nativeEvent, true);

    cancelAnimationFrame(this.maf);
    this.maf = requestAnimationFrame(() => this.paintCursor());
  }
  handleMouseLeave (e) {
    this._mouse = null;
    this.paintCursor();
  }

  apply ({ offsetX, offsetY }, multi = false) {
    const { 
      width: cols, 
      height: rows, 
      pixelClicked, 
      getPxls 
    } = this.props;
    let pos = [
      Math.floor(offsetX / this._width * cols),
      Math.floor(offsetY / this._height * rows)
    ];

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
    const { width, brush, size, mode } = this.props;
    const ctx = this._cursorCtx;
    const rat = this._width / width;
    let s = size * rat;
    
    if (!clearAll && this._lastMouse) {
      const [lx, ly] = this._lastMouse.map(c => Math.floor(c / rat) * rat);
      ctx.clearRect(lx - s, ly - s, s * 3 , s * 3);
    } else ctx.clearRect(0, 0, curCanSize, curCanSize);

    if (this._mouse) {
      const [x, y] = this._mouse.map(c => Math.floor(c / rat) * rat - 0.5);
      const isSinglePixelMode = [MODE.BUCKET, MODE.DROPPER].includes(mode);

      if (isSinglePixelMode) s = rat; // TODO: icky hacky 

      this._lastMouse = this._mouse

      ctx.strokeStyle = "#0007";
      
      if (isSinglePixelMode || brush === BRUSH.SQUARE) {
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, s, s);
        ctx.strokeStyle = "#fff7";
        ctx.strokeRect(x + 1, y + 1, s, s);
      } else if (brush === BRUSH.CIRCLE) {
        let bx = x + s / 2, by = y + s / 2;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(bx, by, s / 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = "#fff7";
        ctx.beginPath();
        ctx.arc(Math.SQRT2 + bx, Math.SQRT2 + by, s / 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
      const modeIcon = this.mode.current;
      modeIcon.style.transform = `translate(${ x + s }px, ${ y - modeIconSize }px)`;
    }
  }

  render () {
    const { width, height } = this.props;
    const mode = modes[this.props.mode];
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
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseLeave={this.handleMouseLeave}
          width={width}
          height={height}
        />
        <canvas
          id="cursor"
          ref={this.cursor}
          width={curCanSize}
          height={curCanSize}
        />
        <span id="mode" ref={this.mode}>
          <i className={`mdi ${mode && mode.icon}`} />
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
          case MODE.PENCIL:
            o[p] = color;
            break;
          case MODE.ERASER:
            o[p] = null;
            break;
          case MODE.DARKEN:
            if (pxls[p]) o[p] = Color(pxls[p]).darken(0.1).hex();
            break;
          case MODE.LIGHTEN:
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
        case MODE.PENCIL:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = color;
              return o;
            }, {}))
          );
        case MODE.BUCKET:
          return dispatch(bucket(position, color));
        case MODE.ERASER:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = null;
              return o;
            }, {}))
          );
        case MODE.DARKEN:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = Color(pxls[p]).darken(0.1).hex();
              return o;
            }, {}))
          );
        case MODE.LIGHTEN:
          return dispatch(
            setPxls(positions.reduce((o, p) => {
              o[p] = Color(pxls[p]).lighten(0.1).hex();
              return o;
            }, {}))
          );
        case MODE.DROPPER:
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
      if (mode === MODE.BUCKET || mode === MODE.DROPPER) return;
      dispatch(setPxls(pxls));
    }
  })
)(Canvas);
