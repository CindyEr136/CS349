// linear interpolation
export const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

//#region Easing Functions

export type EasingFunction = (t: number) => number;

export const flip: EasingFunction = (t) => 1 - t;

// changing the power adjusts the curve
export const easeOut: EasingFunction = (t) => Math.pow(t, 2);

export const easeIn: EasingFunction = (t) => flip(easeOut(flip(t)));

export const easeInOut: EasingFunction = (t) =>
  lerp(easeOut(t), easeIn(t), t);

export const bow: EasingFunction = (a, x = 1) =>
  easeIn(Math.pow(a, 2) * ((x + 1) * a - x));

export const bounce: EasingFunction = (t, x = 1.5) =>
  Math.pow(2, 10 * (t - 1)) * Math.cos(((20 * Math.PI * x) / 3) * t);

//#endregion

// basic animation object
class Animator {
  constructor(
    public startValue: number,
    public endValue: number,
    public duration: number,
    public updateValue: (p: number) => void,
    public easing: EasingFunction = (t) => t
  ) {}

  public startTime: number | undefined;

  start(time: number) {
    this.startTime = time;
    this._isRunning = true;
  }

  get isRunning() {
    return this._isRunning;
  }
  public _isRunning = false;

  update(time: number) {
    if (!this._isRunning || this.startTime === undefined) return;

    // proportion of time elapsed
    const t = Math.min(1, (time - this.startTime) / this.duration);

    // calculate the new value using easing function
    const value = lerp(
      this.startValue,
      this.endValue,
      this.easing(t)
    );

    // call the update callback
    this.updateValue(value);

    if (t === 1) {
      this.startTime = undefined;
      this._isRunning = false;
    }
  }
}

export class CircleAnimator extends Animator{
  private radius: number;
  private angle: number;
  private centerX: number;
  private centerY: number;

  constructor(
    centerX: number,
    centerY: number,
    radius: number,
    public duration: number,
    public updatePosition: (x: number, y: number) => void,
    easing: EasingFunction = (t) => t
  ) {
    super(0, 2 * Math.PI, duration, (a) => this.updateCircularPosition(a), easing);
    this.radius = radius;
    this.angle = 0;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  update(time: number) {
    if (!this.isRunning || this.startTime === undefined) return;

    const t = Math.min(1, (time - this.startTime) / this.duration);
    this.angle = this.easing(t) * 2 * Math.PI;

    this.updateCircularPosition(this.angle);

    if (t === 1) {
      this._isRunning = false;
    }
  }

  private updateCircularPosition(angle: number) {
    const x = this.centerX + this.radius * Math.cos(angle);
    const y = this.centerY + this.radius * Math.sin(angle);
    this.updatePosition(x, y);
  }
}