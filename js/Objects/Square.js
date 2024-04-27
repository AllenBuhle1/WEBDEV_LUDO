import {
  COORDINATE_MAP,
  HOME_POSITIONS,
  INACTIVEPLAYER_OPACITY,
  INACTIVE_OVERLAY,
  PLAYER_COLORS,
  START_POSITION,
  TURNING_POINTS,
} from "../Constants.js";

export class Square {
  constructor(len, x, y, context, color, borderColor, opacity, isActive) {
    this.x = x * len;
    this.y = y * len;
    this.len = len;
    this.context = context;
    this.color = color;
    this.bColor = borderColor;
    this.opacity = opacity;
    this.isActive = isActive;
  }
  fillSqaure(opacity, color) {
    let bw = 1;

    //Drawing Border
    this.context.globalAlpha = 0.8;
    this.context.fillStyle = this.bColor;
    this.context.fillRect(this.x, this.y, this.len, this.len);
    this.context.globalAlpha = 1;

    //Drawing Square
    this.context.globalAlpha = opacity;
    this.context.fillStyle = color;
    this.context.fillRect(
      this.x + bw,
      this.y + bw,
      this.len - 2 * bw,
      this.len - 2 * bw
    );
    this.context.globalAlpha = 1;
  }
  draw() {
    this.fillSqaure(this.opacity, this.color);
    if (!this.isActive) {
      this.fillSqaure(INACTIVEPLAYER_OPACITY, INACTIVE_OVERLAY);
    }
  }
}
/**
 *Method to draw squaare
 * @param {length of each square} len
 * @param {Canvas context} context
 * @param {Color of boarder of the drawn square} borderColor
 * @param {Value to index COORDINATE_MAP} codMapIndex
 * @param {Color of the square} color
 * @param {Opacity of the drawn square Range:[0,1]} opacity
 */
function drawSquare(
  len,
  context,
  borderColor,
  codMapIndex,
  color,
  opacity,
  isActive
) {
  const [x, y] = COORDINATE_MAP[codMapIndex];
  if (opacity >= 0 && opacity <= 1) {
    context.globalAlpha = opacity;
    let sq = new Square(
      len,
      x,
      y,
      context,
      color,
      borderColor,
      opacity,
      isActive
    );
    sq.draw();
    context.globalAlpha = 1;
  }
}
/**
 *Method to Draw game board
 * @param {Canvas context} context
 * @param {Length on each square} len
 */
export function drawGrid(context, len, numPlayer) {
  let white = "#ffffff";
  let borderColor = "#F5F5F5";
  //Drawing General Path
  for (let i = 0; i <= 51; i++) {
    drawSquare(len, context, borderColor, i, white, 1, true);
  }
  //Drawing paths
  for (let i = 0; i <= 5; i++) {
    let homePath = i;
    for (let j = 0; j < 4; j++) {
      homePath += 100;
      if (j >= numPlayer) {
        //Draw path to player home
        drawSquare(
          len,
          context,
          borderColor,
          homePath,
          PLAYER_COLORS[j],
          1,
          false
        );
        //Drawing Start position
        drawSquare(
          len,
          context,
          borderColor,
          START_POSITION[j],
          PLAYER_COLORS[j],
          1,
          false
        );
      } else {
        //Draw path to player home
        drawSquare(
          len,
          context,
          borderColor,
          homePath,
          PLAYER_COLORS[j],
          1,
          true
        );
        //Drawing Start position
        drawSquare(
          len,
          context,
          borderColor,
          START_POSITION[j],
          PLAYER_COLORS[j],
          1,
          true
        );
      }
    }
  }
}
