import { nodesObj } from "./script.js";

const resultsEl = document.querySelector(".results");
let noPathArray = [];

export function removehighlightPrev() {
  noPathArray.forEach(node =>
    document.getElementById(`node${node}`).classList.remove("highlight-noPath")
  );
}
function highlightUnaccessableNodes() {
  noPathArray.forEach(node =>
    document.getElementById(`node${node}`).classList.add("highlight-noPath")
  );
}

function hoverResults(e) {
  removehighlightPrev();
  const noPathEl = e.target.closest(".no-path");
  if (noPathEl) {
    highlightUnaccessableNodes();
    return;
  }

  //   const pathEl = e.target.closest(".path");
  //   if (pathEl) {
  //     highlightPath(pathEl.id);
  //     return;
  //   }
}

export function renderResults(start, results) {
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

/*
path: Array(5)
0: null
1: 2
2: null
3: 2
4: 2
length: 5
__proto__: Array(0)
shortestDistanceToNodes:
1: 99
2: 0
3: 101
4: 130

*/
