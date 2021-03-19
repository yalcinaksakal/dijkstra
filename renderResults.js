import { nodesObj } from "./script.js";

const resultsEl = document.querySelector(".results");
let noPathArray = [],
  pathArray = [];
let path, pathEl, noPathEl;

export function removehighlightPrev() {
  noPathArray.forEach(node =>
    document.getElementById(`node${node}`).classList.remove("highlight-noPath")
  );
  pathArray.forEach(pathLine => {
    pathLine.line.classList.remove("path-line");
    pathLine.lineLabel.classList.remove("lineLabel-path");
  });
  if (pathEl) {
    pathEl.classList.remove("selected2");
    document.getElementById(`node${pathEl.id}`).classList.remove("signNode");
  }
  if (noPathEl) noPathEl.classList.remove("selected2");
}

function highlightUnaccessableNodes() {
  noPathArray.forEach(node =>
    document.getElementById(`node${node}`).classList.add("highlight-noPath")
  );
  noPathEl.classList.add("selected2");
}

function highLightLine() {
  pathArray.forEach(pathLine => {
    pathLine.line.classList.add("path-line");
    pathLine.lineLabel.classList.add("lineLabel-path");
  });
  pathEl.classList.add("selected2");
  document.getElementById(`node${pathEl.id}`).classList.add("signNode");
}
function highlightPath(nodeID) {
  let line, lineLabel, id;
  pathArray = [];
  while (path[nodeID]) {
    id = `node${nodeID}node${path[nodeID]}`;
    line = document.getElementById(`line${id}`);
    if (!line) {
      id = `node${path[nodeID]}node${nodeID}`;
      line = document.getElementById(`line${id}`);
    }
    lineLabel = document.getElementById("lineLabel" + id);
    pathArray.push({ line, lineLabel });
    nodeID = path[nodeID];
  }
  highLightLine();
}

function hoverResults(e) {
  removehighlightPrev();
  noPathEl = e.target.closest(".no-path");
  if (noPathEl) {
    highlightUnaccessableNodes();
    return;
  }

  pathEl = e.target.closest(".path");
  if (pathEl) {
    highlightPath(pathEl.id);
    return;
  }
}

export function renderResults(start, results) {
  path = results.path;
  resultsEl.textContent = "";
  //create DOM elements
  // render unaccessible nodes
  let pathText = "";
  //removehighlightPrev();
  noPathArray = [];
  Object.keys(nodesObj).forEach(node => {
    if (results.shortestDistanceToNodes[node] === undefined) {
      noPathArray.push(+node);
      pathText += `${node}, `;
    }
  });

  if (pathText) {
    pathText = pathText.slice(0, -2);
    pathText = pathText = `${start} doesn't have connection to ${pathText}.`;
  }
  let pathEl = document.createElement("div");
  pathEl.textContent = pathText;
  pathEl.classList.add("no-path");
  resultsEl.appendChild(pathEl);

  /// render accessable elements
  Object.keys(results.shortestDistanceToNodes).forEach(node => {
    if (results.shortestDistanceToNodes[node]) {
      pathText = "";
      pathText = `To ${node}, shortest path is ${results.shortestDistanceToNodes[node]} px.`;
      pathEl = document.createElement("div");
      pathEl.textContent = pathText;
      pathEl.classList.add("path");
      pathEl.setAttribute("id", node);
      resultsEl.appendChild(pathEl);
    }
  });

  ///activate hover on results
  resultsEl.addEventListener("mouseover", hoverResults);
}
