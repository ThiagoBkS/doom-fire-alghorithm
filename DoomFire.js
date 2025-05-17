import { generateHSLPalette } from "./functions.js";
import CanvasRender from "./CanvasRender.js";

export default class DoomFire {
    constructor(canvas) {
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
            isFireOn: true,
            maxPaletteIntensity: this.fireColorPalette.length,
            animation: undefined,
            lastFrameTime: undefined,
            rows: 64,
            columns: 64,
            decayIntensity: 3,
            fps: 24,
        };

        this.canvasRender = new CanvasRender(canvas, {
            rows: this.config.rows,
            columns: this.config.columns,
        });
        this.dataStructure = this.create2DArray(this.config.rows, this.config.columns);
        this.setFireSource(this.config.rows - 1, this.config.maxPaletteIntensity);
    }

    create2DArray(rows, columns) {
        return Array.from({ length: rows }, () => new Array(columns).fill(0));
    }

    changePaletteColor(hue) {
        this.fireColorPalette = generateHSLPalette(hue, this.config.maxPaletteIntensity);
    }

    changeDecayIntensity(decay) {
        this.config.decayIntensity = decay;
    }

    changePixelIntensity(row, column, newIntensity) {
        if (this.dataStructure[row]?.[column] !== undefined)
            this.dataStructure[row][column] = newIntensity;
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
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const intensity = this.dataStructure[row][col];
                const hexColor = this.fireColorPalette[intensity];

                this.canvasRender.drawCell(row, col, hexColor);
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

        this.config.animation = requestAnimationFrame((time) => this.requestFrame(time));
    }

    start() {
        this.config.animation = requestAnimationFrame((time) => this.requestFrame(time))
    }

    stop() {
        cancelAnimationFrame(this.config.animation);
    }
}