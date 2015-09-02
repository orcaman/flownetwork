module.exports = function (node) {
  return new AnimatedNode(node);
}

var colorLookup = [0x00FFFF, 0xFF5552];

function AnimatedNode(node) {

  var color;
  switch(node.id) {
    case 's':
    case 'Electra Tower':
      color = 0x00ff00;
      break;
    
    case 't':
    case 'Lavontin':
      color = 0xff0000;
      break;    

    default:
      color = 0xF3D781;
      break;
  }

  this.color = color;
  this.frame = Math.random();
  this.width = 10;
  this.v = 1 - Math.random() * 0.01;
  this.label = node.data.label;
}

AnimatedNode.prototype.renderFrame = function() {

}