export default class Node {
  #name;
  #neighbours = {};
  constructor(name) {
    this.#name = name;
  }
  addNeighbour(node, distance, lineId) {
    this.#neighbours[node.#name] = { distance: +distance, line: lineId };
    node.#neighbours[this.#name] = { distance: +distance, line: lineId };
  }
  get name() {
    return this.#name;
  }
  get neighbours() {
    return this.#neighbours;
  }
}
