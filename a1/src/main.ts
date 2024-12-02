import {
  startSimpleKit,
  setSKDrawCallback,
  setSKEventListener,
  SKResizeEvent,
  SKMouseEvent,
  setSKAnimationCallback,
  addSKEventTranslator,
} from "simplekit/canvas-mode";

import { Circle } from "./circle";
import { RingAnimator } from "./ringanimator";
import { LineAnimator } from "./lineanimator";
import { longClickTranslator } from "./translator";
//import { CircleAnimator, easeInOut, bounce } from "./animator";
addSKEventTranslator(longClickTranslator);
console.log("Added longclick translator");

startSimpleKit();

//variables for the canvas
let gc: CanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;

let mode: "start" | "play" | "end" = "start"; //game initially in start mode

//variables for the targets
let targets: Circle[] = [];
let positions: { x: number; y: number }[] = []; //positions of the targets
let shift = 0; //shift along the circle pattern
let r: number = 30; //size of the targets
let circles: number = 6; //number of targets
let labels: string[] = [...Array(circles)].map((_, i) => `${i + 1}`); //labels for the targets
shuffle(labels); //shuffle on start
let correctTarget = "1"; //starts on first target
let isCorrectTarget = false;
let colourMap: { [key: string]: string } = {};
//target at positions[i] has label of labels[i] and colour of colourMap[i]

//variables for the timer
let timer: number = 0; // Timer in seconds
let lastUpdated: number | null = null; // the last time the timer was updated
let bestTime: number | null = null;

//variables for the mouse position
let mx = 0;
let my = 0;
let isMouseDown = false;
let clickedPositions: number[] = []; //positions of the targets clicked (in order of correct Targets)

//circle animation for when the right target is clicked
let ringanimator: RingAnimator | null = null;

//line animation for the connecting lines
let lineanimator: LineAnimator | null = null;
let lines: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colour: string;
}[] = []; //connecting lines
let finalLines: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  colour: string;
}[] = [];

let wiggleActive = false;
const wiggleRadius = 20;
const wiggleSpeed = 0.1;
let wiggleAngles: number[] = [];
let angleOffsets: number[] = [];

setSKEventListener((e) => {
  switch (e.type) {
    case "keydown":
      const { key } = e as KeyboardEvent;
      switch (key) {
        case " ":
          if (mode === "start") {
            shuffle(labels);
            shift = Math.random() * 2 * Math.PI; // random angle between 0 and 360
            updateTargets();
            timer = 0;
            lastUpdated = null;
            break;
          } else if (mode === "end") {
            wiggleActive = false;
            resetCanvas();
          }
          break;
        case "]": //increase number of targets
          if (mode === "start" && circles < 8) {
            const newLabel = (circles + 1).toString();
            if (!labels.includes(newLabel)) {
              labels.push(newLabel);
              circles++;
              updateTargets();
            }
          }
          break;
        case "[": //decrease number of targets
          if (mode === "start" && circles > 3) {
            if (mode === "start" && circles > 3) {
              labels.pop();
              circles--;
              updateTargets();
            }
          }
          break;
        case "}": //increase radius of targets
          if (mode === "start" && r < 45) {
            r += 5;
            updateTargets();
          }
          break;
        case "{": //decrease radius of targets
          if (mode === "start" && r > 15) {
            r -= 5;
            updateTargets();
          }
          break;
        case "c":
          mode = "play";
          lastUpdated = performance.now();
          correctTargetClicked();
          break;
      }
      break;
    case "resize":
      const re = e as SKResizeEvent;
      // update local canvas size state
      // (SimpleKit always sends resize event before first draw)
      width = re.width;
      height = re.height;
      updateTargets();
      break;
    case "mousedown":
      ({ x: mx, y: my } = e as SKMouseEvent);
      isMouseDown = true;

      targets.forEach((target) => {
        if (target.hitTest(mx, my)) {
          target.outerLine = 3;
          target.outerLineColour = "yellow";
          target.outline = 3;
          target.outlineColour = "lightblue";
        } else {
          target.outerLine = 0;
          target.outerLineColour = "";
          target.outline = 0;
          target.outlineColour = "";
        }
      });

      const correctCircleIndex = labels.indexOf(correctTarget);
      const correctCircle = targets[correctCircleIndex];
      if (correctCircle && correctCircle.hitTest(mx, my)) {
        isCorrectTarget = true;
      } else {
        isCorrectTarget = false;
      }
      break;
    case "mouseup":
      isMouseDown = false;
      if (mode === "start" && isCorrectTarget) {
        mode = "play";
        lastUpdated = performance.now();
      }
      if (mode === "play" && isCorrectTarget) {
        correctTargetClicked();
      }

      targets.forEach((target) => {
        target.outerLine = 0;
        target.outerLineColour = "";
      });
      break;
    case "mousemove":
      ({ x: mx, y: my } = e as SKMouseEvent);
      targets.forEach((target) => {
        if (target.outlineColour !== "yellow") {
          if (target.hitTest(mx, my)) {
            target.outline = 3;
            target.outlineColour = "lightblue";
          } else {
            target.outline = 0;
            target.outlineColour = "";
          }
        }
      });
      break;
    case "longclick":
      ({ x: mx, y: my } = e as SKMouseEvent);
      //console.log(`${e.type} (${mx}, ${my}) at ${e.timeStamp} `);
      if (mode === "play") {
        resetCanvas();
      }
      break;
  }
});

