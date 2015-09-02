var should = require('chai').should();
var expect = require('chai').expect;
var flowNetwork = require('../flownetwork.js');


describe('#disconnected network', function() {
  it('tests max flow on a disconnected network', function(done) {
  	var fn = new flowNetwork();
  	fn.addEdge('s','a', 1);
  	fn.addEdge('b','t', 1);
  	fn.maxFlow('s', 't').should.equal(0);

  	done();
  });
});

describe('#simple network', function() {
  it('tests max flow in a trivial network', function(done) {
  	var fn = new flowNetwork();
  	fn.addEdge('s','t', 1);
  	fn.maxFlow('s', 't').should.equal(1);

  	done();
  });
});

describe('#Dijkstra', function() {
  it('tests implementation of Dijkstra algorithem', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('a','b', 1);
    fn.addEdge('a','c', 2);
    fn.addEdge('a','d', 6); // a,d 6
    
    fn.addEdge('b','d', 3); // a,b,d 4

    fn.addEdge('c','d', 1); // a,c,d 3

    // Trivial case.
    var path = fn.shortestPath('a', 'a', function(e) { return e.capacity; } );
    path.length.should.equal(1);
    path[0].should.equal('a');

    // Get shortest path between a and d.
    path = fn.shortestPath('a', 'd', function(e) { return e.capacity; } );
    
    // Validation.
    // expectedPath = ['a', 'c', 'd'];
    path.length.should.equal(3);
    path[0].should.equal('a');
    path[1].should.equal('c');
    path[2].should.equal('d');


    // Create a new graph.
    fn = new flowNetwork();
    fn.addEdge('a','b', 7);
    fn.addEdge('a','c', 9);
    fn.addEdge('a','d', 14);

    fn.addEdge('b','f', 15);
    fn.addEdge('b','c', 10);

    fn.addEdge('c','f', 11);
    fn.addEdge('c','d', 2);

    fn.addEdge('d','e', 9);
    fn.addEdge('e','f', 6);

    fn.addEdge('f','e', 6);

    // Get shortest path between a and e.
    path = fn.shortestPath('a', 'e', function(e) { return e.capacity; } );
    // Validation, expecting path to be [ 'a', 'c', 'd', 'e' ];
    path.length.should.equal(4);
    path[0].should.equal('a');
    path[1].should.equal('c');
    path[2].should.equal('d');
    path[3].should.equal('e');

    // Make sure path calculation is deterministic.
    path = fn.shortestPath('a', 'e', function(e) { return e.capacity; } );
    path.length.should.equal(4);
    path[0].should.equal('a');
    path[1].should.equal('c');
    path[2].should.equal('d');
    path[3].should.equal('e');


    // try another path, this time from a to f    
    path = fn.shortestPath('a', 'f', function(e) { return e.capacity; } );
    // Validation, expecting path to be[ 'a', 'c', 'd', 'e' ];
    path.length.should.equal(3);
    path[0].should.equal('a');
    path[1].should.equal('c');
    path[2].should.equal('f');

    done();
  });
});


describe('#small size network', function() {
  it('tests max flow in a small size network', function(done) {
  	var fn = new flowNetwork();
  	fn.addEdge('s','r1', 1);
  	fn.addEdge('s','r2', 1);
  	fn.addEdge('s','r3', 1);
  	fn.addEdge('s','r4', 1);

    fn.addEdge('r1', 's1', 1);
  	fn.addEdge('r2', 's2', 1);
  	fn.addEdge('r3', 's3', 1);
  	fn.addEdge('r4', 's4', 1);

  	fn.addEdge('s1', 't', 1);
  	fn.addEdge('s2', 't', 1);
  	fn.addEdge('s3', 't', 1);
  	fn.addEdge('s4', 't', 1);
  	
  	fn.maxFlow('s', 't').should.equal(4);

  	done();	
  });
});

describe('#bellman-ford no cycle', function() {
  it('test bellman-ford implementation in case where there is no cycle', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('s','t', 1, 3);
    fn.maxFlow('s', 't');

    var funcEdgeWeight = function(edge) {
        return ((edge.capacity - edge.flow) * edge.cost);
    };
    var result = fn.detectNegativeCycle('s', funcEdgeWeight);
    result.foundNegativeCycle.should.equal(false);
    expect(result.negativeEdge).to.be.null;


    fn = new flowNetwork();
    fn.addEdge('a','b', 1);
    fn.addEdge('b','c', -2);
    fn.addEdge('c','d', -4);

    result = fn.detectNegativeCycle('a', function(edge){return edge.capacity;});
    result.foundNegativeCycle.should.equal(false);
    expect(result.negativeEdge).to.be.null;

    done();
  });
});

