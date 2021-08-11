import React, { Component } from "react";
import { connect } from "react-redux";
import Color from "color";
import debounce from "lodash/debounce";
import { setColor, setPaletteIndex } from "../store/palette/actions";
import { setPxls, clearPxls, bucket } from "../store/canvas/actions";
import { Modes } from "../const/brush";
import { getBrushPositions } from "../lib/brush";
import Pxls from "../lib/pxls";
import "./Canvas.css";
import Icon from "./Icon";

function applyBrush(position, props) {
  const { mode, color, pxls } = props;
  return getBrushPositions(position, props).map((p) => {
    const pxlAtPos = pxls.get(p);
    const out = [p];
    switch (mode) {
      case Modes.pencil:
        out[1] = color;
        break;
      case Modes.eraser:
        out[1] = null;
        break;
      case Modes.darken:
        if (pxlAtPos) out[1] = Color(pxlAtPos).darken(0.1).hex();
        break;
      case Modes.lighten:
        if (pxlAtPos) out[1] = Color(pxlAtPos).lighten(0.1).hex();
        break;
      case Modes.invert:
        if (pxlAtPos) out[1] = Color(pxlAtPos).negate().hex();
        break;
      case Modes.mix:
        if (pxlAtPos) out[1] = Color(pxlAtPos).mix(Color(color), 0.44).hex();
        break;
      default:
        break;
    }
    return out;
  });
}

export class Canvas extends Component {
  static defaultProps = {
    backgroundHatching: "#777",
  };

  constructor(props) {
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

    this.pxlCache = new Pxls(this.props.width, this.props.height);
    this._mouse = null;
    this._lastMouse = null;
  }

