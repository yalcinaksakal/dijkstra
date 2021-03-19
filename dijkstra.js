import { nodesObj } from "./script.js";
let dijkstra, visitArray, previousNode, newDistance, nodeToVisit;
//dijkstra: shortest distance from starting node
function dijkstraInit(start) {
  dijkstra = {};
  visitArray = [];
  previousNode = [];
  visitArray = new Array(Object.keys(nodesObj).length + 1).fill(null); //if visited set it to 1
  previousNode = new Array(Object.keys(nodesObj).length + 1).fill(null); //for path
  //   dijkstra = new Array(Object.keys(nodesObj).length + 1).fill(null); //assume null as infinity
  dijkstra[start] = 0;
  visitArray[start] = 1;
  visitArray[0] = 1; //there is not  a node with id 0
}

// function setNewDistance(nId, node) {
//   dijkstra[nid].distance =
//     nodesObj[node].neighbours[nId].distance + dijkstry[node].distance;
//   dijkstra[nId].path = [...dijkstra[node].path, nId];
// }

// function shortestPath(node) {
//   Object.keys(nodesObj[node].neighbours).forEach(nId => {
//     if (!dijkstra[nId]) {
//       setNewDistance(nId, node);
//     } else if (
//       dijkstra[nId].distance >
//       nodesObj[node].neighbours[nId].distance + dijkstry[node].distance
//     ) {
//       setNewDistance(nId, node);
//     }
//   });
// }

function setNewShortesPath(nodeId, neighbourId, newDistance) {
  previousNode[neighbourId] = nodeId;
  dijkstra[neighbourId] = newDistance;
}

function shortestPath(nodeId) {
  //set all neighbours as accessable
  Object.keys(nodesObj[nodeId].neighbours).forEach(neighbourId => {
    newDistance =
      dijkstra[nodeId] + nodesObj[nodeId].neighbours[neighbourId].distance;

    //if shortest path to this neighbour is infinity(assume null as infinity)
    if (dijkstra[neighbourId] === undefined)
      setNewShortesPath(nodeId, neighbourId, newDistance);
    else if (dijkstra[neighbourId] > newDistance)
      setNewShortesPath(nodeId, neighbourId, newDistance);
  });

  //find which node to visit ana visit it
  nodeToVisit = null;
  newDistance = 0;
  //choose from unvisited nodes which is accassable(dijkstra[id] is not null) and have min distance
  for (let i = 0; i < visitArray.length; i++) {
    if (!dijkstra[i] || visitArray[i]) continue; //if node is not accessable or visited  continue
    //thi node is unvisited and accessable;
    //if node  has min distance  or we havent choosen a node yet, choose it
    if (dijkstra[i] < newDistance || !nodeToVisit) {
      nodeToVisit = i;
      newDistance = dijkstra[i];
    }
  }
  //mark next node as visited
  if (nodeToVisit) {
    visitArray[nodeToVisit] = 1;
    shortestPath(nodeToVisit);
  }
}

export default function dijkstraAction(start, end) {
  dijkstraInit(start);
  shortestPath(start);
  console.log(dijkstra, previousNode);
  //   console.log(dijkstra, visitArray);
}
