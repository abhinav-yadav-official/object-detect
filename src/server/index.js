var express = require('express')
var morgan = require('morgan')
var cocoSsd = require('@tensorflow-models/coco-ssd')
const { createCanvas, createImageData } = require('canvas')
var port = process.env.PORT || 8080
var  modelLoad = cocoSsd.load()
var app = express()

app.use(express.json({limit: '50mb'}))

app.use(morgan('dev'))

app.use(express.static('dist'))

app.post('/api/obj-detect', function(req, res) {

    const img = JSON.parse(req.body.image)
    let imgData = new Uint8ClampedArray(Object.keys(img).length)
    
    for(var key in img) imgData[parseInt(key)] = img[key]

    const canvas = createCanvas(600, 400)
    const ctx = canvas.getContext('2d')
    imgData = createImageData(imgData,600,400)
    ctx.putImageData(imgData,0,0)
    
    modelLoad.then(model => {
      model.detect(canvas).then(predictions => res.json(predictions));
    });

});

app.listen(port)

console.log('Server started')