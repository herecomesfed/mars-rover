import { expect } from "vitest";
import { MarsRover } from "../classes/MarsRover";
import { Mars } from "../classes/Mars";
import { Obstacle } from "../classes/Obstacle";

describe("Full app simulation", () => {
  test("Simulate full app based on Double Loop example", () => {
    const grid = new Mars(5, 4);
    const obstacles = [
      new Obstacle(2, 0),
      new Obstacle(0, 3),
      new Obstacle(3, 2),
    ];
    const rover = new MarsRover(0, 0, "N", grid, obstacles);
    const commands = [
      ["R", "F", "F"],
      ["R", "F"],
      ["L", "F", "R", "F", "F", "L", "F", "F", "F", "L", "L"],
    ];
    commands.forEach((listOfCommand) => {
      listOfCommand.forEach((command) => {
        rover.readInstruction(command);
      });
    });
    expect(rover.getFullPosition()).toEqual({
      x: 0,
      y: 1,
      direction: "W",
    });
  });
});
