import React, { Component } from 'react';
import { connect } from 'react-redux';
import chunk from "lodash/chunk";
import makeEnum from "../util/makeEnum";
import cn from "../util/classnames";
import { setPxls, resize } from '../store/canvas/actions';
import './FileImport.css';

function getImage(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.addEventListener("load", function() {
        const img = new Image();
        const b64 = this.result;
        img.onload = () => resolve(img);
        img.src = b64;
      });

      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

function getImageData(img) {
  let can = document.createElement("canvas")
    , ctx = can.getContext('2d')
    , wid = img.width
    , hei = img.height
    ;

  can.width = wid;
  can.height = hei;
  ctx.drawImage(img, 0, 0, wid, hei);
  return ctx.getImageData(0, 0, wid, hei);
}

function imageDataToPxls({ data, width, height }) {
  return chunk(data, 4).reduce((o, [r,g,b,a], i) => {
    let x = i % width
      , y = Math.floor(i / width)
      ;
    if (a === 0) return o;

    o[[x,y]] = [r,g,b,a].reduce((o, v) => 
      o + v.toString(16).padStart(2, '0'), "#"
    );
    return o;
  }, {});
}

function validateSize(size) {
  return function(img) {
    if (img.width > size) throw new Error("The size of the image is too damn high!");
    return img;
  }
}


const STATUS = makeEnum([
  "ready",
  "waiting",
  "processing",
  "error",
  "success"
]);

export class FileImport extends Component {
  static defaultProps = {
    waitingMessage: "Drop your file here.",
    processingMessage: "Processing your file.",
    successMessage: "Successfully processed.",
    errorMessage: "There was an error while processing your file."
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);

    this.state = { status: STATUS.ready };
  }

  setStatus (status, delay = 0) {
    if (delay) setTimeout(this.setState.bind(this, { status }), delay);
    else this.setState({ status });
  }

  componentDidMount() {
    window.addEventListener("dragenter", this.handleDragEnter);
  }
  componentWillUnmount() {
    window.removeEventListener("dragenter", this.handleDragEnter);
  }
 
  handleDragEnter(e) {
    this.setStatus(STATUS.waiting);
  }

  handleChange (se) {
    
    this.setStatus(STATUS.processing);

    // TODO: maybe make this a generic component some day?
    let tar = se.target; // needt his ref to clear the value later.
    let cleanupTime = 300;
    let postCleanupTime = 1200;
    getImage(tar.files[0])
      .then(validateSize(256))
      .then(getImageData)
      .then(img => (this.props.resize(img.width), img))
      .then(imageDataToPxls)
      .then(this.props.setPxls)
      .then(() => this.setStatus(STATUS.success, cleanupTime))
      .catch(e => this.setStatus(STATUS.error, cleanupTime))
      .finally(() => {
        tar.value = '';
        this.setStatus(STATUS.ready, cleanupTime + postCleanupTime); // TODO: icky hacky 
      });
  }

  render() {
    const {
      waitingMessage,
      processingMessage,
      successMessage,
      errorMessage
    } = this.props;

    return (
      <label
        className={cn({
          "file-import":true,
          [STATUS[this.state.status]]:true
        })}
      >
        <section className="waiting-msg">
          {waitingMessage}
        </section>
        
        <section className="processing-msg">
          {processingMessage}
        </section>

        <section className="success-msg">
          {successMessage}
        </section>

        <section className="error-msg">
          {errorMessage}
        </section>

        <input
          onChange={this.handleChange}
          accept="image/*" // TODO: this should maybe be a prop?
          type="file"
        />
      </label>
    );
  }
}

export default connect(null, dispatch => ({
  setPxls: pxls => dispatch(setPxls(pxls)),
  resize: size => dispatch(resize(size))
}))(FileImport);
