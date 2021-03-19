"use strict";

import { createNode, init } from "./createNode.js";
import drawer from "./drawer.js";
import Node from "./graph.js";
import dijkstraAction from "./dijkstra.js";
import { renderResults, removehighlightPrev } from "./renderResults.js";

const board = document.querySelector(".board");
const clean = document.querySelector(".fas");
const startNodeEl = document.querySelector(".start");
const warnEl = document.querySelector(".warn");
const findÊl = document.querySelector(".find");
const resultsEl = document.querySelector(".results");

export let nodesObj = {};

let lineStartX, lineStartY, startNode;
let isDrawingLine = false;
let line, lineLabel;
let dijkstraStart = null;

//data and DOM of new nodes
function addNode(x, y) {
  const nodeObj = createNode(x, y);
  nodesObj[nodeObj.id] = new Node(nodeObj.id);
  board.append(nodeObj.nodeLabel, nodeObj.node, nodeObj.nodeArea);
}
// Lines---------------------------------------------------------
function lineStart(x, y) {
  lineStartX = x;
  lineStartY = y;
  isDrawingLine = true;
  board.style.cursor = "copy";

  startNode.style.transform = " translate(-50%, -50%) scale(2)";
  startNode.classList.add("selected");
}

function normalizeStartingNode() {
  isDrawingLine = false;
  board.style.cursor = "default";

  startNode.style.transform = " translate(-50%, -50%) scale(1)";
  startNode.classList.remove("selected");
}

const idToInt = id => +id.slice(4);

function drawLine(x, y, endId) {
  normalizeStartingNode();
  const lineObj =
    x < lineStartX
      ? drawer(x, y, lineStartX, lineStartY, endId, startNode.id)
      : drawer(lineStartX, lineStartY, x, y, startNode.id, endId);

  if (lineObj) board.append(lineObj.line, lineObj.lineLabel);
  nodesObj[idToInt(startNode.id)].addNeighbour(
    nodesObj[idToInt(endId)],
    lineObj.distance,
    lineObj.id
  );
}
//---------------------------------------------------------

// dijkstra---------------------------------------------------------
const unsign = id =>
  document.getElementById(`node${id}`)?.classList.remove("signNode");
const sign = id =>
  document.getElementById(`node${id}`)?.classList.add("signNode");

function setDijkstra(start) {
  unsign(dijkstraStart);
  sign(start);
  dijkstraStart = start;

  startNodeEl.textContent = start;
}

function showWarn() {
  warnEl.hidden = false;
  setTimeout(() => (warnEl.hidden = true), 1500);
}

function dijkstra() {
  if (!dijkstraStart) {
    showWarn();
    return;
  }
  renderResults(dijkstraStart, dijkstraAction(dijkstraStart));
}
// --------------------------------------------------------

const pxToInt = px => +px.slice(0, -2);

//callback function of mouse events on board
function addElements(e) {
  if (resultsEl.textContent) {
    removehighlightPrev();
    resultsEl.textContent = "";
  }
  const find = e.target.closest(".find");
  if (find) return;

  const clean = e.target.closest(".fas");
  if (clean) return;

  const node = e.target.closest(".node");

  if (e.which === 3 && node) {
    //rigt click to choose start end nodes for shortest path
    setDijkstra(idToInt(node.id));
    return;
  }
  //disable adding nodes on right click
  if (e.which === 3) return;

  let x, y;
  if (node) {
    x = pxToInt(node.style.left);
    y = pxToInt(node.style.top);
  } else {
    x = e.pageX;
    y = e.pageY;
  }
  //if we are connecting nodes then draw line
  if (isDrawingLine && node) {
    //if start and end nodes are same do nothing
    if (node.id === startNode.id) {
      normalizeStartingNode();
      return;
    }
    drawLine(x, y, node.id);
    return;
  }
  //if we are connecting and empty field is clicked exit drawing mode
  if (isDrawingLine && !node) {
    normalizeStartingNode();
    return;
  }

  //if we are not connecting and a node is chosen, then we want to connect it to another node
  if (node) {
    startNode = node;
    lineStart(x, y);
    return;
  }
  //if clicked pos is within another nodes area return. We dont want nodes to overlap
  if (e.target.closest(".node-area")) {
    return;
  }
  //clean new area is clicked, add node
  addNode(x, y);
}

// hovering effect on lines---------------------------------------------------------
function hoverLine(line, lineLabel) {
  line.classList.add("line-hover");
  lineLabel.classList.add("lineLabel-hover");
}
function removeHoverLine(line, lineLabel) {
  line.classList.remove("line-hover");
  lineLabel.classList.remove("lineLabel-hover");
}

function hoverLineProps(e) {
  if (lineLabel) removeHoverLine(line, lineLabel);
  line = e.target.closest(".line");
  lineLabel = e.target.closest(".lineLabel");
  //for adding line hover (now just hovering over labels results in animation) too, uncomment
  //   if (!line && !lineLabel) return;
  //   const id = line ? line.id.slice(4) : lineLabel.id.slice(9);
  //   if (line) lineLabel = document.getElementById("lineLabel" + id);
  //   else line = document.getElementById("line" + id);
  if (!lineLabel) return;
  const id = line ? line.id.slice(4) : lineLabel.id.slice(9);
  line = document.getElementById("line" + id);
  hoverLine(line, lineLabel);
}
// ---------------------------------------------------------

/////Event listeners
board.addEventListener("mouseup", addElements);
clean.addEventListener("click", () => {
  init();
  nodesObj = {};
  board.textContent = "";
});
board.addEventListener("mouseover", hoverLineProps);
board.addEventListener("contextmenu", e => e.preventDefault());
findÊl.addEventListener("click", dijkstra);
