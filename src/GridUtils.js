export default class GridUtils {
    constructor(scene) {
        this.scene = scene;
    }

    snapToGrid(sprite) {
        const { w, h } = this.getSpriteFootprint(sprite);
        const iso = this.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const maxW = this.scene.gridMap.length;
        const maxH = this.scene.gridMap[0].length;

        const clampedX = Phaser.Math.Clamp(startX, 0, maxW - w);
        const clampedY = Phaser.Math.Clamp(startY, 0, maxH - h);

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
                if (x < 0 || y < 0 ||
                    x >= this.scene.gridMap.length ||
                    y >= this.scene.gridMap[0].length)
                    return true;
                const cell = this.scene.gridMap[x][y];
                if (cell && cell !== sprite) return true;
            }
        }
        return false;
    }

    drawMatrix() {
        this.scene.matrixGraphics.clear();

        for (let y = 0; y < this.scene.gridHeight * 2; y++) {
            for (let x = 0; x < this.scene.gridWidth * 2; x++) {
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
            this.scene.gridWidth * 20,
            this.scene.gridHeight * 20
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
        for (let x = 0; x < this.scene.gridWidth * 2; x++) {
            for (let y = 0; y < this.scene.gridHeight * 2; y++) {
                if (this.scene.gridMap[x][y] === sprite) {
                    this.scene.gridMap[x][y] = null;
                }
            }
        }
        this.drawMatrix();
    }

    clearOccupiedtile(x, y) {
        if (x >= this.scene.gridWidth * this.scene.logicalFactor || y >= this.scene.gridHeight * this.scene.logicalFactor) return;
        this.scene.gridMap[x][y] = null;
        this.drawMatrix();
    }

    addOccupiedTile(x, y, sprite) {
        if (x >= this.scene.gridWidth * this.scene.logicalFactor || y >= this.scene.gridHeight * this.scene.logicalFactor || !sprite) return;
        this.scene.gridMap[x][y] = sprite;
        this.drawMatrix();
    }

    drawFootprints() {
        this.scene.footprintGraphics.clear();
        for (let sprite of this.scene.sprites) {
            const { w, h } = this.getSpriteFootprint(sprite);
            const iso = this.screenToIso(sprite.x, sprite.y);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    const p1 = this.isoToScreen(startX + i, startY + j, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p2 = this.isoToScreen(startX + i + 1, startY + j, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p3 = this.isoToScreen(startX + i + 1, startY + j + 1, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);
                    const p4 = this.isoToScreen(startX + i, startY + j + 1, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);

                    this.scene.footprintGraphics.fillStyle(0x2ecc71, 0.25);
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
        const targetIso = this.screenToIso(targetX, targetY);

        const neighbors = this.scene.sprites.filter(s => {
            const dx = Math.abs(s.x - targetX);
            const dy = Math.abs(s.y - targetY);
            return dx <= radius * this.scene.gridSize && dy <= radius * this.scene.gridSize && s.tipo !== "cerca";
        });

        const neighborsFences = this.scene.sprites.filter(s => {
            const dx = Math.abs(s.x - targetX);
            const dy = Math.abs(s.y - targetY);
            return dx <= radius * this.scene.gridSize && dy <= radius * this.scene.gridSize && s.tipo === "cerca";
        });

        console.log("----------------- normais : \n" + neighbors);
        console.log("----------------- cercas: \n" + neighborsFences);

        // neighbors.forEach(s => {

        //     const iso = this.screenToIso(s.x, s.y);
        //     const convertIsoX = Math.ceil(iso.x);
        //     const convertIsoY = Math.ceil(iso.y);

        //     let calc = convertIsoX + convertIsoY * 1.001

        //     console.log("tipo: " + s.tipo + ` depth de: ${calc}`)
        //     s.setDepth(calc);
        // });

        neighborsFences.forEach(s => {

            const iso = this.screenToIso(s.x, s.y);
            const convertIsoX = Math.ceil(iso.x);
            const convertIsoY = Math.ceil(iso.y);

            let calc = convertIsoX + convertIsoY * 1.001

            // s.setDepth(calc);
            // console.log(convertIsoY, targetIso.y);
            // const lefty = convertIsoY > targetIso.y;
            // lefty ? calc -= 0.2 : calc += 0.2
            // console.log(lefty);
            // sprite.setDepth(calc)
            // console.log("tipo: " + s.tipo + ` depth de: ${calc}`)

            const closeNeighbors = neighbors.filter(n => {
                if (n === s) return false;

                const isoN = this.screenToIso(n.x, n.y);

                const dx = Math.abs(isoN.x - convertIsoX);
                const dy = Math.abs(isoN.y - convertIsoY);

                return dx <= 2 && dy <= 2;
            });

            if (closeNeighbors) {

                closeNeighbors.forEach(n => {
                    const isoN = this.screenToIso(n.x, n.y);
                    const neighborDepth = Math.ceil(isoN.x) + Math.ceil(isoN.y) * 1.001;
                    const diff = Math.abs(calc - neighborDepth);

                    console.log("Depth do vizinho: " + neighborDepth);
                    console.log("diferença entre os dois: " + diff);
                    console.log("calculo atual: " + calc);

                    const isLeft = convertIsoY > isoN.y;
                    const isTop = convertIsoX > isoN.x;

                    if (diff < 1) {
                        if (calc > neighborDepth) calc -= 0.2;
                        else calc += 0.2;
                    }
                    
                    n.setDepth(calc);
                })


                

                // } else {
                //     if (s.flipX && convertIsoX < isoN.x) {
                //         console.log("diff maior que 1");
                //         calc -= diff + 0.1
                //     }
                // }
            }

        });

        // neighbors.forEach(s => {
        //     const iso = this.screenToIso(s.x, s.y);
        //     const convertIsoX = Math.ceil(iso.x);
        //     const convertIsoY = Math.ceil(iso.y);
        //     const realWidth = this.scene.gridWidth * this.scene.logicalFactor - 1;
        //     const realHeight = this.scene.gridHeight * this.scene.logicalFactor - 1;

        //     let calc = convertIsoX + convertIsoY * 1.001

        //     if (!s.flipX) {
        //         calc = convertIsoX + convertIsoY * 1.0001;
        //     } else {
        //         console.log("--------------------");
        //         const closeNeighbor = this.scene.sprites.find(n => {

        //             if (n === s) return false;
        //             if (n.tipo !== "cerca") return false;

        //             const isoN = this.screenToIso(n.x, n.y);

        //             const dx = Math.abs(isoN.x - convertIsoX);
        //             const dy = Math.abs(isoN.y - convertIsoY);

        //             return dx <= 2 && dy <= 2;
        //         });

        //         if (closeNeighbor) {
        //             console.log(closeNeighbor);
        //             const isoN = this.screenToIso(closeNeighbor.x, closeNeighbor.y);
        //             const neighborDepth = Math.ceil(isoN.x) + Math.ceil(isoN.y) * 1.001;

        //             const diff = Math.abs(calc - neighborDepth);

        //             console.log("Depth do vizinho: " + neighborDepth);
        //             console.log("diferença entre os dois: " + diff);
        //             console.log("calculo atual: " + calc);

        //             if (diff < 1) {
        //                 if (s.flipX) {
        //                     console.log("caindo aqui")
        //                     if (calc > neighborDepth) calc -= 0.2;
        //                     else calc += 0.2;
        //                 }
        //             } else {
        //                 if (s.flipX && convertIsoX < isoN.x) {
        //                     console.log("diff maior que 1");
        //                     calc -= diff + 0.1
        //                 }
        //             }
        //         }
        //     }

        //     s.setDepth(calc);
        //     console.log("tipo: " + s.tipo + ` depth de: ${calc}`)
        // });

    }

    recalculateAllDepths() {
        this.scene.sprites.forEach(s => {
            const iso = this.gridUtils.screenToIso(s.x, s.y);
            s.setDepth(iso.x + iso.y * 10);
        });
    }

    getMouseWorldPosition() {
        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);
        return worldPoint;
    }

    findPath(start, goal) {
        const gridMap = this.scene.gridMap;      // já 28x28
        const gridWidth = this.scene.gridWidth * 2;  // 14*2 = 28
        const gridHeight = this.scene.gridHeight * 2; // idem

        const openSet = [start];
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        const key = (x, y) => `${x},${y}`;

        gScore.set(key(start.x, start.y), 0);
        fScore.set(key(start.x, start.y), this.heuristic(start, goal));

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
            openSet.sort((a, b) => fScore.get(key(a.x, a.y)) - fScore.get(key(b.x, b.y)));
            const current = openSet.shift();

            // --- chegou no destino ---
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }

            for (const dir of dirs) {
                const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
                const nKey = key(neighbor.x, neighbor.y);
                const cKey = key(current.x, current.y);

                // --- checa limites (agora 28x28) ---
                if (
                    neighbor.x < 0 || neighbor.y < 0 ||
                    neighbor.x >= gridWidth || neighbor.y >= gridHeight
                ) continue;

                // --- checa ocupação no gridMap ---
                if (gridMap[neighbor.x][neighbor.y]) continue;

                const cost = (dir.x !== 0 && dir.y !== 0) ? Math.SQRT2 : 1;
                const tentative = gScore.get(cKey) + cost;

                if (!gScore.has(nKey) || tentative < gScore.get(nKey)) {
                    cameFrom.set(nKey, current);
                    gScore.set(nKey, tentative);
                    fScore.set(nKey, tentative + this.heuristic(neighbor, goal));

                    if (!openSet.some(p => p.x === neighbor.x && p.y === neighbor.y)) {
                        openSet.push(neighbor);
                    }
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
        const map = this.scene.gridMap;

        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                // Ignora posições fora do limite do grid
                if (x < 0 || y < 0 ||
                    x >= this.scene.gridMap.length ||
                    y >= this.scene.gridMap[0].length)
                    return true;
                // Marca o valor no mapa
                map[x][y] = value;
            }
        }

        // Atualiza visual do grid (opcional)
        if (typeof this.drawMatrix === 'function') {
            this.drawMatrix();
        }
    }


    checkOccupiedBlock(startX, startY, w, h) {
        const map = this.scene.gridMap;

        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                // Se a área passar dos limites do grid, consideramos "ocupado"
                if (x < 0 || y < 0 ||
                    x >= this.scene.gridMap.length ||
                    y >= this.scene.gridMap[0].length)
                    return true;

                const cell = map[x]?.[y];
                // Se a célula tem qualquer valor que não seja null/undefined/false — é ocupada
                if (cell) return true;
            }
        }

        return false;
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

    getSpriteFootprintTiles(sprite) {
        const [w, h] = sprite.footprint || [1, 1];
        console.log(w, h);
        const iso = this.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const tiles = [];
        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                tiles.push({ x, y });
            }
        }
        return tiles;
    }


    canSnapFence(heldFence, targetFence) {
        if (!heldFence || !targetFence) return null;
        if (heldFence === targetFence) return null;
        if (heldFence.tipo !== "cerca" || targetFence.tipo !== "cerca") return null;

        const hTiles = this.getSpriteFootprintTiles(heldFence);
        const tTiles = this.getSpriteFootprintTiles(targetFence);

        const heldSet = new Set(hTiles.map(t => `${t.x},${t.y}`));
        const targetSet = new Set(tTiles.map(t => `${t.x},${t.y}`));

        const overlap = [];
        for (const pos of heldSet) {
            if (targetSet.has(pos)) overlap.push(pos);
        }

        if (overlap.length === 0) return null;

        const toXY = str => {
            const [x, y] = str.split(',').map(Number);
            return { x, y };
        };

        const hMinX = Math.min(...hTiles.map(t => t.x));
        const hMaxX = Math.max(...hTiles.map(t => t.x));
        const hMinY = Math.min(...hTiles.map(t => t.y));
        const hMaxY = Math.max(...hTiles.map(t => t.y));

        const tMinX = Math.min(...tTiles.map(t => t.x));
        const tMaxX = Math.max(...tTiles.map(t => t.x));
        const tMinY = Math.min(...tTiles.map(t => t.y));
        const tMaxY = Math.max(...tTiles.map(t => t.y));

        const heldVertical = (hMaxY - hMinY) > (hMaxX - hMinX);
        const targetVertical = (tMaxY - tMinY) > (tMaxX - tMinX);

        const overlapTiles = overlap.map(toXY);

        if (overlapTiles.length !== 1) {
            return null;
        }

        const o = overlapTiles[0];

        let onHeldEdge = false;
        let onTargetEdge = false;

        if (!heldVertical && !targetVertical) {
            onHeldEdge =
                o.x === hMinX || o.x === hMaxX
            onTargetEdge =
                o.x === tMinX || o.x === tMaxX
        } else if (heldVertical && targetVertical) {
            onHeldEdge = o.y === hMinY || o.y === hMaxY;
            onTargetEdge = o.y === tMinY || o.y === tMaxY;
        } else if (heldVertical && !targetVertical) {
            onHeldEdge = o.y === hMinY || o.y === hMaxY;
            onTargetEdge = o.x === tMinX || o.x === tMaxX
        } else {
            onHeldEdge = o.x === hMinX || o.x === hMaxX
            onTargetEdge = o.y === tMinY || o.y === tMaxY;
        }

        if (!(onHeldEdge && onTargetEdge)) {
            return null;
        }

        const edgeContact = o;

        return {
            overlap: overlapTiles,
            contactPoint: edgeContact,
            heldVertical,
            targetVertical,
            direction:
                edgeContact.x === hMinX ? "left" :
                    edgeContact.x === hMaxX ? "right" :
                        edgeContact.y === hMinY ? "above" :
                            "below",
            held: heldFence,
            target: targetFence
        };
    }


}
