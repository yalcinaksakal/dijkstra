const rndm255 = () => Math.floor(Math.random() * 256);
const randomRGB = () => `rgb(${rndm255()},${rndm255()},${rndm255()})`;

let id = 0;

export function createNode(x, y) {
  const nodeArea = document.createElement("div");
  nodeArea.classList.add("node-area");
  nodeArea.style.left = x + "px";
  nodeArea.style.top = y + "px";
  nodeArea.style.transform = "translate(-50%,-50%)";

  const node = document.createElement("div");
  node.classList.add("node");
  node.style.background = randomRGB();
  id++;
  node.setAttribute("id", "node" + id);
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
  return { nodeArea: nodeArea, node: node, nodeLabel: nodeLabel, id: id };
}

export function init() {
  id = 0;
}
