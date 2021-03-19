export default function drawer(x1, y1, x2, y2, id1, id2) {
  const distance = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  ).toFixed(0);
  const angle = (Math.atan2(-y1 + y2, x2 - x1) * 180) / Math.PI;

  //bring all the work together
  const line = document.createElement("div");
  const id = `${id1}${id2}`;

  //check if drawn earlier
  if (
    document.getElementById("line" + id) ||
    document.getElementById("lineLabel" + id)
  )
    return false;
  line.classList.add("line");
  line.setAttribute("id", "line" + id);
  line.style.position = "absolute";
  line.style.width = distance + "px";
  line.style.left = x1 + "px";
  line.style.top = y1 + "px";
  //angle
  line.style.transformOrigin = "top left";
  line.style.transform = "rotate(" + angle + "deg)";

  const lineLabel = document.createElement("div");
  lineLabel.classList.add("label");
  lineLabel.classList.add("lineLabel");
  lineLabel.setAttribute("id", "lineLabel" + id);

  lineLabel.style.left = (x2 + x1) / 2 + "px";
  lineLabel.style.top = (y2 + y1) / 2 + "px";
  lineLabel.textContent = `${distance}px`;
  //angle
  lineLabel.style.transformOrigin = "top left";
  lineLabel.style.transform = "rotate(" + angle + "deg) translateX(-50%)";

  return {
    line: line,
    lineLabel: lineLabel,
    distance: distance,
    id: "lineLabel" + id,
  };
}
