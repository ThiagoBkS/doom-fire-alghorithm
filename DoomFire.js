import { generateHSLPalette } from "./functions.js";
import defaultPalette from "./defaultPalette.js";

export default class DoomFire {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.config = {
            maxPalleteIntensity: defaultPalette.length,
            isFadeFireActive: false,
            fadeFireIntensity: 0,
            animation: undefined,
            lastFrameTime: undefined,
            isFireOn: false,
            rows: 64,
            columns: 64,
            decayIntensity: 3,
            fps: 24,
        };

        this.fireColorPalette = defaultPalette;
        this.maxColorIntensity = this.fireColorPalette.length - 1;
        this.dataStructure = this.create2DArray(this.config.rows, this.config.columns);
        this.setFireSource(this.config.rows - 1, this.maxColorIntensity);

        this.canvas.onmousemove = (event) => this.config.isFadeFireActive && this.fadeFireOnHoverEffect(event.offsetX, event.offsetY);
    }

    get cellSize() {
        return {
            height: this.canvas.height / this.config.rows,
            width: this.canvas.width / this.config.columns,
        }
    }

    fadeFireOnHoverEffect(offsetX, offsetY) {
        const hoveredRow = parseInt(offsetY / this.cellSize.width);
        const hoveredColumn = parseInt(offsetX / this.cellSize.height);

        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

        directions.forEach(([dirX, dirY]) => {
            const row = Math.min(hoveredRow + dirX, Math.max(this.dataStructure.length - 1, 0));
            const column = Math.min(hoveredColumn + dirY, Math.max(this.dataStructure[row - dirX]?.length - 1, 0));

            this.changePixelIntensity(row, column, this.config.fadeFireIntensity);
        });
    }

    create2DArray(rows, columns) {
        return Array.from(new Array(rows), () => new Array(columns).fill(0));
    }

    changePaletteColor(hue) {
        this.fireColorPalette = generateHSLPalette(hue, this.config.maxPalleteIntensity);
    }

    changeDecayIntensity(decay) {
        this.config.decayIntensity = decay;
    }

    changePixelIntensity(row, column, newIntensity) {
        if (this.dataStructure[row] && this.dataStructure[row][column])
            this.dataStructure[row][column] = newIntensity;
    }

    setFireSource(row, colorIntensity) {
        for (let column = 0; column < this.dataStructure[row].length; column++)
            this.dataStructure[row][column] = colorIntensity;
    }

    getBelowPixelIntensity(row, column) {
        return this.dataStructure[Math.min(row + 1, this.dataStructure.length - 1)][column];
    }

    updateFireIntensity(row, column) {
        const decay = Math.floor(Math.random() * this.config.decayIntensity);

        const belowPixel = this.getBelowPixelIntensity(row, column);
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

    renderPixels() {
        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const intensity = this.dataStructure[row][col];
                const hexColor = this.fireColorPalette[intensity];

                this.context.fillStyle = hexColor;
                this.context.fillRect(
                    col * this.cellSize.width,
                    row * this.cellSize.height,
                    this.cellSize.width,
                    this.cellSize.height
                );
            }
        }
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.clearCanvas();
        this.calculateFirePropagation();
        this.renderPixels();
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