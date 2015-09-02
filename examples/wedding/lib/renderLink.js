module.exports = function (link, ctx) {
  ctx.lineStyle(link.width, link.color, 1);
  ctx.moveTo(link.from.x, link.from.y);
  ctx.lineTo(link.to.x, link.to.y);
}