setSKDrawCallback((context) => {
  gc = context;
  drawCanvas();
});

setSKAnimationCallback((time) => {
  if (mode === "end" && wiggleActive) {
    targets.forEach((target, index) => {
      wiggleAngles[index] += wiggleSpeed;
      const angle = wiggleAngles[index];
      const centerX = positions[index].x;
      const centerY = positions[index].y;

      target.x = centerX + wiggleRadius * Math.cos(angle + angleOffsets[index]);
      target.y = centerY + wiggleRadius * Math.sin(angle + angleOffsets[index]);
      if (index < clickedPositions.length - 1) {
        const next = clickedPositions[index + 1];
        finalLines[index].start = { x: target.x, y: target.y };
        finalLines[index].end = { x: targets[next].x, y: targets[next].y };
      } else {
        finalLines[index].end = {x: target.x, y: target.y};
      }
    });
  }
  if (ringanimator) {
    ringanimator.update(time);
    const currentWidth = ringanimator.circleSize;
    const correctCircle = parseInt(correctTarget) - 1;
    const circleIndex = labels.indexOf(correctCircle.toString());
    const clickedCircle = targets[circleIndex];
    if (clickedCircle) {
      clickedCircle.outerLineColour = "yellow";
      clickedCircle.outerLine = currentWidth;
    }
    if (!ringanimator.isRunning) {
      ringanimator = null;
      if (mode === "end") {
        wiggleActive = true;
        wiggleAngles = Array(circles).fill(0);
        angleOffsets.length = 0;
        for (let i = 0; i < circles; i++) {
          angleOffsets.push(Math.random() * 2 * Math.PI);
        }
      }
    }
  }
  //if (lineanimator && lineanimator.isRunning) {
  if (lineanimator) {
    lineanimator.update(time);
    if (!lineanimator.isRunning) {
      //if (!lineanimator.update(time)) {
      lines.push({
        start: { ...lineanimator.start },
        end: { ...lineanimator.end },
        colour: lineanimator.colour,
      });
      lineanimator = null;
    }
  }
  drawCanvas();
});

//helper function to shuffle an array
function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // swap elements
  }
}

//update the targets and their positions
function updateTargets() {
  let margin = 15 + r;
  const minWidth = (width = width - margin * 2);
  const minHeight = height - 50 - margin * 2;
  const mainR = Math.min(minWidth, minHeight) / 2;
  const centerX = minWidth / 2 + margin;
  const centerY = minHeight / 2 + 50 + margin;
  const angle = (2 * Math.PI) / circles;

  positions = [];
  targets = [];
  [...Array(circles)].forEach((_, i) => {
    const targetAngle = i * angle + shift;
    let x = centerX + mainR * Math.cos(targetAngle);
    let y = centerY + mainR * Math.sin(targetAngle);

    positions.push({ x, y });

    const label = labels[i];
    const isCurrent = label === correctTarget;
    const fill = colourMap[label] || (isCurrent ? "white" : "darkgrey");
    const labelColour = colourMap[label] || isCurrent ? "black" : "lightgrey";

    targets.push(new Circle(x, y, r, fill, label, labelColour, 0, ""));
    wiggleAngles[i] = 0;
  });

  lines = lines.map((line, index) => {
    const start = positions[clickedPositions[index]];
    const end = positions[clickedPositions[index + 1]];
    if (start && end) {
      return {
        start: { x: start.x, y: start.y },
        end: { x: end.x, y: end.y },
        colour: line.colour,
      };
    } else {
      return line;
    }
  });
}

