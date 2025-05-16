export default class DoomFire {
    constructor(canvas) {
        this.canvas = document.getElementById("doom-fire");
        this.context = canvas.getContext("2d");

        this.config = {
            fireInterval: undefined,
            rows: 64,
            columns: 64,
            decayIntensity: 3,
            fps: 24,
        };

        this.fireColorPalette = [
            { "r": 7, "g": 7, "b": 7 },
            { "r": 31, "g": 7, "b": 7 },
            { "r": 47, "g": 15, "b": 7 },
            { "r": 71, "g": 15, "b": 7 },
            { "r": 87, "g": 23, "b": 7 },
            { "r": 103, "g": 31, "b": 7 },
            { "r": 119, "g": 31, "b": 7 },
            { "r": 143, "g": 39, "b": 7 },
            { "r": 159, "g": 47, "b": 7 },
            { "r": 175, "g": 63, "b": 7 },
            { "r": 191, "g": 71, "b": 7 },
            { "r": 199, "g": 71, "b": 7 },
            { "r": 223, "g": 79, "b": 7 },
            { "r": 223, "g": 87, "b": 7 },
            { "r": 223, "g": 87, "b": 7 },
            { "r": 215, "g": 95, "b": 7 },
            { "r": 215, "g": 95, "b": 7 },
            { "r": 215, "g": 103, "b": 15 },
            { "r": 207, "g": 111, "b": 15 },
            { "r": 207, "g": 119, "b": 15 },
            { "r": 207, "g": 127, "b": 15 },
            { "r": 207, "g": 135, "b": 23 },
            { "r": 199, "g": 135, "b": 23 },
            { "r": 199, "g": 143, "b": 23 },
            { "r": 199, "g": 151, "b": 31 },
            { "r": 191, "g": 159, "b": 31 },
            { "r": 191, "g": 159, "b": 31 },
            { "r": 191, "g": 167, "b": 39 },
            { "r": 191, "g": 167, "b": 39 },
            { "r": 191, "g": 175, "b": 47 },
            { "r": 183, "g": 175, "b": 47 },
            { "r": 183, "g": 183, "b": 47 },
            { "r": 183, "g": 183, "b": 55 },
            { "r": 207, "g": 207, "b": 111 },
            { "r": 223, "g": 223, "b": 159 },
            { "r": 239, "g": 239, "b": 199 },
            { "r": 255, "g": 255, "b": 255 }
        ];

        this.maxColorIntensity = this.fireColorPalette.length - 1;

        this.dataStructure = this.create2DArray(this.config.rows, this.config.columns);
        this.setFireSource(this.config.rows - 1, this.maxColorIntensity);
    }

    get cellSize() {
        return {
            height: this.canvas.height / this.config.rows,
            width: this.canvas.width / this.config.columns,
        }
    }

    create2DArray(rows, columns) {
        return Array.from(new Array(rows), () => new Array(columns).fill(0));
    }

    changeDecayIntensity(decay) {
        this.config.decayIntensity = decay;
    }

    changeFireColor(color) {
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
        const imageData = this.context.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let row = 0; row < this.config.rows; row++) {
            for (let col = 0; col < this.config.columns; col++) {
                const intensity = this.dataStructure[row][col];
                const { r, g, b } = this.fireColorPalette[intensity];

                for (let pixelY = 0; pixelY < this.cellSize.width; pixelY++) {
                    for (let pixelX = 0; pixelX < this.cellSize.height; pixelX++) {
                        const pixelXIndex = Math.floor(col * this.cellSize.height + pixelX);
                        const pixelYIndex = Math.floor(row * this.cellSize.width + pixelY);
                        const index = (pixelYIndex * this.canvas.width + pixelXIndex) * 4;

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
        this.fireInterval = setInterval(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.calculateFirePropagation();
            this.renderPixels();
        }, 1000 / this.config.fps);
    }
}