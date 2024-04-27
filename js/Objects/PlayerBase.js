import {
  BLACK,
  INACTIVEPLAYER_OPACITY,
  INACTIVE_OVERLAY,
  SPRITE_LEN,
  STATE,
} from "../Constants.js";

export class Base {
  constructor(context, x, y, len, color, isActive, playerNum, img) {
    this.x = x * len;
    this.y = y * len;
    this.len = len * 6;
    this.stepLen = len;
    this.innerLen = len * 4;
    this.context = context;
    this.color = color;
    this.playerNum = playerNum;
    this.isActive = isActive;
    this.img = new Image();
    this.img.src = img;
    this.isWaitingToMove = false;
    this.blinkerIterator = 0;
    this.frameX = this.blinkerIterator;
    this.frameY = (this.playerNum + 4) * SPRITE_LEN;
  }
  blink(isDiceRolled) {
    if (isDiceRolled === STATE.DICE_ROLLED) {
      this.blinkerIterator += 1;
      if (this.blinkerIterator > 10) {
        this.blinkerIterator = 0;
      }
      this.frameX = this.blinkerIterator * SPRITE_LEN;
      this.draw();
    }
  }
  draw() {
    let opacity = 1;

    // //Draw background manual
    // this.context.beginPath();
    // this.context.fillStyle = this.color;
    // this.context.fillRect(this.x, this.y, this.len, this.len);

    this.context.drawImage(
      this.img,
      this.frameX,
      this.frameY,
      SPRITE_LEN,
      SPRITE_LEN,
      this.x,
      this.y,
      this.len,
      this.len
    );
    //Draw The shade
    this.context.globalAlpha = 0.15;
    this.context.fillStyle = BLACK;
    //To change to round Rectangle
    this.context.fillRect(
      this.x + this.stepLen,
      this.y + this.stepLen,
      this.innerLen,
      this.innerLen
    );
    if (!this.isActive) {
      opacity = INACTIVEPLAYER_OPACITY;
      this.context.globalAlpha = opacity;
      this.context.fillStyle = INACTIVE_OVERLAY;
      this.context.fillRect(this.x, this.y, this.len, this.len);
      this.context.globalAlpha = 1;
    }
  }
}
