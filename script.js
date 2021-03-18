"use strict";
import drawer from "./drawer.js";
const board = document.querySelector(".board");
const clean = document.querySelector(".fas");

let id = 0,
  lineStartX,
  lineStartY,
  oldColor,
  startNode;
let isDrawingLine = false;

const rndm255 = () => Math.floor(Math.random() * 256);
const randomRGB = () => `rgb(${rndm255()},${rndm255()},${rndm255()})`;

function addNode(x, y) {
  const nodeArea = document.createElement("div");
  nodeArea.classList.add("node-area");
  nodeArea.style.left = x + "px";
  nodeArea.style.top = y + "px";
  nodeArea.style.transform = "translate(-50%,-50%)";

  const node = document.createElement("div");
  node.classList.add("node");
  node.style.background = randomRGB();
  node.setAttribute("id", "node" + id);
  id++;
  node.style.left = x + "px";
  node.style.top = y + "px";
  node.style.transform = "translate(-50%,-50%)";

  const nodeLabel = document.createElement("div");
  nodeLabel.classList.add("label");
  nodeLabel.classList.add("nodeLabel");
  nodeLabel.setAttribute("id", "nodeLabel" + id);
  nodeLabel.style.left = x + "px";
  nodeLabel.style.top = y - 12 + "px";
  nodeLabel.style.transform = "translate(-50%,-50%)";
  nodeLabel.textContent = id;

  board.append(nodeLabel, node, nodeArea);
}

function lineStart(x, y) {
  lineStartX = x;
  lineStartY = y;
  isDrawingLine = true;
  board.style.cursor = "copy";
  oldColor = startNode.style.background;
  startNode.style.background = "white";
  startNode.classList.add("selected");
}

function normalizeStartingNode() {
  isDrawingLine = false;
  board.style.cursor = "default";
  startNode.style.background = oldColor;
  startNode.classList.remove("selected");
}

function drawLine(x, y, endId) {
  normalizeStartingNode();
  const lineObj =
    x < lineStartX
      ? drawer(x, y, lineStartX, lineStartY, endId, startNode.id)
      : drawer(lineStartX, lineStartY, x, y, startNode.id, endId);
  if (lineObj) board.append(lineObj.line, lineObj.lineLabel);
}

const pxToInt = px => +px.slice(0, -2);

function addElements(e) {
  const clean = e.target.closest(".fas");
  if (clean) return;
  const node = e.target.closest(".node");
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
    console.log(!e.target.closest(".node-area"));
    return;
  }
  //clean new area is clicked, add node
  addNode(x, y);
}

// function hoverLineProps(e) {
//   const line = e.target.closest(".line");
//   const lineLabel = e.target.closest(".lineLabel");
//   if (!line && !lineLabel) return;
//   const id = line ? line.id : lineLabel.id;
//   console.log(id);
// }

board.addEventListener("mouseup", addElements);
clean.addEventListener("click", () => (board.textContent = ""));
// body.addEventListener("mouseover", hoverLineProps);
