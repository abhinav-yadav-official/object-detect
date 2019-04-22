import React, { Component } from 'react';
import './app.css';

let image;

export default class App extends Component {
  constructor () {
    super();
    this.request = this.request.bind(this)
    this.addImage = this.addImage.bind(this)
    this.state = {imageLoaded:false}
  }

  componentDidMount () {
    image = new Image();
    image.src='';
    image.width=600;
    image.height=400;
    image.style.display='none';
    const ctx = this.refs.canvas.getContext('2d');
    image.onload = () => {
      ctx.clearRect(0, 0, 600, 400);
      ctx.drawImage(image,0,0,600,400);
    }
    ctx.textAlign = "center";
    ctx.font = '32px Arial'
    ctx.fillStyle = 'gray'
    ctx.fillText("Add an image", 300, 200); 
  }

  request = e => {
    const img = JSON.stringify(this.refs.canvas.getContext('2d').getImageData(0,0,600,400).data)
    fetch('/api/obj-detect',{
      method:"POST",
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'image':img})
    })
      .then(res => res.json())
      .then(res => this.draw(res))
  }

  draw = result => {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'red'
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 1.5;
    ctx.font = '12px Times New Roman'
    result.forEach(r => {
      ctx.beginPath();
      ctx.rect(r.bbox[0],r.bbox[1],r.bbox[2],r.bbox[3]);
      ctx.stroke();
      ctx.fillText(r.class.charAt(0).toUpperCase()+r.class.slice(1),r.bbox[0]+2,r.bbox[1]-2)
    });
  }

  addImage = e => {
    image.src =  URL.createObjectURL(e.target.files[0]);
    this.setState({imageLoaded:true});
  }

  render() {
    return (
      <div>
        <h1>Object Detection</h1>
        <div id="buttons">
        <label for="add">Add Image</label>
          <input id="add" type="file" onChange={this.addImage} accept="image/png, image/jpeg"/>
          <a onClick={this.request}>Detect Objects</a>
          </div>
        <canvas ref="canvas" width="600" height="400"></canvas>
      </div>
    );
  }

}