//handle the events of clicking the correct target (e.g. colour change)
function correctTargetClicked() {
  const circleIndex = labels.indexOf(correctTarget);
  const clickedCircle = targets[circleIndex];
  const hue = (parseInt(correctTarget) / circles) * 360;
  const fillColour = `hsl(${hue}, 100%, 50%)`;

  if (clickedCircle) {
    colourMap[correctTarget] = fillColour;
    clickedPositions.push(circleIndex);
    clickedCircle.outerLineColour = "yellow";
    clickedCircle.outerLine = 3;

    if (clickedPositions.length > 1) {
      const lastClickedIndex = clickedPositions[clickedPositions.length - 2];
      const start = positions[lastClickedIndex];
      const end = positions[circleIndex];
      if (
        circleIndex < positions.length &&
        lastClickedIndex < positions.length
      ) {
        lineanimator = new LineAnimator(
          start,
          end,
          colourMap[labels[lastClickedIndex]]
        );
      }
    }
    ringanimator = new RingAnimator(0, 30, 350, (lineWidth) => {
      clickedCircle.outerLine = lineWidth;
    });
    ringanimator.start(performance.now());
  }
  const nextLabel = parseInt(correctTarget) + 1;
  if (nextLabel <= circles + 1) {
    correctTarget = nextLabel.toString();
    if (nextLabel === circles + 1) {
      mode = "end";
      wiggleActive = true;
      finalLines.forEach((line, index) => {
        line.start = lines[index].start;
        line.end = lines[index].end;
        line.colour = lines[index].colour;
      })
    }
  }
  updateTargets();
}

function drawCanvas() {
  if (!gc) return;
  width = gc.canvas.width;
  height = gc.canvas.height;
  gc.clearRect(0, 0, width, height);

  //background
  gc.fillStyle = isMouseDown && !isCorrectTarget ? "darkred" : "black";
  gc.fillRect(0, 0, width, height);
  gc.font = "24px sans-serif";
  gc.fillStyle = "white";
  gc.textAlign = "center";
  gc.textBaseline = "middle";

  //line upder the header
  gc.strokeStyle = "white";
  gc.lineWidth = 2;
  gc.beginPath();
  gc.moveTo(0, 50);
  gc.lineTo(gc.canvas.width, 50);
  gc.stroke();

  //header text
  if (mode === "start") {
    gc.fillText("click target 1 to begin", width / 2, 25);
  } else if (mode === "play") {
    if (lastUpdated !== null) {
      const currentTime = performance.now();
      timer += (currentTime - lastUpdated) / 1000; //increment timer
      lastUpdated = currentTime;
    }
    gc.fillText(`${timer.toFixed(2)}s`, width / 2, 25);
  } else if (mode === "end") {
    const finalTime = timer;
    const header =
      bestTime === null || finalTime <= bestTime
        ? `${finalTime.toFixed(2)}s (new best!)`
        : `${finalTime.toFixed(2)}s (best ${bestTime.toFixed(2)}s)`;
    gc.fillText(header, width / 2, 25);
  }
  if (lineanimator) lineanimator.draw(gc);

  

  if (mode === "end" && wiggleActive) {
    finalLines.forEach((line) => {
      if (gc && line && line.start && line.end) {
        gc.strokeStyle = line.colour;
        gc.lineWidth = 5;
        gc.beginPath();
        gc.moveTo(line.start.x, line.start.y);
        gc.lineTo(line.end.x, line.end.y);
        gc.stroke();
      }
    });
  } else {
    lines.forEach((line) => {
    if (gc) {
      gc.strokeStyle = line.colour;
      gc.lineWidth = 5;
      gc.beginPath();
      gc.moveTo(line.start.x, line.start.y);
      gc.lineTo(line.end.x, line.end.y);
      gc.stroke();
    }
  });
  }

  // draw
  targets.forEach((target) => {
    if (gc) target.draw(gc);
  });
}

function resetCanvas() {
  correctTarget = "1";
  colourMap = {};
  clickedPositions = [];
  timer = 0;
  lastUpdated = null;
  lines = [];
  updateTargets();
  mode = "start";
  //wiggleActive = false;
}
