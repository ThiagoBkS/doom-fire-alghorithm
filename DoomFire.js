import { generateHSLPalette } from "./functions.js";
import CanvasRender from "./CanvasRender.js";

export default class DoomFire {
    constructor(canvas) {
        this.canvasRender = new CanvasRender(canvas);
        this.fireColorPalette = [
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
            "#ffffff"
        ];

        this.config = {
            fps: 24,
            matrixSize: 64,
            decayIntensity: 3,
            animationFrame: undefined,
            lastFrameTime: undefined,
            maxPaletteIntensity: this.fireColorPalette.length,
        };

        this.dataStructure = this.createMatrixArray(this.config.matrixSize);
        this.setFireSource(this.dataStructure.length - 1, this.config.maxPaletteIntensity);
    }

    get cellSize() {
        return {
            height: (this.canvasRender.canvas.height / this.config.matrixSize),
            width: (this.canvasRender.canvas.width / this.config.matrixSize),
        }
    }

    changeMatrixSize(matrixSize) {
        this.config.matrixSize = matrixSize;

        this.dataStructure = this.createMatrixArray(matrixSize);
        this.setFireSource(this.dataStructure.length - 1, this.config.maxPaletteIntensity);
    }

    changeFPS(fps) {
        this.config.fps = fps;
    }

    changeQuality(height, width) {
        this.canvasRender.changeSize(height, width)
    }

    changeDecayIntensity(decay) {
        this.config.decayIntensity = decay;
    }

    changePaletteColor(hue) {
        this.fireColorPalette = generateHSLPalette(hue, this.config.maxPaletteIntensity);
    }

    changePixelIntensity(row, column, newIntensity) {
        if (this.dataStructure[row]?.[column] !== undefined)
            this.dataStructure[row][column] = newIntensity;
    }

    createMatrixArray(matrixSize) {
        return Array.from({ length: matrixSize }, () => new Array(matrixSize).fill(0));
    }

    setFireSource(row, colorIntensity) {
        for (let column = 0; column < this.dataStructure[row].length; column++)
            this.dataStructure[row][column] = colorIntensity;
    }

    getBelowCellIntensity(row, column) {
        return this.dataStructure[Math.min(row + 1, this.dataStructure.length - 1)][column];
    }

    updateFireIntensity(row, column) {
        const decay = Math.floor(Math.random() * this.config.decayIntensity);

        const belowPixel = this.getBelowCellIntensity(row, column);
        const newFireIntensity = belowPixel - decay >= 0 ? belowPixel - decay : 0;

        this.dataStructure[row][column] = newFireIntensity;
    }

    calculateFirePropagation() {
        for (let row = 0; row < this.dataStructure.length - 1; row++) {
            for (let column = 0; column < this.dataStructure[row].length; column++) {
                this.updateFireIntensity(row, column);
            }
        }
    }

    renderCells() {
        for (let row = 0; row < this.dataStructure.length; row++) {
            for (let column = 0; column < this.dataStructure[row].length; column++) {
                const colorIntensity = this.dataStructure[row][column];
                const hexColor = this.fireColorPalette[colorIntensity];

                this.canvasRender.drawCell(row, column, this.cellSize, hexColor);
            }
        }
    }

    render() {
        this.canvasRender.clearCanvas();
        this.calculateFirePropagation();
        this.renderCells();
    }

    requestFrame(timestamp) {
        if (!this.config.lastFrameTime) this.config.lastFrameTime = timestamp;
        const elapsedTime = timestamp - this.config.lastFrameTime;

        if (elapsedTime > 1000 / this.config.fps) {
            this.config.lastFrameTime = timestamp;
            this.render();
        };

        this.config.animationFrame = requestAnimationFrame((time) => this.requestFrame(time));
    }

    start() {
        this.config.animationFrame = requestAnimationFrame((time) => this.requestFrame(time))
    }

    stop() {
        cancelAnimationFrame(this.config.animationFrame);
    }
}