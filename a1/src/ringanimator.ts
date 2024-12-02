// linear interpolation from start to end
// using normalized time t (in [0, 1])
const lerp = (start: number, end: number, t: number) =>
  start + (end - start) * t;

export class RingAnimator {
    constructor(
        public startValue: number, 
        public endValue: number, 
        public duration: number, 
        public updateValue: (lineWidth: number) => void
    ) {}

    private _startTime: number | null = null;

    start(time:number) {
        this._startTime = time;
        this._isRunning = true;
    }
    private _isRunning: boolean = false;

    get isRunning() {
        return this._isRunning;
    }

    get startTime() {
        return this._startTime;
    }

    update(time: number) {
        if (!this._isRunning || this._startTime === null) return;

        const t = Math.min(1, (time - this._startTime) / this.duration);
        const current = lerp(this.startValue, this.endValue, t);

        this.updateValue(current);

        if (t >= 1) {
            this._isRunning = false;
            this._startTime = null;
        }
    }

    get circleSize() {
        if (this.startTime === null) return 0;
        const elapsed = performance.now() - this.startTime;
        const t = Math.min(elapsed / this.duration, 1);
        return lerp(this.startValue, this.endValue, t);
    }
}