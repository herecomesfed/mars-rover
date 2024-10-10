# Mars Rover Kata

Simulation of a vehicle on a planet according to the rules of [Mars Rover Kata](https://kata-log.rocks/mars-rover-kata) rules.

## Table of contents

- [Overview](#overview)
  - [The application](#the-application)
- [My process](#my-process)
  - [Project Bootstrapper](#project-boostrapper)
  - [How to use on your device](#how-to-use-on-your-device)
  - [Built with](#built-with)
- [The Classes](#the-classes)
  - [MarsRover](#MarsRover)
  - [Mars](#mars)
  - [Obstacle](#obstacle)
- [Conclusion](#conclusion)

## Overview

### The application

The application should:

- Read a .txt file containing:
  - World map (grid)
  - A set of commands that the rover will receive
- Print the rover's position on the screen after each command

### The implementation

- Rover Starting point: (x,y,direction):(0,0,N)
- Rover will accept the following instructions:
  - L: Left - Turn rover 90deg to left
  - R: Right - Turn rover 90deg to right
  - F: Forward - Move rover to direction
  - B: Backward - Move the rover in opposite direction
- Edge cases: If the rover continues to move after touching the edge of the grid, it will enter in the opposite coords
  - Example: Grid 5x4, when rover touches (5,0) (0 based position) it will enter in the grid in (0,0)
- Grid could contain obstacles
  - When rover touches obstacles, it can't move in direction of the obstacle.
- After each command string, the rover will send the following string to the central controller: [O:]<X>:<Y>:<Direction>
  - Where x is the x coord of the rover, y the y coord of the rover, Direction is the active direction of the rover
  - If the last command of a set touches an obstacle, the rover will output the [O:] string at the beginning

## My process

### Project Bootstrapper

I used Vite ad bootstrapper, it helped me to have a nice and organised directory without too much effort. It also gave me a ready to use local dev environment, bundling and polyfilling

### How to use on your device

- Clone the repo: https://github.com/herecomesfed/mars-rover.git
- Install dependencies
- On your terminal use: `npm run dev`
- You can find more details on how to start the rover simulation directly from the app.

### Built with

- HTML
- CSS
- Vanilla Javascript
- OOP
- TDD

## The classes

### MarsRover

This is the core of the application. It accept the following parameters:
`const rover = new MarsRover(x:string, y: string, direction:string, mars:Mars Object, obstacles: array of Obstacles, instructions: array of instructions)`

#### Methods

##### Private Methods

-\_changeDirection(instruction:string): Turns the rover based on the instruction
-\_moveRover(instruction: string): Move the rover based on the instruction (F: direction + 1, B: direction - 1)
-\_isThereObstacle: Checks if rover will touch an obstacle receiving the next command
-\_updateRoverOutput: Will update the rover when a set of commands is finished

##### Public Methods

-\_readInstructions(instruction:string): Read and perform a single instruction
-\_startSimulation(callbackAfterSingleCommand: function, callbackAfterRowOfCommands: function, callbackAfterLoop: function): Read and perform all instructions, then provide an output string
-\_Accepts three optional callback function for each stage of the simulation (after each command, after a string of commands, after simulation)

##### Getters

-getPosition(): return the rover (x,y)
-getDirection(): return the rover direction
-getFullPosition(): return the rover (x,y,direction)

### Mars

Returns grid coords
`const rover = new Mars(x:string, y: string)`

### Obstacle

Returns single obstacle coords
`const rover = new Obstacle(x:string, y: string)`

## Conclusion

I built this app as an MVP. It is not perfect but it does the job. I learned a lot of thing doing this exercise and got better in logic and view separation.
