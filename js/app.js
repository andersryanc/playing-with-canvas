window.App = {};

App.colors = {
  red: {
    fill: '#990000',
    stroke: '#660000',
  },
  blue: {
    fill: '#000099',
    stroke: '#000066',
  },
  green: {
    fill: '#009900',
    stroke: '#006600',
  },
};

App.init = function() {
  var self = this;

  this.canvas = document.getElementById( 'canvas' );
  this.ctx    = canvas.getContext( '2d' );
  this.width  = canvas.width;
  this.height = canvas.height;
  this.animId = null;
  this.moveHandler = null;
  this.upHandler = null;
  this.shapeList = [];

  this.generateRandomSquares();
  this.setupEvents();
  this.render();

  // this.canvas.onclick = function( e ) {
  //   self.clearCanvas();
  //
  //   var square = new App.Square(
  //     e.offsetX, e.offsetY, 40, self.ctx
  //   );
  //   self.shapeList.push( square );
  //   App.render();
  // };

  // this.imageObj = new Image();
  // this.imageObj.src = 'img/ryan-1.jpg';
  // this.imageObj.onload = function() {
  //   self.renderImage( self.ctx, self.imageObj );
  // };

  // this.movingSquare = new App.Square( 0, 0, 40, this.ctx );
  // (function animloop(){
  //   requestAnimationFrame(animloop);
  //   var speedX = Math.random() * 10;
  //   var speedY = Math.random() * 10;
  //   var newX = App.movingSquare.x + speedX + App.movingSquare.size < App.width ?
  //     App.movingSquare.x + speedX : 0;
  //   var newY = App.movingSquare.y + speedY + App.movingSquare.size < App.height ?
  //     App.movingSquare.y + speedY : 0;
  //   App.movingSquare.move( newX, newY );
  //   App.render();
  // })();

  // this.animate();
};

App.generateRandomSquares = function() {
  for ( var i = 0; i < 4; i++ ) {
    var randX = Math.floor( Math.random() * this.width );
    var randY = Math.floor( Math.random() * this.height );
    // Get rand size between 20 - 80
    var randSize = 20;

    var square = new App.Square( randX, randY, randSize, this.ctx );
    this.shapeList.push( square );
  }
};

App.setupEvents = function()  {
  var self = this;
  this.canvas.addEventListener( 'mousedown', function( e ) {
    self.startDrag( e );
  });
};

App.startDrag = function( e ) {
  var self = this;

  var shapes = this.getShapesAtXY( e.offsetX, e.offsetY );
  if ( shapes.length ) {
    var selectedShape = shapes[ shapes.length - 1 ];
    selectedShape.selected = true;

    this.moveHandler = function( e ) {
      self.dragShape( selectedShape, e.offsetX, e.offsetY );
    };
    this.upHandler = function( e ) {
      self.stopDrag( selectedShape );
    };

    this.canvas.addEventListener( 'mousemove', this.moveHandler, false );
    this.canvas.addEventListener( 'mouseup', this.upHandler, false );
  }
  this.render();
};

App.dragShape = function( shape, x, y ) {
  shape.x = x - shape.size / 2;
  shape.y = y - shape.size / 2;
  this.render();
};

App.stopDrag = function( shape ) {
  shape.selected = false;
  this.canvas.removeEventListener( 'mousemove', this.moveHandler, false );
  this.canvas.removeEventListener( 'mouseup', this.upHandler, false );
  this.render();
};

App.getShapesAtXY = function( x, y ) {
  var validShapes = [];

  for ( var i in this.shapeList ) {
    var shape = this.shapeList[i];
    var startX = shape.x;
    var endX = shape.x + shape.size;
    var startY = shape.y;
    var endY = shape.y + shape.size;

    if ( x >= startX && x <= endX && y >= startY && y <= endY ) {
      validShapes.push( shape );
    }
  }

  return validShapes;
};

App.animate = function() {
  var self = this;
  this.render();
  this.animId = requestAnimationFrame( function() {
    self.animate();
  });
};

App.play = function() {
  var self = this;
  if ( !this.animId ) {
    this.animId = requestAnimationFrame( function() {
      self.animate();
    });
  }
};

App.pause = function() {
  cancelAnimationFrame( this.animId );
  this.animId = null;
};

App.render = function() {
  App.clearCanvas();
  for ( var i in this.shapeList ) {
    // this.shapeList[i].animate();
    this.shapeList[i].render();
  }
  var x1 = this.shapeList[0].x + this.shapeList[0].size / 2;
  var x2 = this.shapeList[1].x + this.shapeList[1].size / 2;
  var x3 = this.shapeList[2].x + this.shapeList[2].size / 2;
  var x4 = this.shapeList[3].x + this.shapeList[3].size / 2;

  var y1 = this.shapeList[0].y + this.shapeList[0].size / 2;
  var y2 = this.shapeList[1].y + this.shapeList[1].size / 2;
  var y3 = this.shapeList[2].y + this.shapeList[2].size / 2;
  var y4 = this.shapeList[3].y + this.shapeList[3].size / 2;

  this.ctx.beginPath();
  this.ctx.moveTo( x1, y1 );
  this.ctx.bezierCurveTo( x2, y2, x3, y3, x4, y4 );
  this.ctx.lineWidth = 10;
  this.ctx.strokeStyle = 'black';
  this.ctx.stroke();

  // this.movingSquare.render();
};

App.clearCanvas = function() {
  this.ctx.clearRect( 0, 0, this.width, this.height );
};

App.drawLines = function( ctx ) {
  ctx.strokeStyle = this.colors.red.stroke;
  ctx.beginPath();
  ctx.moveTo( 0, this.height / 2 );
  ctx.lineTo( this.width, this.height / 2 );
  ctx.moveTo( 300, 150 );
  ctx.lineTo( 200, 100 );
  ctx.stroke();
};

