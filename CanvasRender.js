export default class CanvasRender {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	}

	drawCell(row, column, cellSize, hexColor) {
		this.context.fillStyle = hexColor;

		this.context.fillRect(
			column * cellSize.width,
			row * cellSize.height,
			cellSize.width,
			cellSize.height
		);
	}

	changeSize(height, width) {
		this.canvas.height = height;
		this.canvas.width = width;
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
