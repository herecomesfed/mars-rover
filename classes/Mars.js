export class Mars {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  checkGridLimits(roverX, roverY) {
    roverX >= this.x && (roverX = 0);
    roverX < 0 && (roverX = this.x - 1);
    roverY >= this.y && (roverY = 0);
    roverY < 0 && (roverY = this.y - 1);

    return { roverX, roverY };
  }
}