describe('#bellman-ford no negative cycle', function() {
  it('test bellman-ford implementation in case where there is no negative cycle', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('a','b', 1);
    fn.addEdge('b','c', 2);
    fn.addEdge('c','d', -2);
    fn.addEdge('d','a', 1);

    var result = fn.detectNegativeCycle('a', function(edge){return edge.capacity;});
    result.foundNegativeCycle.should.equal(false);
    expect(result.negativeEdge).to.be.null;

    done();
  });
});

describe('#bellman-ford negative cycle', function() {
  it('test bellman-ford implementation in case where there is a negative cycle', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('a','b', 3);
    fn.addEdge('b','c', 1);
    fn.addEdge('c','d', -3);
    fn.addEdge('d','e', -2);
    fn.addEdge('e','c', 4);

    var result = fn.detectNegativeCycle('a', function(edge){return edge.capacity;});
    result.foundNegativeCycle.should.equal(true);
    expect(result.negativeEdge).not.to.be.null;

    var predecessors = result.predecessors
    // Make sure predecessors contains the cycle.

    var start = result.negativeEdge.source;
    var current = predecessors[start];
    
    var counter = 10; // allow at max counter iterations.
    // complete cycle.
    while(counter > 0 && current != start) {
      current = predecessors[current];
      counter--;
    }
    current.should.equal(start);

    done();    
  });
});

describe('#MFMC simple network', function() {
  it('tests max flow min cost in a trivial network', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('s','t', 1, 3);
    
    var MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(3);

    fn = new flowNetwork();
    fn.addEdge('s','a', 1, 3);
    fn.addEdge('s','b', 1, 3);
    fn.addEdge('s','c', 1, 3);

    fn.addEdge('a','t', 1, 0);
    fn.addEdge('b','t', 1, 0);
    fn.addEdge('c','t', 1, 0);

    MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(3);
    MFMC.cost.should.equal(9);

    done();
  });
});

