// linear interpolation from start to end
// using normalized time t (in [0, 1])
const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

export class LineAnimator {
    public start: { x: number, y: number };
    public end: { x: number, y: number };
    public colour: string;
    private startTime: number;
    private duration: number;
    private progress: number;
    private _isRunning: boolean;

    constructor(start: { x: number, y: number }, end: { x: number, y: number }, colour: string, duration: number = 750) {
        this.start = start;
        this.end = end;
        this.colour = colour;
        this.duration = duration;
        this.startTime = performance.now();
        this.progress = 0;
        this._isRunning = true;
    }

    update(time: number){
        this.progress = Math.min(1, (time - this.startTime) / this.duration);
        this._isRunning = this.progress < 1;
    }

    draw(gc: CanvasRenderingContext2D) {
        const currentX = lerp(this.start.x, this.end.x, this.progress);
        const currentY = lerp(this.start.y, this.end.y, this.progress);
        gc.strokeStyle = this.colour;
        gc.lineWidth = 5;
        gc.beginPath();
        gc.moveTo(this.start.x, this.start.y);
        gc.lineTo(currentX, currentY);
        gc.stroke();
    }

    get isRunning() {
        return this._isRunning;
    }
}