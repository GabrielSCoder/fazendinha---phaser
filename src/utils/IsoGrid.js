export default class IsoGrid {
    constructor(scene, gridWidth = 16, gridHeight = 16, gridSize = 64, offsetX = 400, offsetY = 100) {
        this.scene = scene;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gridSize = gridSize;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(1, 0x00ff00, 0.3);

        this.drawGrid();
    }

    drawGrid() {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const p1 = this.isoToScreen(x, y);
                const p2 = this.isoToScreen(x + 1, y);
                const p3 = this.isoToScreen(x + 1, y + 1);
                const p4 = this.isoToScreen(x, y + 1);

                this.graphics.beginPath();
                this.graphics.moveTo(p1.x, p1.y);
                this.graphics.lineTo(p2.x, p2.y);
                this.graphics.lineTo(p3.x, p3.y);
                this.graphics.lineTo(p4.x, p4.y);
                this.graphics.closePath();
                this.graphics.strokePath();
            }
        }
    }

    isoToScreen(x, y) {
        const w = this.gridSize;
        const h = this.gridSize / 2;
        return { x: this.offsetX + (x - y) * (w / 2), y: this.offsetY + (x + y) * (h / 2) };
    }

    screenToIso(x, y) {
        const w = this.gridSize;
        const h = this.gridSize / 2;
        const isoX = ((x - this.offsetX) / (w / 2) + (y - this.offsetY) / (h / 2)) / 2;
        const isoY = ((y - this.offsetY) / (h / 2) - (x - this.offsetX) / (w / 2)) / 2;
        return { x: isoX, y: isoY };
    }
}
