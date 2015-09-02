var flownetwork = require("flownetwork");
var createGraph = require("ngraph.graph");
var createPixiGraphics = require('ngraph.pixi');
var PIXI = require('pixi.js');

function buildNetwork() {
	var network = new flownetwork();	

	// origin
	network.addEdge('s', 'Electra Tower', 1, 0);

	// junctions
	network.addEdge('Electra Tower', 'Yigal Alon', 1, 0);
	network.addEdge('Yigal Alon', 'Derech HaShalom', 1, 0);
	network.addEdge('Yigal Alon', 'Yitshak Sadeh', 1, 0);	
	network.addEdge('Yitshak Sadeh', 'La Guardia', 1, 0);
	network.addEdge('Yitshak Sadeh', 'Derech Menachem Begin', 1, 0);
	network.addEdge('Derech HaShalom', 'Derech Menachem Begin', 1, 0);
	network.addEdge('Derech HaShalom', 'Ayalon Hwy', 1, 0);
	network.addEdge('Derech Menachem Begin', 'Barzilai', 1, 0);
	network.addEdge('Ayalon Hwy', 'La Guardia', 1, 0);
	network.addEdge('La Guardia', 'HaRakevet', 1, 0);
	network.addEdge('HaRakevet', 'Derech Menachem Begin', 1, 0);
	network.addEdge('Barzilai', 'Lavontin', 1, 0);
	
	// dest
	network.addEdge('Lavontin', 't', 1, 0);

	return network;
}

function computeFlow(n) {
	return n.maxFlow('s', 't');
}

function computeFlowWithCost(n) {
	return n.maxFlowMinCost('s', 't');
}

function convertNetworks(n) {
	var g = createGraph();
	var vertices = Object.keys(n.edges);

	for(var i = 0; i < vertices.length; i++) {
    	var edges = n.edges[vertices[i]];
    	 for(var j = 0; j < edges.length; j++) {
        	var edge = edges[j];
        	if(edge.capacity === 0) { continue; }
        	if(edge.source === 's' || edge.source === 't') { continue; }
        	if(edge.sink === 's' || edge.sink === 't') { continue; }
        	g.addLink(edge.source, edge.sink, {flow: edge.flow, capacity: edge.capacity, cost: edge.cost});
        }
    }

    return g;
}

function displayNetwork(n) {
	var graph = convertNetworks(n);

	graph.forEachNode(function(node) {
		node.data = {
			// label : new PIXI.Text(node.id, {font : '24px Arial', fill : 0xffffff, align : 'center'})
			label : new PIXI.Text(node.id, {font: '24px Arial', fill: '#fff', align: 'center'})
		};
	});

	// Create a pixi renderer:
	var pixiGraphics = createPixiGraphics(graph, {
		physics: {
	      springLength: function innerWidth/6,
	      springCoeff: 0.00005,
	      dragCoeff: 0.06,
	      gravity: -1.2,
	    }
	});


	// add labels to stage.
	graph.forEachNode(function(node) {
		pixiGraphics.stage.addChild(node.data.label);
	});

	// setup our custom looking nodes and links:
	pixiGraphics.createNodeUI(require('./lib/createNodeUI'))
  	.renderNode(require('./lib/renderNode'))
  	.createLinkUI(require('./lib/createLinkUI'))
  	.renderLink(require('./lib/renderLink'));

  	// just make sure first node does not move:
	var layout = pixiGraphics.layout;
	layout.setNodePosition('Electra Tower', -function innerWidth/3, function innerHeight/4);
	layout.pinNode(graph.getNode('Electra Tower'), true);

	layout.setNodePosition('Lavontin', function innerWidth/3, function innerHeight/4);
	layout.pinNode(graph.getNode('Lavontin'), true);

	pixiGraphics.run();

	return graph;
}

function routePath(graph, currentNode, path) {
	if(currentNode === 't') {
		return path;
	}

	for(var i = 0; i < graph.edges[currentNode].length; i++) {		
		var edge = graph.edges[currentNode][i];
		if(edge.flow > 0) {
			path.push(edge.sink);
			return routePath(graph, edge.sink, path);
		}
	}
}

function getRoute(graph) {
	computeFlowWithCost(graph);
	return routePath(graph, 's', []);
}

// n - number of desired routes.
function getRoutes(graph, n) {
	var routes = [];
	for(var i = 0; i < n; i++) {
		// increase cost on edgs which carry flow
		for(var node in graph.edges) {
			for(var j = 0; j < graph.edges[node].length; j++) {
				var edge = graph.edges[node][j];
				if(edge.flow > 0) {
					edge.cost++;
					// clear previous flow
					edge.flow = 0;
				} else if (edge.flow < 0) {
					edge.cost--;
					// clear previous flow
					edge.flow = 0;
				}
			}
		}
		routes.push(getRoute(graph));
	}

	return routes;
}
