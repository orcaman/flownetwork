var flownetwork = require("flownetwork");
var createGraph = require("ngraph.graph");
var createPixiGraphics = require('ngraph.pixi');

window.buildGuestsNetwork = function(){
	n = new flownetwork();

	// individuals

	// friends
	n.addEdge('s', 'or', 1, 0);
	n.addEdge('s', 'guy', 1, 0);
	n.addEdge('s', 'eran', 1, 0);
	n.addEdge('s', 'yoni', 1, 0);
	n.addEdge('s', 'alon', 1, 0);
	n.addEdge('s', 'ailon', 1, 0);
	n.addEdge('s', 'omri', 1, 0);
	n.addEdge('s', 'tal', 1, 0);
	n.addEdge('s', 'ori', 1, 0);
	n.addEdge('s', 'elad', 1, 0);
	n.addEdge('s', 'udi', 1, 0);

	// family
	n.addEdge('s', 'jacob', 1, 0);
	n.addEdge('s', 'sari', 1, 0);
	n.addEdge('s', 'zipi', 1, 0);
	n.addEdge('s', 'efraim', 1, 0);
	n.addEdge('s', 'nava', 1, 0);
	n.addEdge('s', 'oded', 1, 0);
	n.addEdge('s', 'david', 1, 0);
	n.addEdge('s', 'shifra', 1, 0);
	n.addEdge('s', 'sharona', 1, 0);
	n.addEdge('s', 'albert', 1, 0);
		
	// exceptions: guests which won't sit at the same table.
	n.addEdge('ex1', 'table1', 1, 0);
	n.addEdge('ex1', 'table2', 1, 0);
	n.addEdge('ex1', 'table3', 1, 0);
	n.addEdge('ex1', 'table4', 1, 0);

	n.addEdge('oded', 'ex1', 1, 0);
	n.addEdge('david', 'ex1', 1, 0);


	// tables
	n.addEdge('table1', 't', 8, 0);
	n.addEdge('table2', 't', 8, 0);
	n.addEdge('table3', 't', 8, 0);
	n.addEdge('table4', 't', 8, 0);


	// connect individuals to tables.
	n.addEdge('or', 'table1', 1, 0);
	n.addEdge('or', 'table2', 1, 0);
	n.addEdge('or', 'table3', 1, 0);
	n.addEdge('or', 'table4', 1, 0);

	n.addEdge('guy', 'table1', 1, 0);
	n.addEdge('guy', 'table2', 1, 0);
	n.addEdge('guy', 'table3', 1, 0);
	n.addEdge('guy', 'table4', 1, 0);

	n.addEdge('eran', 'table1', 1, 0);
	n.addEdge('eran', 'table2', 1, 0);
	n.addEdge('eran', 'table3', 1, 0);
	n.addEdge('eran', 'table4', 1, 0);

	n.addEdge('yoni', 'table1', 1, 0);
	n.addEdge('yoni', 'table2', 1, 0);
	n.addEdge('yoni', 'table3', 1, 0);
	n.addEdge('yoni', 'table4', 1, 0);

	n.addEdge('alon', 'table1', 1, 0);
	n.addEdge('alon', 'table2', 1, 0);
	n.addEdge('alon', 'table3', 1, 0);
	n.addEdge('alon', 'table4', 1, 0);

	n.addEdge('ailon', 'table1', 1, 0);
	n.addEdge('ailon', 'table2', 1, 0);
	n.addEdge('ailon', 'table3', 1, 0);
	n.addEdge('ailon', 'table4', 1, 0);

	n.addEdge('omri', 'table1', 1, 0);
	n.addEdge('omri', 'table2', 1, 0);
	n.addEdge('omri', 'table3', 1, 0);
	n.addEdge('omri', 'table4', 1, 0);

	n.addEdge('tal', 'table1', 1, 0);
	n.addEdge('tal', 'table2', 1, 0);
	n.addEdge('tal', 'table3', 1, 0);
	n.addEdge('tal', 'table4', 1, 0);

	n.addEdge('ori', 'table1', 1, 0);
	n.addEdge('ori', 'table2', 1, 0);
	n.addEdge('ori', 'table3', 1, 0);
	n.addEdge('ori', 'table4', 1, 0);

	n.addEdge('elad', 'table1', 1, 0);
	n.addEdge('elad', 'table2', 1, 0);
	n.addEdge('elad', 'table3', 1, 0);
	n.addEdge('elad', 'table4', 1, 0);

	n.addEdge('udi', 'table1', 1, 0);
	n.addEdge('udi', 'table2', 1, 0);
	n.addEdge('udi', 'table3', 1, 0);
	n.addEdge('udi', 'table4', 1, 0);

	n.addEdge('jacob', 'table1', 1, 0);
	n.addEdge('jacob', 'table2', 1, 0);
	n.addEdge('jacob', 'table3', 1, 0);
	n.addEdge('jacob', 'table4', 1, 0);

	n.addEdge('sari', 'table1', 1, 0);
	n.addEdge('sari', 'table2', 1, 0);
	n.addEdge('sari', 'table3', 1, 0);
	n.addEdge('sari', 'table4', 1, 0);

	n.addEdge('zipi', 'table1', 1, 0);
	n.addEdge('zipi', 'table2', 1, 0);
	n.addEdge('zipi', 'table3', 1, 0);
	n.addEdge('zipi', 'table4', 1, 0);

	n.addEdge('efraim', 'table1', 1, 0);
	n.addEdge('efraim', 'table2', 1, 0);
	n.addEdge('efraim', 'table3', 1, 0);
	n.addEdge('efraim', 'table4', 1, 0);

	n.addEdge('nava', 'table1', 1, 0);
	n.addEdge('nava', 'table2', 1, 0);
	n.addEdge('nava', 'table3', 1, 0);
	n.addEdge('nava', 'table4', 1, 0);

	// n.addEdge('oded', 'table1', 1, 0);
	// n.addEdge('oded', 'table2', 1, 0);
	// n.addEdge('oded', 'table3', 1, 0);
	// n.addEdge('oded', 'table4', 1, 0);

	// n.addEdge('david', 'table1', 1, 0);
	// n.addEdge('david', 'table2', 1, 0);
	// n.addEdge('david', 'table3', 1, 0);
	// n.addEdge('david', 'table4', 1, 0);

	n.addEdge('shifra', 'table1', 1, 0);
	n.addEdge('shifra', 'table2', 1, 0);
	n.addEdge('shifra', 'table3', 1, 0);
	n.addEdge('shifra', 'table4', 1, 0);

	n.addEdge('sharona', 'table1', 1, 0);
	n.addEdge('sharona', 'table2', 1, 0);
	n.addEdge('sharona', 'table3', 1, 0);
	n.addEdge('sharona', 'table4', 1, 0);

	n.addEdge('albert', 'table1', 1, 0);
	n.addEdge('albert', 'table2', 1, 0);
	n.addEdge('albert', 'table3', 1, 0);
	n.addEdge('albert', 'table4', 1, 0);

	return n;
}

