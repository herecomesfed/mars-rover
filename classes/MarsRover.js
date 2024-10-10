export class MarsRover {
  static directions = ["N", "E", "S", "W"];
  static commands = ["L", "R", "F", "B"];

  constructor(x, y, direction, mars, obstacles, instructions) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.limits = mars;
    this.obstacles = obstacles;
    this.instructions = instructions;
    this._obstaclesOnTheRoad = false;
    this.output = [];
  }

  _changeDirection(instruction) {
    if (instruction === "L") {
      this.direction =
        MarsRover.directions[
          (MarsRover.directions.indexOf(this.direction) + 3) % 4
        ];
    }
    if (instruction === "R") {
      this.direction =
        MarsRover.directions[
          (MarsRover.directions.indexOf(this.direction) + 1) % 4
        ];
    }
  }

  _moveRover(instruction) {
    const movement = instruction === "B" ? -1 : 1;
    this.direction === "N" && (this.y += movement);
    this.direction === "S" && (this.y -= movement);
    this.direction === "E" && (this.x += movement);
    this.direction === "W" && (this.x -= movement);
  }

  _checkGridLimits() {
    this.x >= this.limits.x && (this.x = 0);
    this.x < 0 && (this.x = this.limits.x - 1);
    this.y >= this.limits.y && (this.y = 0);
    this.y < 0 && (this.y = this.limits.y - 1);
  }

  _isThereObstacle(command) {
    const movement = command === "B" ? -1 : 1;
    let futureX = this.x;
    let futureY = this.y;
    this.direction === "N" && (futureY += movement);
    this.direction === "S" && (futureY -= movement);
    this.direction === "E" && (futureX += movement);
    this.direction === "W" && (futureX -= movement);

    futureX >= this.limits.x && (futureX = 0);
    futureX < 0 && (futureX = this.limits.x - 1);
    futureY >= this.limits.y && (futureY = 0);
    futureY < 0 && (futureY = this.limits.y - 1);

    return this.obstacles.some(
      (obstacle) => obstacle.x === futureX && obstacle.y === futureY
    );
  }

  _updateRoverOutput() {
    this.output.push(
      `${this._obstaclesOnTheRoad ? "O:" : ""}${this.x}:${this.y}:${
        this.direction
      }`
    );
  }

  readInstruction(instruction) {
    if (instruction === "L" || instruction === "R") {
      this._changeDirection(instruction);
    }

    if (instruction === "F" || instruction === "B") {
      if (!this._isThereObstacle(instruction)) {
        this._moveRover(instruction);
        this._checkGridLimits();
      }
    }
  }

  startSimulation(
    callbackAfterSingleCommand,
    callbackAfterRowOfCommands,
    callbackAfterLoop
  ) {
    let delay = 0;
    this.instructions.forEach((instLine) => {
      instLine.forEach((instruction) => {
        setTimeout(() => {
          this.readInstruction(instruction);
          this._isThereObstacle(instLine.at(-1))
            ? (this._obstaclesOnTheRoad = true)
            : (this._obstaclesOnTheRoad = false);
          if (callbackAfterSingleCommand) callbackAfterSingleCommand();
        }, delay);
        delay += 1000;
      });
      setTimeout(() => {
        this._updateRoverOutput();
        this._obstaclesOnTheRoad = false; // Reset for the new iteration
        if (callbackAfterRowOfCommands) callbackAfterRowOfCommands();
      }, delay - 500);
    });
    setTimeout(() => {
      if (callbackAfterLoop) callbackAfterLoop();
    }, delay - 500);
  }

  // Getters
  getPosition() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  getFullPosition() {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction,
    };
  }

  getDirection() {
    return this.direction;
  }
}
