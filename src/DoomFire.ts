import CanvasRender from "./CanvasRender.js";
import { generateHSLPalette } from "./functions.js";
import { Size } from "./types.js";

export default class DoomFire {
	private canvasRender: CanvasRender;
	private colorPalette: Array<string>;
	private config: {
		fps: number;
		matrixSize: number;
		decayIntensity: number;
		maxPaletteIntensity: number;
		animationFrame: undefined | number;
		lastFrameTime: undefined | number;
		windDirection: number;
	};
	private dataStructure: Array<Array<number>>;

	constructor(canvas: HTMLCanvasElement) {
		this.canvasRender = new CanvasRender(canvas);
		this.colorPalette = [
			"#070707",
			"#1f0707",
			"#2f0f07",
			"#470f07",
			"#571707",
			"#671f07",
			"#771f07",
			"#8f2707",
			"#9f2f07",
			"#af3f07",
			"#bf4707",
			"#c74707",
			"#df4f07",
			"#df5707",
			"#df5707",
			"#d75f07",
			"#d75f07",
			"#d7670f",
			"#cf6f0f",
			"#cf770f",
			"#cf7f0f",
			"#cf8717",
			"#c78717",
			"#c78f17",
			"#c7971f",
			"#bf9f1f",
			"#bf9f1f",
			"#bfa727",
			"#bfa727",
			"#bfaf2f",
			"#b7af2f",
			"#b7b72f",
			"#b7b737",
			"#cfcf6f",
			"#dfdf9f",
			"#efefc7",
			"#ffffff",
		];
		this.config = {
			fps: 24,
			matrixSize: 64,
			decayIntensity: 3,
			maxPaletteIntensity: this.colorPalette.length,
			animationFrame: undefined,
			lastFrameTime: undefined,
			windDirection: 0,
		};

		this.dataStructure = this.createMatrixArray(this.config.matrixSize);
		this.setFireSource(this.dataStructure.length - 1, this.config.maxPaletteIntensity);
	}

	get cellSize(): Size {
		return {
			height: this.canvasRender.canvas.height / this.config.matrixSize,
			width: this.canvasRender.canvas.width / this.config.matrixSize,
		};
	}

	public changeMatrixSize(matrixSize: number) {
		this.config.matrixSize = matrixSize;

		this.dataStructure = this.createMatrixArray(matrixSize);
		this.setFireSource(this.dataStructure.length - 1, this.config.maxPaletteIntensity);
	}

	public changeFPS(fps: number): void {
		this.config.fps = fps;
	}

	public changeQuality(height: number, width: number): void {
		this.canvasRender.changeSize(height, width);
	}

	public changeDecayIntensity(decay: number): void {
		this.config.decayIntensity = decay;
	}

	public changePaletteColor(hue: number): void {
		this.colorPalette = generateHSLPalette(hue, this.config.maxPaletteIntensity);
	}

	public changePixelIntensity(row: number, column: number, newIntensity: number): void {
		if (this.dataStructure[row]?.[column] !== undefined)
			this.dataStructure[row][column] = newIntensity;
	}

	public changeWindDirection(direction: string) {
		switch (direction) {
			case "LEFT":
				this.config.windDirection = -1;
				break;
			case "RIGHT":
				this.config.windDirection = 1;
				break;
			default:
				this.config.windDirection = 0;
		}
	}

	private createMatrixArray(matrixSize: number): Array<Array<number>> {
		return Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
	}

	private setFireSource(row: number, colorIntensity: number): void {
		for (let column = 0; column < this.dataStructure[row].length; column++)
			this.dataStructure[row][column] = colorIntensity;
	}

	private getBelowCellIntensity(row: number, column: number): number {
		return this.dataStructure[Math.min(row + 1, this.dataStructure.length - 1)][column];
	}

	private updateFireIntensity(row: number, column: number): void {
		const decay = Math.floor(Math.random() * this.config.decayIntensity);

		const belowPixel = this.getBelowCellIntensity(row, column);
		const newFireIntensity = Math.max(belowPixel - decay, 0);

		const windOffset = Math.floor(Math.random() * 2) * this.config.windDirection;
		const newColumn = Math.min(Math.max(column + windOffset, 0), this.config.matrixSize - 1);

		this.dataStructure[row][newColumn] = newFireIntensity;
	}

	private calculateFirePropagation(): void {
		for (let row = 0; row < this.dataStructure.length - 1; row++) {
			for (let column = 0; column < this.dataStructure[row].length; column++) {
				this.updateFireIntensity(row, column);
			}
		}
	}

	private renderCells(): void {
		for (let row = 0; row < this.dataStructure.length; row++) {
			for (let column = 0; column < this.dataStructure[row].length; column++) {
				const colorIntensity = this.dataStructure[row][column];
				const hexColor = this.colorPalette[colorIntensity];

				this.canvasRender.drawCell(row, column, this.cellSize, hexColor);
			}
		}
	}

	private render(): void {
		this.canvasRender.clearCanvas();
		this.calculateFirePropagation();
		this.renderCells();
	}

	private requestFrame(timestamp: number): void {
		if (!this.config.lastFrameTime) this.config.lastFrameTime = timestamp;
		const elapsedTime = timestamp - this.config.lastFrameTime;

		if (elapsedTime > 1000 / this.config.fps) {
			this.config.lastFrameTime = timestamp;
			this.render();
		}

		this.config.animationFrame = requestAnimationFrame((time) => this.requestFrame(time));
	}

	public start(): void {
		this.config.animationFrame = requestAnimationFrame((time) => this.requestFrame(time));
	}
}
