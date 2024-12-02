import {
  SKButton,
  SKButtonProps,
  SKMouseEvent,
} from "simplekit/imperative-mode";

export class DisabledButton extends SKButton {
  private _disabled: boolean = false;
  private _disabledColour: boolean = true;
  private _previous: boolean = false;

  constructor({
    disabled = false,
    disabledColour = true,
    ...props
  }: { disabled?: boolean; disabledColour?: boolean } & SKButtonProps = {}) {
    super(props);
    this._disabled = disabled;
    this._disabledColour = disabledColour;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._previous = this._disabled;
    this._disabled = value;
  }

  get disabledColour() {
    return this._disabledColour;
  }

  set disabledColour(value: boolean) {
    this._disabledColour = value;
  }

  handleMouseEvent(me: SKMouseEvent) {
    if (this._disabled) return false;
    return super.handleMouseEvent(me);
  }

  draw(gc: CanvasRenderingContext2D) {
    if (
      this._disabled &&
      (this._disabledColour || (!this._disabledColour && this._previous))
    ) {
      gc.save();
      const w = this.paddingBox.width;
      const h = this.paddingBox.height;

      gc.translate(this.margin, this.margin);

      gc.beginPath();
      gc.roundRect(this.x, this.y, w, h, 4);
      gc.fillStyle = "lightgrey";
      gc.strokeStyle = "grey";
      gc.lineWidth = 2;
      gc.fill();
      gc.stroke();

      gc.font = this.font;
      gc.fillStyle = "grey";
      gc.textAlign = "center";
      gc.textBaseline = "middle";
      gc.fillText(this.text, this.x + w / 2, this.y + h / 2);
      gc.restore();
    } else {
      super.draw(gc);
    }
  }
}
