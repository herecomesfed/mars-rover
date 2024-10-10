import { Mars } from "./classes/Mars";
import { Obstacle } from "./classes/Obstacle";
import { MarsRover } from "./classes/MarsRover";

/**
 * Header
 *********************************/
const uploadInstructions = document.querySelector(".upload-instructions");
const reload = document.querySelector(".reload");
const docsBtn = document.querySelector(".docs-btn");

/**
 * Content
 ***********************/
const content = document.querySelector(".content");

/**
 * Grid
 */
const worldGrid = document.querySelector("#world-grid");
const startContainer = document.querySelector(".start-container");
const startBtn = document.querySelector(".start-btn");
const restartContainer = document.querySelector(".restart-container");
const restartBtn = document.querySelector(".restart-btn");

/**
 * Instruction Sidebar
 */
const instructionsContainer = document.querySelector(".instructions");
const outputContainer = document.querySelector(".output");
const downloadOutputBtn = document.querySelector(".download-output");

/**
 * Error Popup
 */
const errorPopup = document.querySelector(".error-popup");
const errorMessageContainer = document.querySelector(".error-message");

/**
 * Docs Popup
 */
const docsPopup = document.querySelector(".docs-popup");

/**
 * Popup Overlay
 */
const overlay = document.querySelector(".overlay");

/**
 * Variables
 *****************/
let gridSize; // This will be updated after upload
let obstaclesCoords; // same for this
let instructions; // same for this
let rover; // This will be the future rover
let outputURL; // This will be updated on loop finish: will revoke in case of simulation restart
let errorOnUpload = false;
const iconDirections = {
  N: "⬆️",
  E: "➡️",
  S: "⬇️",
  W: "⬅️",
};

/**
 * Callbacks
 **********************************/

/* Extract instruction from the .txt*/
const extractGridSize = (splittedRows) => {
  const [sizeLabel, x, y] = splittedRows[1].split(" ");
  sizeLabel !== "Size" && (errorOnUpload = true);
  gridSize = {
    x: Number(x) > 7 || isNaN(Number(x)) ? 5 : Number(x),
    y: Number(y) > 6 || isNaN(Number(y)) ? 4 : Number(y),
  };
};

const extractObstaclesCoords = (splittedRows) => {
  let obstacles = [];
  obstaclesCoords = [];
  splittedRows.map((row) => {
    // Works only for rows that starts with "Obstacle" (Case Sentivity: On)
    if (row.startsWith("Obstacle")) {
      obstacles.push(row);
    }
  });
  obstacles.forEach((obstacle) => {
    const [_, x, y] = obstacle.split(" ");

    /**
     Ignore Obstacle if:
      - x or y are NaN
      - x or y are bigger than grid size
      - x and y are (0,0) based (Rover Starting Point)
     */

    if (
      isNaN(Number(x)) ||
      isNaN(Number(y)) ||
      x >= gridSize.x ||
      y >= gridSize.y ||
      (Number(x) === 0 && Number(y) === 0)
    )
      return;

    obstaclesCoords.push({
      x: Number(x),
      y: Number(y),
    });
  });
};

const extractRoverInstructions = (splittedRows) => {
  instructions = [];
  splittedRows.map((row) => {
    if (
      row.startsWith("L") ||
      row.startsWith("R") ||
      row.startsWith("F") ||
      row.startsWith("B")
    ) {
      const singleSet = [...row.split("")];
      instructions.push(singleSet);
    }
  });
};

/**
 * Print the grid based on the input sizes
 */
const createGrid = (grid) => {
  worldGrid.style.gridTemplateColumns = `repeat(${grid.x}, 50px)`;
  worldGrid.style.gridTemplateRows = `repeat(${grid.y}, 50px)`;
  for (let x = 0; x < grid.x; x++) {
    for (let y = 0; y < grid.y; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      worldGrid.appendChild(cell);
      cell.style.gridColumn = x + 1;
      cell.style.gridRow = y + 1;
      cell.dataset.coords = `[${x}, ${y}]`;
    }
  }
};

/*
 * Print Obstacles based on input instructions
 */
const createObstacles = (obstacles) => {
  obstacles.forEach((obstacle) => {
    const obstacleCell = document.querySelector(
      `[data-coords="[${obstacle.x}, ${obstacle.y}]"]`
    );
    obstacleCell.style.backgroundColor = "#f9f9f9";
  });
};

/**
 * Create the arrow based on (x,y,Direction)
 */
const createArrow = (rover) => {
  const arrowContainer = document.createElement("div");
  arrowContainer.classList.add("arrow-container");
  const arrowCell = document.querySelector(
    `[data-coords="[${rover.x}, ${rover.y}]"]`
  );
  arrowCell.appendChild(arrowContainer);
  const arrow = document.createElement("p");
  arrow.classList.add("arrow");

  arrow.innerHTML = iconDirections[rover.direction];
  arrowContainer.appendChild(arrow);
};

/**
 * Update the arrow
 */
const updateArrowHtml = (rover) => {
  document.querySelectorAll(".arrow-container").forEach((arrow) => {
    arrow.parentElement.innerHTML = "";
  });
  createArrow(rover);
};