window.computeFlow = function(n) {
	return n.maxFlow('s', 't');
}

window.computeFlowWithCost = function(n) {
	return n.maxFlowMinCost('s', 't');
}

window.convertNetworks = function (n) {
	var g = createGraph();
	var vertices = Object.keys(n.edges);

	for(var i = 0; i < vertices.length; i++) {
    	var edges = n.edges[vertices[i]];
    	 for(var j = 0; j < edges.length; j++) {
        	var edge = edges[j];
        	if(edge.capacity == 0) { continue; }
        	g.addLink(edge.source, edge.sink, {flow: edge.flow, capacity: edge.capacity, cost: edge.cost});
        }
    }

    return g;
}

window.displayNetwork = function(n) {
	var graph = convertNetworks(n);
	// Create a pixi renderer:
	var pixiGraphics = createPixiGraphics(graph, {
		physics: {
	      springLength: window.innerWidth/6,
	      springCoeff: 0.00005,
	      dragCoeff: 0.06,
	      gravity: -1.2,
	    }
	});

	// setup our custom looking nodes and links:
	pixiGraphics.createNodeUI(require('./lib/createNodeUI'))
  	.renderNode(require('./lib/renderNode'))
  	.createLinkUI(require('./lib/createLinkUI'))
  	.renderLink(require('./lib/renderLink'));

  	// just make sure first node does not move:
	var layout = pixiGraphics.layout;
	layout.setNodePosition('s', -window.innerWidth/3, 0);
	layout.pinNode(graph.getNode('s'), true);

	layout.setNodePosition('t', window.innerWidth/3, 0);
	layout.pinNode(graph.getNode('t'), true);

	pixiGraphics.run();

	return graph;
}