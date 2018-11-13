//TODOs: 
// --Handle Multiple line texts
// --Add More shapes
// --Add arrows to lines
// --make shapes movable

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var nodes = [];

var lines = [];

function draw() {
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes = [];
  lines = [];
  var jsonSource = JSON.parse(document.getElementById('wf-data').value);
  for (let index = 0; index < jsonSource.nodes.length; index++) {
    const nodeJson = jsonSource.nodes[index];

    nodeJson.__proto__ = WorkFlowNode.prototype;
    nodes.push(nodeJson);
  }

  for (let index = 0; index < jsonSource.lines.length; index++) {
    const lineJson = jsonSource.lines[index];

    lineJson.__proto__ = Line.prototype;
    lines.push(lineJson);
  }

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.type == NodeTypeEnum.Rectangle) {
      drawRectWithText(ctx, node.text, node.posX, node.posY);
    } else if (node.type == NodeTypeEnum.Circle) {
      drawCircle(ctx, node.text, node.posX, node.posY);
    }
  }
  drawLines(ctx, lines);
}

//line methods

function drawLines(ctx, lines) {
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var fromNode = nodes.filter(node => node.id == line.from)[0];
    var toNode = nodes.filter(node => node.id == line.to)[0];

    var fromPosXLoc = fromNode.posX;
    var fromPosYLoc = fromNode.posY;
    var toPosXLoc = toNode.posX;
    var toPosYLoc = toNode.posY;
    //from
    if (fromNode.type == NodeTypeEnum.Rectangle) {
      fromPosXLoc = fromNode.posX + fromNode.width / 2;
      fromPosYLoc = fromNode.posY + fromNode.height;
    } else if (fromNode.type == NodeTypeEnum.Circle) {
      fromPosXLoc = fromNode.posX;
      fromPosYLoc = fromNode.posY + fromNode.radius;
    }
    //to
    if (toNode.type == NodeTypeEnum.Rectangle) {
      toPosXLoc = toNode.posX + toNode.width / 2;
      toPosYLoc = toNode.posY;
    } else if (toNode.type == NodeTypeEnum.Circle) {
      toPosXLoc = toNode.posX;
      toPosYLoc = toNode.posY - toNode.radius;
    }
    drawLine(ctx, fromPosXLoc, fromPosYLoc, toPosXLoc, toPosYLoc);
  }
}

function drawLine(ctx, posX, posY, toX, toY) {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.moveTo(posX, posY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  console.log('----------');
}

// Rectangle methods

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} text The tex to write in rectangle
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function drawRectWithText(ctx, text, x, y, radius, fill, stroke) {
  var height = calculaterectHeight(text);
  var width = calculateRectWith(text);
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#abc';
  //ctx.rect(x, y, width, height);
  roundRect(ctx, x, y, width, height, radius, fill, stroke);
  ctx.font = '20px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000000';
  ctx.fillText(text, x + width / 2, y + height / 2);
}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  if (fill) {
    ctx.fill();
  }
}

//calculate sizes
function calculateCircleRadius(text) {
  return text.length * 8;
}

function calculaterectHeight(text) {
  return 40 * (Math.floor(text.length / 50) + 1);
}
function calculateRectWith(text) {
  return text.length * 12;
}

// draw circle methods
function drawCircle(ctx, text, originX, originY, radius) {

  radius = calculateCircleRadius(text);
  ctx.beginPath();
  ctx.arc(originX, originY, radius, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.font = '20px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000000';
  ctx.fillText(text, originX, originY);
}

/**
 * Represents a node
 * @param {enum} type The type of the node (e.g. rectangle, circle...)
 * @param {String} text The text to write in node
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the node
 * @param {Number} height The height of the node
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the node. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the node. Defaults to true.
 */
class WorkFlowNode {
  constructor(id, type, text, posX, posY, height, width, radius, fill, stroke) {
    this.id = id;
    this.type = type;
    this.text = text;
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;
    this.radius = radius;
    this.fill = fill;
    this.stroke = stroke;
  }
  get width() {
    return calculateRectWith(this.text);
  }
  get height() {
    return calculaterectHeight(this.text);
  }
  get radius() {
    return calculateCircleRadius(this.text);
  }
}

/**
 * Represents the lines between nodes
 */
class Line {
  constructor(from, to, fromPort, toPort) {
    this.from = from;
    this.to = to;
    this.fromPort = fromPort;
    this.toPort = toPort;
  }
}
var NodeTypeEnum = Object.freeze({ Rectangle: 0, Circle: 1, Triangle: 2 });