const simulationContextInit = () => {
  // Init new rover
  rover = new MarsRover(
    0,
    0,
    "N",
    new Mars(gridSize.x, gridSize.y),
    obstaclesCoords.map((obstacle) => {
      return new Obstacle(obstacle.x, obstacle.y);
    }),
    instructions
  );

  // Init new grid
  createGrid(rover.limits);
  // Init Obstacles
  rover.obstacles.length > 0 && createObstacles(rover.obstacles);
  // Init Arrow
  createArrow(rover);

  /**
   * Print simulation view
   */
  content.dataset.active = true;
  uploadInstructions.dataset.active = false;
  reload.dataset.active = true;
};

/**
 * Print output on the output box
 */
const printOutput = (rover) => {
  const roverOutput = rover.output.at(-1);
  const outputHTML = `<p>${roverOutput} </p>`;
  outputContainer.insertAdjacentHTML("beforeend", outputHTML);
};

/**
 * Generate Output URL to download a txt with the all the outputs
 */
const generateOutputTxtFile = (rover) => {
  // Create unique name for the .txt
  const getFileName = () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = new Date().getTime();
    return `rover_output_${today}_${timestamp}.txt`;
  };

  const file = new File([rover.output.join("\n")], getFileName(), {
    type: "text/plain",
  });

  // Append the download link to the button
  outputURL = URL.createObjectURL(file);
  downloadOutputBtn.href = outputURL;
  downloadOutputBtn.download = file.name;
};

/**
 * Handler to open Docs Popup
 */
const handleOpenDocs = () => {
  overlay.dataset.active = true;
  docsPopup.dataset.active = true;
};

/**
 * Popups
 */

/**
 * Error popup
 */
const openErrorPopup = (error) => {
  errorPopup.dataset.active = true;
  errorMessageContainer.innerHTML = error;
  document.body.overflow = "hidden";
  document.body.height = "100vh";
};

/**
 * Handler to close Docs Popup
 */
const handleCloseDocs = (e) => {
  const closeIcon = e.target.closest(".close-icon");
  const overlayTarget = e.target.closest(".overlay");
  if (closeIcon || overlayTarget || e.key === "Escape") {
    docsPopup.dataset.active = false;
    overlay.dataset.active = false;
  }
};

/**
 * Handler to upload the .txt file
 */
const handleUploadTxt = async () => {
  try {
    // Instruction Sidebar Content Init
    let instructionsHTML = "";

    // Handle Read File
    const pickerOpts = {
      types: [
        {
          description: "Text File",
          accept: {
            "text/plain": [".txt"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    };

    const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
    const file = await fileHandle.getFile();
    const contents = await file.text();

    // Extract values from the fil
    const splittedRows = contents.split("\r\n");
    // Extract Grid Informations
    extractGridSize(splittedRows);
    // Extract Obstacles Coords
    extractObstaclesCoords(splittedRows);
    // Extract rover instructions
    extractRoverInstructions(splittedRows);

    // Throw error for invalid input file
    if (errorOnUpload) {
      throw new Error(
        "Please respect given instruction about input formatting. Then try again."
      );
    }

    // Write sidebar html
    splittedRows.forEach((row) => {
      instructionsHTML += `${row}<br>`;
    });
    instructionsContainer.insertAdjacentHTML("beforeend", instructionsHTML);

    simulationContextInit();
  } catch (error) {
    console.error("An error occurred during file upload", error);
    openErrorPopup(error);
  }
};

// Create Callback for actions after a single command

const callbackAfterSingleCommand = () => {
  updateArrowHtml(rover);
};

// Create Callback for actions after a row of Commands
const callbackAfterRowOfCommands = () => {
  printOutput(rover);
};

// Reset All
const restartSimulation = () => {
  instructionsContainer.innerHTML = "";
  outputContainer.innerHTML = "";
  worldGrid.innerHTML = "";
  worldGrid.style = "";
  restartContainer.dataset.active = false;
  content.dataset.active = false;
  downloadOutputBtn.dataset.active = false;
  startContainer.dataset.active = true;
  uploadInstructions.dataset.active = true;
  reload.dataset.active = false;
  window.URL.revokeObjectURL(outputURL);
};

// Create callback for the end of the simulation
const callbackAfterLoop = () => {
  downloadOutputBtn.dataset.active = true;
  generateOutputTxtFile(rover);
  restartContainer.dataset.active = true;
  restartBtn.addEventListener("click", restartSimulation);
};

// Start the simulation
startBtn.addEventListener("click", () => {
  startContainer.dataset.active = false;

  rover.startSimulation(
    callbackAfterSingleCommand,
    callbackAfterRowOfCommands,
    callbackAfterLoop
  );
});

/*
 *Listeners
 *****************************/
// Upload Instructions
uploadInstructions.addEventListener("click", handleUploadTxt);
// Open Docs Modal
docsBtn.addEventListener("click", handleOpenDocs);
// Close Docs Modal
window.addEventListener("click", handleCloseDocs);
window.addEventListener("keydown", handleCloseDocs);