describe('#MFMC with negative cycles', function() {
  it('tests max flow min cost against a residual graph which contains several negative cycles', function(done) {
    var fn = new flowNetwork();
    fn.addEdge('s','r', 1, 0);
    fn.addEdge('r','1', 1, 2);
    fn.addEdge('r','2', 1, 1);
    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);

    var MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(1);

    var edge = fn.getEdge('2', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------
    

    fn = new flowNetwork();
    fn.addEdge('s','r', 1, 0);
    fn.addEdge('r','1', 1, 1);
    fn.addEdge('r','2', 1, 2);
    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);

    MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(1);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------

    fn = new flowNetwork();
    fn.addEdge('s','r', 1, 1);
    fn.addEdge('r','1', 1, 1);
    fn.addEdge('r','2', 1, 2);
    fn.addEdge('1','t', 1, 1);
    fn.addEdge('2','t', 1, 1);

    MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(3);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------

    fn = new flowNetwork();
    fn.addEdge('s','r', 3, 0);
    
    fn.addEdge('r','1', 1, 1);
    fn.addEdge('r','2', 1, 2);
    fn.addEdge('r','3', 1, 1);
    fn.addEdge('r','4', 1, 2);
    fn.addEdge('r','5', 1, 1);
    fn.addEdge('r','6', 1, 2);

    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);
    fn.addEdge('3','t', 1, 0);
    fn.addEdge('4','t', 1, 0);
    fn.addEdge('5','t', 1, 0);
    fn.addEdge('6','t', 1, 0);    

    MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(3);
    MFMC.cost.should.equal(3);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);
    edge = fn.getEdge('3', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('4', 't');
    edge.flow.should.equal(0);
    edge = fn.getEdge('5', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('6', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------
    
    fn = new flowNetwork();
    fn.addEdge('s','r1', 1, 0);
    fn.addEdge('s','r2', 1, 0);
    fn.addEdge('s','r3', 1, 0);
    
    fn.addEdge('r1','s1', 1, 0);
    fn.addEdge('r1','s2', 1, 0);
    fn.addEdge('r1','s3', 1, 0);

    fn.addEdge('r2','s1', 1, 0);
    fn.addEdge('r2','s2', 1, 0);
    fn.addEdge('r2','s3', 1, 0);

    fn.addEdge('r3','s1', 1, 0);
    fn.addEdge('r3','s2', 1, 0);
    fn.addEdge('r3','s3', 1, 0);

    fn.addEdge('s1','s11', 1, 1);
    fn.addEdge('s1','s12', 1, 2);
    fn.addEdge('s1','s13', 1, 3);

    fn.addEdge('s2','s21', 1, 1);
    fn.addEdge('s2','s22', 1, 2);
    fn.addEdge('s2','s23', 1, 3);

    fn.addEdge('s3','s31', 1, 1);
    fn.addEdge('s3','s32', 1, 2);
    fn.addEdge('s3','s33', 1, 3);

    fn.addEdge('s11','t', 1, 0);
    fn.addEdge('s12','t', 1, 0);
    fn.addEdge('s13','t', 1, 0);

    fn.addEdge('s21','t', 1, 0);
    fn.addEdge('s22','t', 1, 0);
    fn.addEdge('s23','t', 1, 0);

    fn.addEdge('s31','t', 1, 0);
    fn.addEdge('s32','t', 1, 0);
    fn.addEdge('s33','t', 1, 0);
    
    MFMC = fn.maxFlowMinCost('s', 't');
    MFMC.flow.should.equal(3);
    MFMC.cost.should.equal(3);

    edge = fn.getEdge('s1', 's11');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s1', 's12');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s1', 's13');
    edge.flow.should.equal(0);

    edge = fn.getEdge('s2', 's21');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s2', 's22');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s2', 's23');
    edge.flow.should.equal(0);

    edge = fn.getEdge('s3', 's31');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s3', 's32');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s3', 's33');
    edge.flow.should.equal(0);
    

//--------------------------------------------------------------------------------------------


    fn = new flowNetwork();
    fn.addEdge('s','1', 6, 0);    

    fn.addEdge('1','2', 3, 1);
    fn.addEdge('1','3', 3, 4);

    // fn.addEdge('2','3', 7, 2); // Causes maxFlowMinCost to loop infinitly!

    fn.addEdge('3','4', 5, 2);
    fn.addEdge('3','5', 7, 5);
    fn.addEdge('3','6', 1, 8);

    fn.addEdge('4','5', 3, 1);

    fn.addEdge('5','t', 10, 0);
    fn.addEdge('6','t', 1, 0);
    
    MFMC = fn.maxFlowMinCost('s', 't');
    // MFMC.flow.should.equal(1);
    // MFMC.cost.should.equal(3);

    done();
  });
});

