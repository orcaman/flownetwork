'use strict';

var EventEmitter = require('eventemitter3');
var inherits = require('inherits');
var Heap = require('heap');

// Edmonds–Karp max flow algorithem.
// Based on gist from : https://gist.github.com/methodin/1561824

inherits(Edge, EventEmitter);
// Represents an edge from source to sink with capacity
// var Edge = function(source, sink, capacity) {
function Edge (source, sink, capacity, cost) {
    EventEmitter.call(this);
    var _self = this;
    this.source = source;
    this.sink = sink;
    this.capacity = capacity;
    this.cost = cost;
    this.reverseEdge = null;
    var _flow = 0;

    // Add Geter / Setter for the flow property.
    Object.defineProperty(this, 'flow', {
        get: function() { return _flow; },
        set: function(value) {
            if (value !== _flow) {
                _flow = value;                
                _self.emit('change', _flow);
            }
        },
        enumerable: true,
        configurable: false
    });
}

// Main class to manage the network
var FlowNetwork = function() {    
    this.edges = {};

    // Uses Dijkstra algorithem to find the shortest path between two nodes.
    this.shortestPath = function(source, sink, distanceFunc) {
        var infinity = 10000;

        inherits(Vertex, EventEmitter);
        function Vertex (id, distance) {
            EventEmitter.call(this);
            var _self = this;
            this.id = id;
            this._distance = distance;

            // Add Geter / Setter for the flow property.
            Object.defineProperty(this, 'distance', {
                get: function() { return _self._distance; },
                set: function(value) {
                    if (value !== _self._distance) {
                        _self._distance = value;                        
                        _self.emit('change', _self._distance);
                    }
                },
                enumerable: true,
                configurable: false
            });
        }

        var visited = {};   // Keeps track of visited nodes.
        var prev = {};      // Keeps track of the actual paths.
        var vertices = {};  // Map of vertices.

        // Minimum heap, elements are ordered by distance, such that the closest vertex
        // is at the top of the heap.
        var unvisited = new Heap(function(a, b) { return (a.distance < b.distance); }); 

        // Initializations
        for (var vertexID in this.edges) {
            var vertex = new Vertex(vertexID);

            (vertexID === source) ? vertex.distance = 0 : vertex.distance = infinity;

            vertices[vertexID] = vertex;
            unvisited.Push(vertex);
            prev[vertexID] = null;
        }       

        // Actual algorithem
        while(unvisited.Peek() !== null) {
            // Get node with minimum distance.
            var current = unvisited.Pop();   // Removes node from unvisited.

            // Foreach neighbor node not visited, calculate its distance from current node.
            // Incase new distance is shorter, update.
            var edges = this.edges[current.id];
            for (var j = 0; j < edges.length; j++) {
                var edge = edges[j];

                // Incase edge is saturated.
                if(edge.flow === edge.capacity) {
                    continue;
                }
                // Assuming edges with capacity 0 are residual edges.
                // if (edge.capacity === 0) {
                //     continue;
                // }

                var neighbor = vertices[edge.sink];
                
                // this node has already been resolved.
                if (visited[neighbor.id]) {
                    continue;
                }

                var alt = current.distance + distanceFunc(edge);
                if (alt < neighbor.distance) {
                    // we've found a shorter path to neighbor.
                    neighbor.distance = alt;
                    prev[neighbor.id] = current.id;
                }                
            }            
            // Mark current as visited.
            visited[current.id] = true;

            // incase we've resolved our desired node, there's no need to keep going.
            if (current.id === sink) {
                break;
            }
        }

        // Construct path.
        var path = [];
        var n = sink;
        while(n !== null) {
            path.push(n);
            n = prev[n];
        }
        return path.reverse();
    };

    // Breadth first search
    this.bfs = function(source, sink) {
        var q = [];         // queue to scan through.
        q.push([source]);   // add source to queue.
        var visited = {};   // list of visited nodes.
        var currentNode = null;

        // As long as there are items in queue.
        while(q.length > 0) {

            // Remove item from queue.
            var currentPath = q.shift();

            // Extract last node on path.
            currentNode = currentPath[currentPath.length-1];
            
            // Have we found our target node?
            if (currentNode == sink) {
                return currentPath;
            }

            // Have we visited this node before?
            if (visited[currentNode]) {
                continue;
            }

            // Mark node as visited.
            visited[currentNode] = true;

            // Scan through node's edges.
            var edges = this.edges[currentNode];
            for (var i = 0; i < edges.length; i++) {
                var currentEdge = edges[i];

                // Compute residual flow.
                var residual = currentEdge.capacity - currentEdge.flow;

                // Only if residual is positive and we havn't visited node.
                if((residual > 0) && !visited[currentEdge.sink]) {
                    // Append sink to path.
                    var cpy = currentPath.slice(0);
                    cpy.push(currentEdge.sink);

                    // Check here to save a few iterations.
                    if (currentEdge.sink == sink) {
                        return cpy;
                    }

                    // append new path to queue.
                    q.push(cpy);
                }
            }
        }
        return null;
    };

    // Use Bellman-Ford algorithem to find negative cycles, (in a residual graph)
    this.detectNegativeCycle = function(source, edgeWeightFunc) {
        var infinity = 10000;
        var distance = {};
        var predecessors = {};
        var vertices = Object.keys(this.edges);
        var ret = {'foundNegativeCycle': false, 'negativeEdge': null, 'predecessors': predecessors};
        var i = 0;
        var j = 0;
        var k = 0;
        var edges;
        var edge;
        var from;
        var to;
        var weight;

        // Initialize
        for(i = 0; i < vertices.length; i++) {            
            distance[vertices[i]] = infinity;
            predecessors[vertices[i]] = null;
        }

        distance[source] = 0;

        // Compute distances, scan through all edges N times, where N is number of vertices.
        for(i = 0; i < vertices.length; i++) {
            for(j = 0; j < vertices.length; j++) {
                edges = this.edges[vertices[j]];
                for(k = 0; k < edges.length; k++) {
                    edge = edges[k];
                    if(edge.capacity === edge.flow) {
                        // this edge is either saturated or a residual edge with no flow.
                        continue;
                    }
                    from = edge.source;
                    to = edge.sink;
                    weight = edgeWeightFunc(edge);                
                    if(distance[from] + weight < distance[to]) {
                        distance[to] = distance[from] + weight;
                        predecessors[to] = from;
                    }
                }
            }
        }

        // Check for negative cycles.
        for(j = 0; j < vertices.length; j++) {
            if (ret.foundNegativeCycle === true) {
                break;
            }

            edges = this.edges[vertices[j]];
            for(k = 0; k < edges.length; k++) {
                edge = edges[k];
                if(edge.capacity === edge.flow) {
                    // this edge is either saturated or a residual edge with no flow.
                    continue;
                }
                from = edge.source;
                to = edge.sink;
                weight = edgeWeightFunc(edge);                
                if(distance[from] + weight < distance[to]) {                    
                    // Found negative cycle.
                    ret.foundNegativeCycle = true;
                    ret.negativeEdge = edge;
                    break;
                }
            }
        }

        return ret;
    };

    this.addEdge = function(source, sink, capacity, cost) {
        if(source == sink) {
            return;
        }
        
        // Create the two edges, one being the reverse of the other    
        var edge = new Edge(source, sink, capacity, cost);
        var reverseEdge = new Edge(sink, source, 0, -cost);
        
        // Make sure we setup the pointer to the reverse edge
        edge.reverseEdge = reverseEdge;
        reverseEdge.reverseEdge = edge;
        
        if(this.edges[source] === undefined) {
            this.edges[source] = [];
        }

        if(this.edges[sink] === undefined) {
            this.edges[sink] = [];
        }
        
        this.edges[source].push(edge);
        this.edges[sink].push(reverseEdge);
    };
    
    // Returns edge connecting source to sink.
    this.getEdge = function(source, sink) {
        var edges = this.edges[source];
        if (edges === null) {
            return null;
        }

        for (var i = 0; i < edges.length; i++) {
            var currentEdge = edges[i];
            if (currentEdge.sink === sink) {
                return currentEdge;
            }
        }

        return null;
    };

    // Convert path described with nodes to a path described by edges.
    this.nodePathToEdgePath = function(path) {
        if (path === null) {
            return null;
        }

        if(path.length < 2) {
            return [];
        }

        var edgePath = [];
        for (var nodeIdx = 0; nodeIdx < path.length-1; nodeIdx++) {
            var a = path[nodeIdx];
            var b = path[nodeIdx+1];
            var edge = this.getEdge(a, b);
            if (edge === null) {
                console.log('Error missing edge between nodes ' + a + ' and ' + b);
                return null;
            }
            edgePath.push(edge);
        }
        return edgePath;
    };

    // Find the max flow in this network
    this.maxFlow = function(source, sink) {
        var sum = 0;
        var pathNodes = this.bfs(source, sink); // augmented path.
        var path = this.nodePathToEdgePath(pathNodes); // describe path by edges.

        var i = 0;
        while(path !== null) {
            var flow = 999999;
            // Find the minimum flow
            for(i = 0; i < path.length; i++) {
                var residual = path[i].capacity - path[i].flow;
                if(residual < flow) {
                    flow = residual;
                }
            }
            // Apply the flow to the edge and the reverse edge
            for(i = 0; i < path.length; i++) {
                path[i].flow += flow;
                path[i].reverseEdge.flow -= flow;
            } 

            // Try to get a new augmented path.
            pathNodes = this.bfs(source, sink);
            path = this.nodePathToEdgePath(pathNodes);
        }
        
        // Calculate flow.
        for(i = 0 ; i < this.edges[source].length; i++) {
            sum += this.edges[source][i].flow;
        }
        return sum;
    };

    // Finds find max flow under min cost constraint.
    // Based on: http://community.topcoder.com/tc?module=Static&d1=tutorials&d2=minimumCostFlow2
    this.maxFlowMinCost = function(source, sink) {
        // Compute max flow.
        this.maxFlow(source, sink);

        var funcEdgeWeight = function(edge) {
            return ((edge.capacity - edge.flow) * edge.cost);
        };

        var negativeCycle = this.detectNegativeCycle(source, funcEdgeWeight);
        var i = 0;
        var edges;
        var edge;

        // As long as there is a negative cycle
        while(negativeCycle.foundNegativeCycle === true) {

            // Find minimum capacity and augment.
            var startVertex = negativeCycle.negativeEdge.source;
            var currentVertex = startVertex;
            var nextVertex;
            var minResidualFlow = 999999;
            edges = [];

            // Find minimum residual flow in cycle.
            do {
                nextVertex = negativeCycle.predecessors[currentVertex];
                edge = this.getEdge(nextVertex, currentVertex);
                edges.push(edge);

                var residualFlow = edge.capacity - edge.flow;                
                minResidualFlow = (residualFlow < minResidualFlow) ? residualFlow : minResidualFlow;

                currentVertex = nextVertex;
                nextVertex = negativeCycle.predecessors[nextVertex];

            }while(currentVertex !== startVertex);

            // Augment cycle.
            for(i = 0; i < edges.length; i++) {
                edges[i].flow += minResidualFlow;
                edges[i].reverseEdge.flow -= minResidualFlow;
            }

            negativeCycle = this.detectNegativeCycle(source, funcEdgeWeight);
        }

        // Calculate flow.
        var flow = 0;
        for(i = 0 ; i < this.edges[source].length; i++) {
            flow += this.edges[source][i].flow;
        }

        // Calculate cost.
        var cost = 0;
        var vertices = Object.keys(this.edges);
        for(i = 0; i < vertices.length; i++) {
            edges = this.edges[vertices[i]];
            for(var j = 0; j < edges.length; j++) {
                edge = edges[j];
                if(edge.capacity > 0 && edge.flow > 0) {
                    cost += edge.cost * edge.flow;
                }
            }
        }
        return {'flow': flow, 'cost': cost};
    };

    this.MFCUnitGraph = function(source, sink) {
        var edge;
        var edges;
        var i = 0;

        // Make sure this is indeed a unit graph!
        for(var nodeId in this.edges) {
            edges = this.edges[nodeId];
            for(i = 0; i < edges.length; i++) {
                edge = edges[i];
                if(edge.capacity > 1) {
                    console.log('this is not a unit graph, edge: ' + edge.source + ' -> ' + edge.sink + ' has a capacity bigger then 1');
                    return null;
                }
            }
        }

        var totalFlow = 0;
        var pathNodes = this.shortestPath(source, sink, function(e) { return e.cost; } ); // augmented path.
        
        
        // Make sure there's a path from source to sink.
        if(pathNodes.length === 0 || pathNodes[0] !== source || pathNodes[pathNodes.length-1] !== sink) {
            return totalFlow;
        }

        var path = this.nodePathToEdgePath(pathNodes); // describe path by edges.

        while(path !== null) {
            var flow = 999999;
            // Find the minimum flow
            for(i = 0; i < path.length; i++) {
                var residual = path[i].capacity - path[i].flow;
                if(residual < flow) {
                    flow = residual;
                }
            }
            // Apply the flow to the edge and the reverse edge
            for(i = 0; i < path.length; i++) {
                path[i].flow += flow;
                path[i].reverseEdge.flow -= flow;
            } 

            // Try to get a new augmented path.
            pathNodes = this.shortestPath(source, sink, function(e) { return e.cost; } );
            // Make sure there's a path from source to sink.
            if(pathNodes.length === 0 || pathNodes[0] !== source || pathNodes[pathNodes.length-1] !== sink) {
                break;
            }
            path = this.nodePathToEdgePath(pathNodes);
        }
        
        // Calculate flow.
        for(i = 0 ; i < this.edges[source].length; i++) {
            totalFlow += this.edges[source][i].flow;
        }

        // Calculate cost.
        var cost = 0;
        var vertices = Object.keys(this.edges);
        for(i = 0; i < vertices.length; i++) {
            edges = this.edges[vertices[i]];
            for(var j = 0; j < edges.length; j++) {
                edge = edges[j];
                if(edge.capacity > 0 && edge.flow > 0) {
                    cost += edge.cost * edge.flow;
                }
            }
        }
        return {'flow': totalFlow, 'cost': cost};
    };
};

module.exports = FlowNetwork;