App.drawCurves = function( ctx ) {
  ctx.beginPath();
  ctx.moveTo( 5, 100 );
  ctx.quadraticCurveTo( 300, this.width / 2, this.width - 5, 100 );
  ctx.lineWidth = 10;
  ctx.strokeStyle = this.colors.red.stroke;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo( 60, 250 );
  ctx.bezierCurveTo( 90, 155, 305, 160, 330, 260 );
  ctx.lineWidth = 15;
  ctx.strokeStyle = this.colors.green.stroke;
  ctx.stroke();
};

App.drawTriangle = function( ctx ) {
  ctx.beginPath();
  ctx.moveTo( 50, this.height / 2 );
  ctx.lineTo( this.width - 50, this.height / 2 );
  ctx.lineTo( 200, 50 );
  ctx.lineWidth = 20;
  ctx.strokeStyle = this.colors.red.stroke;
  ctx.lineCap = 'round'; // butt, round, square
  ctx.lineJoin = 'round'; // miter, round, bevel
  ctx.closePath();
  ctx.fillStyle = this.colors.red.fill;
  ctx.fill();
  ctx.stroke();
};

App.drawRect = function( ctx ) {
  ctx.beginPath();
  ctx.rect( 70, 320, 200, 160 );
  ctx.fillStyle = this.colors.blue.fill;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = this.colors.blue.stroke;
  ctx.stroke();
};

App.drawCircle = function( ctx ) {
  ctx.beginPath();
  // ctx.arc( centerX, centerY, radius, startingDegrees, endDegrees, anti );
  ctx.arc( this.width / 2 , this.height / 2, 70, 0, 0.5 * Math.PI, false );
  ctx.lineTo( this.width / 2, this.height / 2 );
  ctx.closePath();
  ctx.fillStyle = this.colors.green.fill;
  ctx.fill();
  ctx.strokeStyle = this.colors.green.stroke;
  ctx.stroke();
};

App.drawGradients = function( ctx ) {
  ctx.beginPath();
  ctx.rect(
    20, 20, this.width - 40, this.height / 2 - 40
  );
  var grad = ctx.createLinearGradient(
    20, 20, this.width - 40, this.height / 2 - 20
  );
  ctx.closePath();
  grad.addColorStop( 0, '#000000' );
  grad.addColorStop( 1, '#aa0000' );
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.beginPath();
  ctx.rect(
    20, this.height / 2, this.width - 40, this.height / 2 - 20
  );
  var radGrad = ctx.createRadialGradient(
    90, 640, 10, 90, 640, 300
  );
  ctx.closePath();
  radGrad.addColorStop( 0, '#ffffff' );
  radGrad.addColorStop( 1, '#aa0000' );
  ctx.fillStyle = radGrad;
  ctx.fill();
};

App.drawText = function( ctx ) {
  ctx.fillStyle = this.colors.red.stroke;
  ctx.font = 'italic 40px Arial';
  // ctx.textAlign = 'center';
  // ctx.textBaseline = 'top';
  console.log( ctx.measureText( 'Hello World!' ) );
  ctx.fillText( 'Hello World!', 100, 700 );
};

App.Square = function( x, y, size, ctx ) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.ctx = ctx;
  this.color = '#' + App.randomHEX();
  this.selected = false;
};

App.Square.prototype.move = function( newX, newY ) {
  this.x = newX;
  this.y = newY;
};

App.Square.prototype.render = function() {
  this.ctx.beginPath();
  this.ctx.rect(
    this.x, this.y, this.size, this.size
  );
  this.ctx.closePath();
  if ( this.selected ) {
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
  }
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
};

App.Square.prototype.animate = function() {
  this.move( this.x - 1, this.y - 1 );
  this.render();
};

App.randomHEX = function() {
  return Math.floor( Math.random() * 16777215 ).toString( 16 );
};

App.renderImage = function( ctx, imageObj ) {
  // console.log( imageObj.width );

  // Just draw the image
  ctx.drawImage( imageObj, 10, 10, canvas.width - 20, imageObj.height );

  // Crop the image
  var sourceX = 0;
  var sourceY = 200;
  var sourceWidth = imageObj.width;
  var sourceHeight = 200;
  var destWidth = canvas.width - 20;
  var destHeight = sourceHeight;
  var destX = canvas.width / 2 - destWidth / 2;
  var destY = canvas.width / 2 - destHeight / 2;

  ctx.drawImage(
    imageObj,
    sourceX, sourceY, sourceWidth, sourceHeight,
    destX, destY, destWidth, destHeight
  );

  var imageData = ctx.getImageData(
    destX, destY, destWidth, destHeight
  );
  var data = imageData.data;
  // console.log( data );

  // App.invertImage( data );
  App.bwImage( data );
  App.changeOpacity( data, 0.5 );
  ctx.putImageData( imageData, destX, destY );

  var dataURL = this.canvas.toDataURL();
  // imageObj.src = dataURL;
  console.log( dataURL );
};

App.invertImage = function( data ) {
  for ( var i = 0; i < data.length; i += 4 ) {
    // red
    data[i + 0] = 255 - data[i];

    // green
    data[i + 1] = 255 - data[i + 1];

    // blue
    data[i + 2] = 255 - data[i + 2];
  }
};

App.bwImage = function( data ) {
  for ( var i = 0; i < data.length; i += 4 ) {

    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

    // red
    data[i + 0] = brightness;

    // green
    data[i + 1] = brightness;

    // blue
    data[i + 2] = brightness;
  }
};

App.changeOpacity = function( data, opacity ) {
  for ( var i = 0; i < data.length; i += 4 ) {
    // opacity
    data[i + 3] = 255 * opacity;
  }
};
