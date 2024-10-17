let gridSize; // This will be updated after upload
let obstaclesCoords; // same for this
let instructions; // same for this

let errorOnUpload = false;

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

const extractTxtValues = (contents) => {
  // Extract values from the fil
  const splittedRows = contents.split("\r\n");
  // Extract Grid Informations
  extractGridSize(splittedRows);
  // Extract Obstacles Coords
  extractObstaclesCoords(splittedRows);
  // Extract rover instructions
  extractRoverInstructions(splittedRows);

  return {
    gridSize,
    obstaclesCoords,
    instructions,
    errorOnUpload,
    splittedRows,
  };
};

export { extractTxtValues };
