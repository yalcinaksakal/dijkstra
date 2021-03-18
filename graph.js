export default class Node {
  #name;
  #neighbours = {};
  constructor(name) {
    this.#name = name;
  }
  addNeighbour(node, distance) {
    this.#neighbours[node.#name] = +distance;
    node.#neighbours[this.#name] = +distance;
  }
}
