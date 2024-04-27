import {
  BASE_POSITION,
  COORDINATE_MAP,
  PLAYER_COLORS,
  START_POSITION,
  TURNING_POINTS,
  WHITE,
} from "../Constants.js";
export class Piece {
  constructor(c, x, y, len, color) {
    this.context = c;

    this.radBoarder = len * 0.4;
    this.rad = this.radBoarder * 0.8;
    this.x = x * len;
    this.twoPI = 2 * Math.PI;

    this.y = y * len;
    this.color = color;
    this.len = len;
  }
  draw() {
    //Draw boarder
    this.context.beginPath();
    this.context.fillStyle = WHITE;
    this.context.arc(this.x, this.y, this.radBoarder, 0, this.twoPI);
    this.context.fill();
  }
}

export function drawPiece(context, len) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const [x, y] = COORDINATE_MAP[BASE_POSITION[i][j]];
      let piece = new Piece(context, x, y, len, WHITE);
      piece.draw();
    }
  }
}