  updateCanvasProps() {
    this._ctx = this.canvas.current.getContext("2d");
    this._bgCtx = this.bg.current.getContext("2d");
    this._cursorCtx = this.cursor.current.getContext("2d");
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
  componentDidUpdate({ size, pxls, width, mode, brush, mirror, background }) {
    if (width !== this.props.width || pxls !== this.props.pxls) {
      cancelAnimationFrame(this.af);
      this.af = requestAnimationFrame(() => this.paintPxls());
    }

    if (width !== this.props.width || background !== this.props.background) {
      cancelAnimationFrame(this.baf);
      this.baf = requestAnimationFrame(() => this.paintBg());
    }

    // TODO: may need to revisit this
    this.paintCursor(true);
  }

  handlePointerDown(e) {
    if (e.which === 3) return; // right click
    this._down = true;
    this._moved = false;
  }
  handlePointerUp(e) {
    if (!this._down) return; // click outside of canvas

    this.dbPointerUp.cancel();

    if (!this._moved || this.props.mode === Modes.dropper) {
      this.props.pxlClicked(
        this.pointerToPos([e.offsetX, e.offsetY]),
        this.props
      );
    } else {
      this.update();
    }

    this._moved = this._down = false;
  }
  handlePointerUpdate(e) {
    if (e.pointerType === "touch") this.dbPointerUp(e);

    this._mouse = [e.offsetX, e.offsetY];
    this._moved = true;
    if (this._down && e.target === this.canvas.current)
      this.apply([e.offsetX, e.offsetY], true);

    cancelAnimationFrame(this.maf);
    this.maf = requestAnimationFrame(() => this.paintCursor());
  }
  handlePointerLeave(e) {
    this._mouse = null;
    this.paintCursor();
  }

  pointerToPos([offsetX, offsetY]) {
    const { width: cols, height: rows, mode, size } = this.props;
    const isSinglePixelMode = [Modes.bucket, Modes.dropper].includes(mode);
    const s = isSinglePixelMode ? 1 : size;
    return [
      Math.floor((offsetX / this._width) * cols - s / 2),
      Math.floor((offsetY / this._height) * rows - s / 2),
    ];
  }

  update() {
    this.props.updatePxls(this.pxlCache, this.props);
    // TODO: this.pxlCache.empty() would be better
    this.pxlCache = new Pxls(this.props.width, this.props.height);
  }

  apply(pointer, multi = false) {
    const pos = this.pointerToPos(pointer);
    const newPxls = applyBrush(pos, this.props);

    this.pxlCache = this.pxlCache.union(
      Pxls.fromFlat(newPxls, this.props.width, this.props.height)
    );

    cancelAnimationFrame(this.paf);
    this.paf = requestAnimationFrame(() => this.paintPxls(this.pxlCache));
  }
  getPxls() {
    if (!this.props.pxls) return this.pxlCache;
    return Pxls.union(this.props.pxls, this.pxlCache);
  }

  paintBg() {
    const { width, height, background, backgroundHatching } = this.props;
    const ctx = this._bgCtx;

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = Color(backgroundHatching).alpha(0.25);
    for (let y = 0; y < width; y++) {
      for (let x = 0; x < height; x++) {
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

    pxls.each((color, [x, y]) => {
      if (!color) return ctx.clearRect(x, y, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  }

  paintCursor(clearAll) {
    const { width, size, mode, background, backgroundHatching } = this.props;
    const bg = Color(backgroundHatching);
    const ctx = this._cursorCtx;
    const rat = this._width / width;
    const brushPreview = ![Modes.bucket, Modes.dropper].includes(mode);
    const s = brushPreview ? size * rat : rat;

    if (!clearAll && this._lastMouse) {
      if (brushPreview) {
        let pos = this.pointerToPos(this._lastMouse);
        getBrushPositions(pos, this.props).forEach(([x, y]) =>
          ctx.clearRect(x, y, 1, 1)
        );
      }
    } else ctx.clearRect(0, 0, width, width);

    if (this._mouse) {
      this._lastMouse = this._mouse;

      const pos = this.pointerToPos(this._mouse);
      const [x, y] = pos.map((c) => c * rat);

      if (brushPreview) {
        applyBrush(pos, this.props).forEach(([[x, y], color]) => {
          if (color) ctx.fillStyle = color;
          else if (mode === Modes.eraser) {
            ctx.fillStyle = background;
            if ((x % 2) + (y % 2) === 1) {
              ctx.fillRect(x, y, 1, 1);
              ctx.fillStyle = bg.alpha(0.25);
            }
          } else ctx.fillStyle = bg.alpha(0.5);

          ctx.fillRect(x, y, 1, 1);
        });
      }

      // TODO: move this to its own component
      const modeIcon = this.mode.current;
      const [mx, my] = [x, y]; //this._mouse;
      modeIcon.style.top = my + "px";
      modeIcon.style.left = mx + "px";
      modeIcon.style.width = s + "px";
      modeIcon.style.height = s + "px";

      if (mode === Modes.dropper) {
        modeIcon.style.background = this.props.pxls.get(pos) || "";
      } else {
        modeIcon.style.background = "";
      }
    }
  }

  render() {
    const { width, height, mode } = this.props;
    let modeIcon;
    switch (mode) {
      case Modes.pencil:
        modeIcon = "pencil";
        break;
      case Modes.bucket:
        modeIcon = "format-color-fill";
        break;
      case Modes.eraser:
        modeIcon = "eraser-variant";
        break;
      case Modes.darken:
        modeIcon = "brightness-6 mdi-flip-h";
        break;
      case Modes.lighten:
        modeIcon = "brightness-6";
        break;
      case Modes.dropper:
        modeIcon = "eyedropper";
        break;
      case Modes.invert:
        modeIcon = "invert-colors";
        break;
      case Modes.mix:
        modeIcon = "bowl-mix";
        break;
      default:
        break;
    }
    return (
      <div id="container">
        <canvas id="background" ref={this.bg} width={width} height={height} />
        <canvas id="canvas" ref={this.canvas} width={width} height={height} />
        <canvas id="cursor" ref={this.cursor} width={width} height={height} />
        <span id="mode" className={Modes[mode]} ref={this.mode}>
          <Icon name={modeIcon} />
        </span>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    ...state.canvas,
    ...state.config,
    ...state.palette,
    color: state.palette.palette[state.palette.paletteIndex],
  }),
  (dispatch) => ({
    pxlClicked: function (position, props) {
      const { mode, color, palette, pxls } = props;
      const pxlAtPos = pxls.get(position);
      switch (mode) {
        case Modes.pencil:
        case Modes.eraser:
        case Modes.darken:
        case Modes.lighten:
        case Modes.invert:
        case Modes.mix:
          return dispatch(
            setPxls(
              Pxls.fromFlat(
                applyBrush(position, props),
                props.width,
                props.height
              )
            )
          );

        case Modes.dropper:
          if (pxlAtPos) {
            // Switch to the color already in the palette
            // instead of changing the current color
            if (palette.includes(pxlAtPos)) {
              return dispatch(setPaletteIndex(palette.indexOf(pxlAtPos)));
            }

            return dispatch(setColor(pxlAtPos));
          }
          break;
        case Modes.bucket:
          return dispatch(bucket(position, color));

        default:
          break;
      }
    },
    updatePxls: function (pxls) {
      dispatch(setPxls(pxls));
    },
  })
)(Canvas);
