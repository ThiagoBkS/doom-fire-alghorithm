import { Size } from "./types.js";

export default class CanvasRender {
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
	}

	public drawCell(row: number, column: number, cellSize: Size, hexColor: string) {
		this.context.fillStyle = hexColor;
		this.context.fillRect(
			column * cellSize.width,
			row * cellSize.height,
			cellSize.width,
			cellSize.height
		);
	}

	public changeSize(height: number, width: number) {
		this.canvas.height = height;
		this.canvas.width = width;
	}

	public clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
