"use strict";

import createNode from "./createNode.js";
import drawer from "./drawer.js";
import Node from "./graph.js";

const board = document.querySelector(".board");
const clean = document.querySelector(".fas");
const startNodeEl = document.querySelector(".start");
const endNodeEl = document.querySelector(".end");

const nodesArray = {};

let lineStartX, lineStartY, oldColor, startNode;
let isDrawingLine = false;
let line, lineLabel;
let dijkstraStart = null,
  dijkstraEnd = null;

function addNode(x, y) {
  const nodeObj = createNode(x, y);
  nodesArray[nodeObj.id] = new Node(nodeObj.id);
  board.append(nodeObj.nodeLabel, nodeObj.node, nodeObj.nodeArea);
}

function lineStart(x, y) {
  lineStartX = x;
  lineStartY = y;
  isDrawingLine = true;
  board.style.cursor = "copy";
  oldColor = startNode.style.background;
  startNode.style.background = "white";
  startNode.style.transform = " translate(-50%, -50%) scale(2)";
  startNode.classList.add("selected");
}

function normalizeStartingNode() {
  isDrawingLine = false;
  board.style.cursor = "default";
  startNode.style.background = oldColor;
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
  nodesArray[idToInt(startNode.id)].addNeighbour(
    nodesArray[idToInt(endId)],
    lineObj.distance
  );
}

function dijkstraElementSetup(start, end) {
  dijkstraStart = start;
  dijkstraEnd = end;
  console.log(start, end);
  startNodeEl.textContent = start;
  endNodeEl.textContent = end ? end : "-";
}

function setDiskstra(id) {
  if ((dijkstraStart && dijkstraEnd) || (!dijkstraEnd && !dijkstraStart)) {
    dijkstraElementSetup(id, null);
    return;
  }
  if (dijkstraStart) {
    dijkstraElementSetup(dijkstraStart, id);
  }
}

const pxToInt = px => +px.slice(0, -2);
function addElements(e) {
  const clean = e.target.closest(".fas");
  if (clean) return;
  const node = e.target.closest(".node");

  //rigt click to choose start end nodes for shortest path
  if (e.which === 3 && node) {
    setDiskstra(idToInt(node.id));
    return;
  }

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
  //for adding line hover too, uncomment
  //   if (!line && !lineLabel) return;
  //   const id = line ? line.id.slice(4) : lineLabel.id.slice(9);
  //   if (line) lineLabel = document.getElementById("lineLabel" + id);
  //   else line = document.getElementById("line" + id);
  if (!lineLabel) return;
  const id = line ? line.id.slice(4) : lineLabel.id.slice(9);
  line = document.getElementById("line" + id);
  hoverLine(line, lineLabel);
}

// function chooseStartEnd(e) {
//   e.preventDefault();
//   console.log(e.pageX, e.pageY);
// }

board.addEventListener("mouseup", addElements);
clean.addEventListener("click", () => (board.textContent = ""));
board.addEventListener("mouseover", hoverLineProps);
board.addEventListener("contextmenu", e => e.preventDefault());
