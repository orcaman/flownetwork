module.exports = function (link) {
	var color;
	color =  (link.data.flow > 0) ? 0x79CAFE : 0x636978;

  	return {
    	width: 3,
    	color: color
  	}
};