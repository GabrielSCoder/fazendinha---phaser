export default class GridUtils {
    constructor(scene) {
        this.scene = scene;
    }

    snapToGrid(sprite) {
        const { w, h } = this.getSpriteFootprint(sprite);
        const iso = this.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const clampedX = Phaser.Math.Clamp(startX, 0, this.scene.gridWidth - w);
        const clampedY = Phaser.Math.Clamp(startY, 0, this.scene.gridHeight - h);

        const snapped = this.isoToScreen(clampedX + (w / 2 - 0.5), clampedY + (h / 2 - 0.5));
        sprite.x = snapped.x;
        sprite.y = snapped.y;
    }

    getSpriteFootprint(sprite) {
        if (sprite.footprint) {
            return { w: sprite.footprint[0], h: sprite.footprint[1] };
        }
        return { w: 1, h: 1 };
    }

    isoToScreen(x, y) {
        const w = this.scene.gridSize;
        const h = this.scene.gridSize / 2;
        return {
            x: this.scene.offsetX + (x - y) * (w / 2),
            y: this.scene.offsetY + (x + y) * (h / 2)
        };
    }

    screenToIso(x, y) {
        const w = this.scene.gridSize;
        const h = this.scene.gridSize / 2;
        const isoX = ((x - this.scene.offsetX) / (w / 2) + (y - this.scene.offsetY) / (h / 2)) / 2;
        const isoY = ((y - this.scene.offsetY) / (h / 2) - (x - this.scene.offsetX) / (w / 2)) / 2;
        return { x: isoX, y: isoY };
    }

    checkOccupiedGrid(startX, startY, endX, endY, sprite) {
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x < 0 || y < 0 || x >= this.scene.gridWidth || y >= this.scene.gridHeight) return true;
                const cell = this.scene.gridMap[x][y];
                if (cell && cell !== sprite) return true;
            }
        }
        return false;
    }

    drawMatrix() {
        this.scene.matrixGraphics.clear();

        for (let y = 0; y < this.scene.gridHeight; y++) {
            for (let x = 0; x < this.scene.gridWidth; x++) {
                const occupied = this.scene.gridMap[x][y] ? true : false;
                const color = occupied ? 0xe74c3c : 0x2ecc71;
                this.scene.matrixGraphics.fillStyle(color, 1);
                this.scene.matrixGraphics.fillRect(
                    this.scene.matrixOffsetX + x * 10,
                    this.scene.offsetY + y * 10,
                    10, 10
                );
            }
        }

        this.scene.matrixGraphics.lineStyle(1, 0xffffff, 0.5);
        this.scene.matrixGraphics.strokeRect(
            this.scene.matrixOffsetX,
            this.scene.offsetY,
            this.scene.gridWidth * 10,
            this.scene.gridHeight * 10
        );

        if (!this.scene.matrixLabel) {
            this.scene.matrixLabel = this.scene.add.text(
                this.scene.matrixOffsetX,
                this.scene.offsetY - 20,
                'Matriz de ocupação',
                { fontSize: '14px', color: '#ffffff' }
            );
        }
    }

    markOccupied(sprite, startX, startY, w, h) {
        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                this.scene.gridMap[x][y] = sprite;
            }
        }
        this.drawMatrix();
    }

    clearOccupied(sprite) {
        for (let x = 0; x < this.scene.gridWidth; x++) {
            for (let y = 0; y < this.scene.gridHeight; y++) {
                if (this.scene.gridMap[x][y] === sprite) {
                    this.scene.gridMap[x][y] = null;
                }
            }
        }
        this.drawMatrix();
    }

    drawFootprints() {
        this.scene.footprintGraphics.clear();
        for (let sprite of this.scene.sprites) {
            const { w, h } = this.getSpriteFootprint(sprite);
            const iso = this.screenToIso(sprite.x, sprite.y, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    const p1 = this.isoToScreen(startX + i, startY + j, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p2 = this.isoToScreen(startX + i + 1, startY + j, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p3 = this.isoToScreen(startX + i + 1, startY + j + 1, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p4 = this.isoToScreen(startX + i, startY + j + 1, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);

                    this.scene.footprintGraphics.fillStyle(0xff0000, 0.25);
                    this.scene.footprintGraphics.beginPath();
                    this.scene.footprintGraphics.moveTo(p1.x, p1.y);
                    this.scene.footprintGraphics.lineTo(p2.x, p2.y);
                    this.scene.footprintGraphics.lineTo(p3.x, p3.y);
                    this.scene.footprintGraphics.lineTo(p4.x, p4.y);
                    this.scene.footprintGraphics.closePath();
                    this.scene.footprintGraphics.fillPath();
                }
            }
        }
    }

    debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this.scene, args), delay);
        };
    }
}
