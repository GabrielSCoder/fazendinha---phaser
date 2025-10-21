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

    drawCharFootprints() {
        const charSprite = this.scene.boneco;

        const { w, h } = this.getSpriteFootprint(charSprite);
        const iso = this.screenToIso(charSprite.x, charSprite.y, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
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

    debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this.scene, args), delay);
        };
    }

    recalculateDepthAround(sprite, radius = 3) {
        const targetX = sprite.x;
        const targetY = sprite.y;

        const neighbors = this.scene.sprites.filter(s => {
            const dx = Math.abs(s.x - targetX);
            const dy = Math.abs(s.y - targetY);
            return dx <= radius * this.scene.gridSize && dy <= radius * this.scene.gridSize;
        });

        neighbors.forEach(s => {
            s.setDepth(s.y + s.x * 0.001);
        });
    }

    recalculateAllDepths() {
        this.scene.sprites.forEach(s => {
            s.setDepth(s.y + s.x * 0.001);
        });
    }

    getMouseWorldPosition() {
        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);
        return worldPoint;
    }

    findPath(start, goal, grid) {
        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const key = (x, y) => `${x},${y}`;

        gScore.set(key(start.x, start.y), 0);
        fScore.set(key(start.x, start.y), this.heuristic(start, goal));

        // --- Adiciona diagonais ---
        const dirs = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: -1 }
        ];

        while (openSet.length > 0) {
            // menor fScore
            openSet.sort((a, b) => fScore.get(key(a.x, a.y)) - fScore.get(key(b.x, b.y)));
            const current = openSet.shift();

            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }

            for (const dir of dirs) {
                const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
                const nKey = key(neighbor.x, neighbor.y);
                const cKey = key(current.x, current.y);

                // checar limites e colisão
                if (neighbor.x < 0 || neighbor.y < 0 || neighbor.x >= grid.width || neighbor.y >= grid.height)
                    continue;
                if (grid.isOccupied(neighbor.x, neighbor.y))
                    continue;

                // custo diagonal = √2, horizontal/vertical = 1
                const cost = (dir.x !== 0 && dir.y !== 0) ? Math.SQRT2 : 1;
                const tentative = gScore.get(cKey) + cost;

                if (!gScore.has(nKey) || tentative < gScore.get(nKey)) {
                    cameFrom.set(nKey, current);
                    gScore.set(nKey, tentative);
                    fScore.set(nKey, tentative + this.heuristic(neighbor, goal));
                    if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y))
                        openSet.push(neighbor);
                }
            }
        }

        return []; // sem caminho
    }

    // --- Distância Euclidiana como heurística ---
    heuristic(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        const key = (x, y) => `${x},${y}`;
        while (cameFrom.has(key(current.x, current.y))) {
            current = cameFrom.get(key(current.x, current.y));
            totalPath.unshift(current);
        }
        return totalPath;
    }


    markGround(startX, startY, w, h, value = 'ground') {
        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                if (x < 0 || y < 0 || x >= this.scene.gridWidth || y >= this.scene.gridHeight) continue;
                this.scene.gridMap[x][y] = value;
            }
        }
        this.drawMatrix();
    }

    checkOccupiedBlock(startX, startY, w, h) {
        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                // Ignora tiles fora do grid
                if (x < 0 || y < 0 || x >= this.scene.gridWidth || y >= this.scene.gridHeight) return true;

                const cell = this.scene.gridMap[x][y];
                if (cell) return true; // Se tiver qualquer valor (ground ou sprite), já está ocupado
            }
        }
        return false; // nenhum tile ocupado
    }

    drawPathDebug(path, color = 0x00aaff) {
        if (this.pathDebugTiles) {
            this.pathDebugTiles.forEach(tile => tile.destroy());
        }
        this.pathDebugTiles = [];

        for (let i = 0; i < path.length; i++) {
            const { x, y } = path[i];

            // converte os 4 cantos reais da célula
            const cornersIso = [
                { x: x, y: y },
                { x: x + 1, y: y },
                { x: x + 1, y: y + 1 },
                { x: x, y: y + 1 },
            ];

            const cornersScreen = cornersIso.map(c => this.isoToScreen(c.x, c.y));

            // define cor especial para início e fim
            let fillColor = color;
            if (i === 0) fillColor = 0x00ff00;
            else if (i === path.length - 1) fillColor = 0xff0000;

            // converte para array [x1, y1, x2, y2, ...]
            const points = [];
            for (const c of cornersScreen) points.push(c.x, c.y);

            // cria o polígono alinhado ao grid real
            const tile = this.scene.add.polygon(0, 0, points, fillColor, 0.45)
                .setOrigin(0, 0);

            this.pathDebugTiles.push(tile);

            if (this.scene.cameraController?.ignoreInUICamera)
                this.scene.cameraController.ignoreInUICamera([tile]);
        }
    }


}
