module.exports = function (animatedNode, ctx) {
  animatedNode.renderFrame();
  ctx.lineStyle(0);
  ctx.beginFill(animatedNode.color,1);
  ctx.drawCircle(animatedNode.pos.x, animatedNode.pos.y, animatedNode.width);
  animatedNode.label.position = {x:0, y:0};
  animatedNode.label.position.x = window.innerWidth/2 + animatedNode.pos.x;
  animatedNode.label.position.y = window.innerHeight/2 + animatedNode.pos.y;
}