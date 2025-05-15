import fireColorPalette from "./fireColorPalette.js";

export default class DoomFire {
    constructor(canvas) {
        this.canvas = document.getElementById("doom-fire");
        this.context = canvas.getContext("2d");
        this.config = {
            rows: 64,
            columns: 64
        };

        this.fireColorPalette = fireColorPalette["default"];
        this.maxColorIntensity = this.fireColorPalette.length - 1;

        this.dataStructure = this.create2DArray(this.config.rows, this.config.columns);
        this.setFireSource(this.config.rows - 1, this.maxColorIntensity);
    }

    get pixelSize() {
        return {
            height: this.canvas.height / this.config.rows,
            width: this.canvas.width / this.config.columns,
        }
    }

    create2DArray(rows, columns) {
        return Array.from(new Array(rows), () => new Array(columns).fill(0));
    }

    setFireColor(color) {
        this.fireColorPalette = fireColorPalette[color] || fireColorPalette["default"];
    }

    setFireSource(row, colorIntensity) {
        for (let column = 0; column < this.dataStructure[row].length; column++)
            this.dataStructure[row][column] = colorIntensity;
    }

    getBelowPixelIntensity(row, column) {
        return this.dataStructure[Math.min(row + 1, this.dataStructure.length - 1)][column];
    }

    updateFireIntensity(row, column) {
        const decay = Math.floor(Math.random() * 3);
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
        const imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const { width: pixelWidth, height: pixelHeight } = this.pixelSize;

        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const intensity = this.dataStructure[row][col];
                const { r, g, b } = this.fireColorPalette[intensity];

                for (let y = 0; y < pixelHeight; y++) {
                    for (let x = 0; x < pixelWidth; x++) {
                        const px = Math.floor(col * pixelWidth + x);
                        const py = Math.floor(row * pixelHeight + y);
                        const index = (py * this.canvas.width + px) * 4;

                        data[index] = r;
                        data[index + 1] = g;
                        data[index + 2] = b;
                        data[index + 3] = 255;
                    }
                }
            }
        }

        this.context.putImageData(imageData, 0, 0);
    }

    start() {
        setInterval(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.calculateFirePropagation();
            this.renderPixels();
        }, 20);
    }
}