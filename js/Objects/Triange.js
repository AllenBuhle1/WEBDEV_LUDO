import { INACTIVEPLAYER_OPACITY, INACTIVE_OVERLAY } from "../Constants.js";

export class Triangle {
  constructor(context, start, sec, last, fillColor, len, isActive) {
    this.start = [start[0] * len, start[1] * len];
    this.sec = [sec[0] * len, sec[1] * len];
    this.last = [last[0] * len, last[1] * len];
    this.fillColor = fillColor;
    this.len = len;
    this.context = context;
    this.isActive = isActive;
  }
  fillTriangle(opacity, color) {
    this.context.globalAlpha = opacity;
    this.context.beginPath();
    this.context.moveTo(this.start[0], this.start[1]);
    this.context.lineTo(this.sec[0], this.sec[1]);
    this.context.lineTo(this.last[0], this.last[1]);
    this.context.lineTo(this.start[0], this.start[1]);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
    this.context.globalAlpha = 1;
  }
  draw() {
    let opacity = 1;
    this.fillTriangle(1, this.fillColor);
    if (!this.isActive) {
      opacity = INACTIVEPLAYER_OPACITY;
      this.fillTriangle(opacity, INACTIVE_OVERLAY);
    }
  }
}
