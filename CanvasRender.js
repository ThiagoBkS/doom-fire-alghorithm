export default class CanvasRender {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this.config = {
            rows: 64,
            columns: 64
        }
    }

    get cellSize() {
        return {
            height: Math.floor(this.canvas.height / this.config.rows),
            width: Math.floor(this.canvas.width / this.config.columns),
        }
    }

    drawCell(row, column, hexColor) {
        this.context.fillStyle = hexColor;

        this.context.fillRect(
            column * this.cellSize.width,
            row * this.cellSize.height,
            this.cellSize.width,
            this.cellSize.height
        );
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}