describe('#MFMC Unit graph', function() {
  it('tests max flow min cost against a unit capacity graph.', function(done) {

    var fn = new flowNetwork();
    fn.addEdge('s','r', 1, 0);
    fn.addEdge('r','1', 1, 2);
    fn.addEdge('r','2', 1, 1);
    fn.addEdge('1','t', 2, 0);
    fn.addEdge('2','t', 1, 0);

    var MFMC = fn.MFCUnitGraph('s', 't'); 
    expect(MFMC).to.be.null;

//--------------------------------------------------------------------------------------------


    fn = new flowNetwork();
    fn.addEdge('s','r', 1, 0);
    fn.addEdge('r','1', 1, 2);
    fn.addEdge('r','2', 1, 1);
    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);

    MFMC = fn.MFCUnitGraph('s', 't');    
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(1);

    var edge = fn.getEdge('2', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(0);

//--------------------------------------------------------------------------------------------

    fn = new flowNetwork();
    fn.addEdge('s','r', 1, 0);
    fn.addEdge('r','1', 1, 1);
    fn.addEdge('r','2', 1, 2);
    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);

    MFMC = fn.MFCUnitGraph('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(1);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------

    fn = new flowNetwork();
    fn.addEdge('s','r', 1, 1);
    fn.addEdge('r','1', 1, 1);
    fn.addEdge('r','2', 1, 2);
    fn.addEdge('1','t', 1, 1);
    fn.addEdge('2','t', 1, 1);

    MFMC = fn.MFCUnitGraph('s', 't');
    MFMC.flow.should.equal(1);
    MFMC.cost.should.equal(3);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------

    fn = new flowNetwork();

    fn.addEdge('s','r1', 1, 0);
    fn.addEdge('s','r2', 1, 0);
    fn.addEdge('s','r3', 1, 0);
    
    fn.addEdge('r1','1', 1, 1);
    fn.addEdge('r1','2', 1, 2);
    fn.addEdge('r2','3', 1, 1);
    fn.addEdge('r2','4', 1, 2);
    fn.addEdge('r3','5', 1, 1);
    fn.addEdge('r3','6', 1, 2);

    fn.addEdge('1','t', 1, 0);
    fn.addEdge('2','t', 1, 0);
    fn.addEdge('3','t', 1, 0);
    fn.addEdge('4','t', 1, 0);
    fn.addEdge('5','t', 1, 0);
    fn.addEdge('6','t', 1, 0);

    MFMC = fn.MFCUnitGraph('s', 't');
    MFMC.flow.should.equal(3);
    MFMC.cost.should.equal(3);
    
    edge = fn.getEdge('1', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('2', 't');
    edge.flow.should.equal(0);
    edge = fn.getEdge('3', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('4', 't');
    edge.flow.should.equal(0);
    edge = fn.getEdge('5', 't');
    edge.flow.should.equal(1);
    edge = fn.getEdge('6', 't');
    edge.flow.should.equal(0);


//--------------------------------------------------------------------------------------------
    
    fn = new flowNetwork();
    fn.addEdge('s','r1', 1, 0);
    fn.addEdge('s','r2', 1, 0);
    fn.addEdge('s','r3', 1, 0);
    
    fn.addEdge('r1','s1', 1, 0);
    fn.addEdge('r1','s2', 1, 0);
    fn.addEdge('r1','s3', 1, 0);

    fn.addEdge('r2','s1', 1, 0);
    fn.addEdge('r2','s2', 1, 0);
    fn.addEdge('r2','s3', 1, 0);

    fn.addEdge('r3','s1', 1, 0);
    fn.addEdge('r3','s2', 1, 0);
    fn.addEdge('r3','s3', 1, 0);

    fn.addEdge('s1','s11', 1, 1);
    fn.addEdge('s1','s12', 1, 2);
    fn.addEdge('s1','s13', 1, 3);

    fn.addEdge('s2','s21', 1, 1);
    fn.addEdge('s2','s22', 1, 2);
    fn.addEdge('s2','s23', 1, 3);

    fn.addEdge('s3','s31', 1, 1);
    fn.addEdge('s3','s32', 1, 2);
    fn.addEdge('s3','s33', 1, 3);

    fn.addEdge('s11','t', 1, 0);
    fn.addEdge('s12','t', 1, 0);
    fn.addEdge('s13','t', 1, 0);

    fn.addEdge('s21','t', 1, 0);
    fn.addEdge('s22','t', 1, 0);
    fn.addEdge('s23','t', 1, 0);

    fn.addEdge('s31','t', 1, 0);
    fn.addEdge('s32','t', 1, 0);
    fn.addEdge('s33','t', 1, 0);
    
    MFMC = fn.MFCUnitGraph('s', 't');
    MFMC.flow.should.equal(3);
    MFMC.cost.should.equal(3);

    edge = fn.getEdge('s1', 's11');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s1', 's12');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s1', 's13');
    edge.flow.should.equal(0);

    edge = fn.getEdge('s2', 's21');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s2', 's22');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s2', 's23');
    edge.flow.should.equal(0);

    edge = fn.getEdge('s3', 's31');
    edge.flow.should.equal(1);
    edge = fn.getEdge('s3', 's32');
    edge.flow.should.equal(0);
    edge = fn.getEdge('s3', 's33');
    edge.flow.should.equal(0);
    

//--------------------------------------------------------------------------------------------


    // fn = new flowNetwork();
    // fn.addEdge('s','1', 1, 0);    

    // fn.addEdge('1','2', 1, 1);
    // fn.addEdge('1','3', 1, 4);

    // fn.addEdge('2','3', 1, 2); // Causes maxFlowMinCost to loop infinitly!

    // fn.addEdge('3','4', 1, 2);
    // fn.addEdge('3','5', 1, 5);
    // fn.addEdge('3','6', 1, 8);

    // fn.addEdge('4','5', 1, 1);

    // fn.addEdge('5','t', 1, 0);
    // fn.addEdge('6','t', 1, 0);
    
    // MFC = fn.MFCUnitGraph('s', 't');
    // MFC.flow.should.equal(1);
    // MFC.cost.should.equal(3);

    done();
    });
});


describe('#end of testing', function() {
  it('', function(done) {
    done();
    process.exit(0);    
  });
});
