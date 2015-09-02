# flownetwork
Javascript implementation of flownetwork algorithms for finding max flow in a flow network


## Usage
## find maximum flow in a network

```javascript
	// construct a network
	var fn = new FlowNetwork();
	fn.addEdge('s','o',3);
	fn.addEdge('s','p',3);
	fn.addEdge('o','p',2);
	fn.addEdge('o','q',3);
	fn.addEdge('p','r',2);
	fn.addEdge('r','t',3);
	fn.addEdge('q','r',4);
	fn.addEdge('q','t',2);	

	// find max flow
	var max = fn.maxFlow('s','t');
```

## find maximum flow with minimum cost in a unit network

```javascript
	// construct a network
	var fn = new FlowNetwork();
	fn.addEdge('s','o',1, 1);
	fn.addEdge('s','p',1, 2);
	fn.addEdge('o','p',1, 0);
	fn.addEdge('o','q',1, 1);
	fn.addEdge('p','r',1, 2);
	fn.addEdge('r','t',1, 0);
	fn.addEdge('q','r',1, 3);
	fn.addEdge('q','t',1, 1);

	// find max flow
	var max = fn.MFCUnitGraph('s','t');
```