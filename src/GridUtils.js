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

    debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this.scene, args), delay);
        };
    }
}
