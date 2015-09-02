module.exports = function (link, ctx) {
	var color = (link.data.flow > 0) ? 0x79CAFE : 0x636978;
  	ctx.lineStyle(3, color, 1);
  	ctx.moveTo(link.from.x, link.from.y);
  	ctx.lineTo(link.to.x, link.to.y);
}