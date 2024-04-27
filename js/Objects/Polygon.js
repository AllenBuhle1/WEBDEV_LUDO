export class Polygon {
  constructor(
    context,
    x,
    y,
    spikes,
    outerRadius,
    innerRadius,
    len,
    fillColor,
    strokeColor
  ) {
    this.rot = (Math.PI / 2) * 3;
    let halfLen = len * 0.5;
    let tempX = x * len;
    let tempY = y * len;
    this.posX = tempX + halfLen;
    this.posY = tempY + halfLen;
    this.step = Math.PI / spikes;
    this.spikes = spikes;
    this.context = context;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.len = len * 0.5;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.lineWidth = len;
  }
  draw() {
    let x = this.posX;
    let y = this.posY;
    this.context.beginPath();
    this.context.moveTo(x, y - this.outerRadius);

    for (let i = 0; i < this.spikes; i++) {
      //Moving to outer radius
      x = this.posX + Math.cos(this.rot) * this.outerRadius;
      y = this.posY + Math.sin(this.rot) * this.outerRadius;
      this.context.lineTo(x, y);
      this.rot += this.step;

      //Moving to inner radius
      x = this.posX + Math.cos(this.rot) * this.innerRadius;
      y = this.posY + Math.sin(this.rot) * this.innerRadius;
      this.context.lineTo(x, y);
      this.rot += this.step;
    }
    this.context.lineTo(this.posX, this.posY - this.outerRadius);
    this.context.closePath();
    this.context.strokeStyle = this.strokeColor;
    this.context.stroke();
    this.context.fillStyle = this.fillColor;
    this.context.fill();
  }
}
