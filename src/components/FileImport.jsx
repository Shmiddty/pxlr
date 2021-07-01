import React, { Component } from 'react';
import { connect } from 'react-redux';
import chunk from "lodash/chunk";
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
  return chunk(data, 4).reduce((o, rgba, i) => {
    let x = i % width
      , y = Math.floor(i / width)
      ;
    o[[x,y]] = rgba.slice(0,3).reduce((o, v) => 
      o + v.toString(16).padStart(2, '0'), "#"
    );
    return o;
  }, {});
}

export class FileImport extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleDragEnter = this.handleDragEnter.bind(this);
  }

  componentDidMount() {
    window.addEventListener("dragenter", this.handleDragEnter);
  }
  componentWillUnmount() {
    window.removeEventListener("dragenter", this.handleDragEnter);
  }
 
  handleDragEnter(e) {
    this.ref.current.classList.add("prepare-your-body");
  }

  handleChange (se) {
    this.ref.current.classList.remove("prepare-your-body");
    this.ref.current.classList.add("consume-the-meek");

    getImage(se.target.files[0])
      .then(getImageData)
      .then(img => (this.props.resize(img.width), img))
      .then(imageDataToPxls)
      .then(this.props.setPxls)
      .then(() => {
        this.ref.current.classList.remove("consume-the-meek");
      });
  }

  render() {
    return (
      <label
        ref={this.ref}
        className="file-import"
      >
        <section className="altar">
          Present your sacrifice
        </section>
        
          <section className="maw">
          Consuming the forsaken...
        </section>

        <input
          onChange={this.handleChange}
          accept="image/*"
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