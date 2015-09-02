module.exports = function (node) {
  return new AnimatedNode(node);
}

var colorLookup = [0x00FFFF, 0xFF5552];

function AnimatedNode(node) {

  var color;
  switch(node.id) {
    case 's':
      color = 0xEA7C39;
      break;
    
    case 't':
      color = 0x9E4342;
      break;

    case 'table1':
    case 'table2':
    case 'table3':
    case 'table4':
      color = 0x00ffff;
      break;

    case 'oded':
      color = 0xff0000;
      break;

    case 'david':
      color = 0x00ff00;
      break;

    case 'ex1':
      color = 0x0000ff;
      break;

    default:
      color = 0xF3D781;
      break;
  }

  this.color = color;
  this.frame = Math.random();
  this.width = 10;
  this.v = 1 - Math.random() * 0.01;
}

AnimatedNode.prototype.renderFrame = function() {

}