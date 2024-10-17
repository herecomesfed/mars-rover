import { expect } from "vitest";
import { MarsRover } from "../classes/MarsRover";
import { Mars } from "../classes/Mars";
import { Obstacle } from "../classes/Obstacle";

const createNewMarsRover = (direction) => {
  const grid = new Mars(5, 4);
  const obstacle1 = new Obstacle(3, 3);
  const obstacle2 = new Obstacle(0, 1);
  const rover = new MarsRover(0, 0, direction, grid, [obstacle1, obstacle2]);
  return rover;
};

describe("Mars rover movements without grid constraint", () => {
  test("move rover in north direction", () => {
    const rover = createNewMarsRover("N");
    rover._moveRover();
    expect(rover.getPosition().y).toEqual(1);
  });

  test("move rover in south direction", () => {
    const rover = createNewMarsRover("S");
    rover._moveRover();
    expect(rover.getPosition().y).toEqual(-1);
  });

  test("move rover in east direction", () => {
    const rover = createNewMarsRover("E");
    rover._moveRover();
    expect(rover.getPosition().x).toEqual(1);
  });

  test("move rover in west direction", () => {
    const rover = createNewMarsRover("W");
    rover._moveRover();
    expect(rover.getPosition().x).toEqual(-1);
  });

  test("rotate rover left", () => {
    const rover = createNewMarsRover("N");
    rover._changeDirection("L");
    expect(rover.direction).toBe("W");
  });

  test("rotate rover right", () => {
    const rover = createNewMarsRover("W");
    rover._changeDirection("R");
    expect(rover.direction).toBe("N");
  });

  test("simulate one forward movement", () => {
    const rover = createNewMarsRover("N");
    rover._moveRover("F");
    expect(rover.getFullPosition()).toEqual({
      x: 0,
      y: 1,
      direction: "N",
    });
  });

  test("simulate one backward movement", () => {
    const rover = createNewMarsRover("N");
    rover._moveRover("B");
    expect(rover.getFullPosition()).toEqual({
      x: 0,
      y: -1,
      direction: "N",
    });
  });

  test("simulate multi commands", () => {
    const rover = createNewMarsRover("N");
    const commands = ["R", "F", "F", "L", "F", "B"];
    commands.forEach((command) => {
      if (command === "L" || command === "R") {
        rover._changeDirection(command);
      }
      if (command === "F" || command === "B") {
        rover._moveRover(command);
      }
    });
    expect(rover.getFullPosition()).toEqual({
      x: 2,
      y: 0,
      direction: "N",
    });
  });
});

describe("Simulate movements with grid", () => {
  test("simulate touch limit on x", () => {
    const rover = createNewMarsRover("E");
    const commands = ["F", "F", "F", "F", "F"];
    commands.forEach((command) => {
      rover._moveRover(command);
      rover._checkGridLimits();
    });
    expect(rover.getFullPosition().x).toEqual(0);
  });

  test("simulate negative limit on x", () => {
    const rover = createNewMarsRover("W");
    rover._moveRover("F");
    rover._checkGridLimits();

    expect(rover.getFullPosition().x).toEqual(4);
  });

  test("simulate touch y limit", () => {
    const rover = createNewMarsRover("N");
    const commands = ["F", "F", "F", "F"];
    commands.forEach((command) => {
      rover._moveRover(command);
      rover._checkGridLimits();
    });
    expect(rover.getFullPosition().y).toEqual(0);
  });

  test("simulate negative y limit", () => {
    const rover = createNewMarsRover("S");
    rover._moveRover("S");
    rover._checkGridLimits();
    expect(rover.getFullPosition().y).toEqual(3);
  });
});

describe("simulate rover impact with an obstacle", () => {
  test("Simulate obstacle collision on (0,1)", () => {
    const rover = createNewMarsRover("N");
    rover._isThereObstacle("F");
    expect(rover._isThereObstacle()).toEqual(true);
  });
});
