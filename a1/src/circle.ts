import { Drawable } from "./drawable";

export class Circle implements Drawable {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public radius: number = 30,
    public fill: string = "white",
    public label: string,
    public labelColour: string,
    public outline = 0,
    public outlineColour = "",
    public outerLine = 0,
    public outerLineColour = ""
  ) {}

  draw(gc: CanvasRenderingContext2D) {
    if (this.outerLine > 0) {
        gc.strokeStyle = this.outerLineColour;
        gc.lineWidth = 3;
        gc.beginPath()
        gc.arc(this.x, this.y, this.radius + this.outline + this.outerLine / 2, 0, 2 * Math.PI);
        gc.stroke();
    }

    if (this.outline > 0)  {
        gc.lineWidth = this.outline;
        gc.strokeStyle = this.outlineColour;
        gc.beginPath();
        gc.arc(this.x, this.y, this.radius + this.outline / 2, 0, 2 * Math.PI);
        gc.stroke();
    }

    gc.fillStyle = this.fill;
    gc.beginPath();
    gc.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    gc.fill();

    //label
    gc.fillStyle = this.labelColour; //label colour
    gc.font = "20px sans-serif"; //label font
    gc.textAlign = "center";
    gc.textBaseline = "middle";
    gc.fillText(this.label, this.x, this.y);
    
  }

  hitTest (mx: number, my: number) {
    const dx = mx - this.x;
    const dy = my - this.y;
    //return Math.sqrt(dx*dx+dy*dy) <= this.radius;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}
