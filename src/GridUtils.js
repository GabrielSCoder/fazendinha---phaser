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

    ReOccupiedFences() {
        const fences = this.scene.sprites.filter(c => c.tipo === "cerca");

        fences.forEach(fence => {
            //console.log("tamanho", fences.length);
            const { w, h } = this.getSpriteFootprint(fence);
            const iso = this.screenToIso(fence.x, fence.y);

            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            fence.gridX = Math.round(iso.x);
            fence.gridY = Math.round(iso.y);

            this.clearOccupied(fence);
            this.markOccupied(fence, startX, startY, w, h);
        })

        this.drawFootprints();
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

    addOccupiedTile(x, y, sprite) {
        if (!sprite) return;
        if (x < 0 || y < 0 || x >= this.scene.gridWidth * this.scene.logicalFactor || y >= this.scene.gridHeight * this.scene.logicalFactor) return;
        this.scene.gridMap[x][y] = sprite;
        this.drawMatrix();
    }

    // --------------------
    // 2️⃣ Função para limpar um tile ocupado, garantindo que o sprite correto seja removido
    // --------------------
    clearOccupiedtile(x, y) {
        if (x < 0 || y < 0 || x >= this.scene.gridWidth * this.scene.logicalFactor || y >= this.scene.gridHeight * this.scene.logicalFactor) return;
        this.scene.gridMap[x][y] = null;
        this.drawMatrix();
    }

    // --------------------
    // 3️⃣ Função para checar e restaurar tiles baseado em colisões
    // --------------------
    checkAndRetakeTiles(sprite) {
        if (!sprite.collisions || sprite.collisions.length === 0) return;

        sprite.collisions.forEach(collision => {
            const { x, y } = collision.contactPoint;
            const oldSprite = collision.col;

            if (!x || !y) return;

            // Verifica se o antigo dono ainda ocupa esse tile
            if (oldSprite && this.scene.gridMap[x][y] === null) {
                this.addOccupiedTile(x, y, oldSprite);
            }

            // Remove o tile do sprite que está se movendo
            this.clearOccupiedtile(x, y, sprite);
        });

        sprite.collisions = [];
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

    drawSpriteFootprint(sprite) {

        if (!sprite) return;
        const g = this.scene.footprintGraphics;
        g.clear();

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
        const gridSize = this.scene.gridSize;

        const neighbors = this.scene.sprites.filter(s => {
            const dx = Math.abs(s.x - targetX);
            const dy = Math.abs(s.y - targetY);
            return dx <= radius * gridSize && dy <= radius * gridSize;
        });

        neighbors.forEach(s => {
            let footprintTiles = this.getSpriteFootprintTiles(s);


            if (footprintTiles.length === 1) {
                const base = footprintTiles[0];

                const normalCandidates = this.scene.sprites.filter(n => {
                    if (n === s) return false;
                    const nTiles = this.getSpriteFootprintTiles(n);
                    return nTiles.some(t => t.x === base.x + 1 && t.y === base.y + 1);
                });

                const flippedCandidates = this.scene.sprites.filter(n => {
                    if (n === s) return false;
                    const nTiles = this.getSpriteFootprintTiles(n);
                    return nTiles.some(t => t.x === base.x - 1 && t.y === base.y + 1);
                });


                const filteredFlipped = flippedCandidates.filter(f => !normalCandidates.includes(f));


                const neighborNormal = normalCandidates.find(n => n.tipo === "cerca");
                const neighborFlipped = filteredFlipped.find(n => n.tipo === "cerca");



                if (neighborNormal && neighborNormal.tipo === "cerca" && !neighborFlipped) {

                    footprintTiles = [
                        { x: base.x, y: base.y - 1 },
                        base,
                        // { x: base.x, y: base.y + 1 },
                        // { x: base.x, y: base.y + 2 },
                    ];
                    //console.log("Cerca normal detectada → tiles extras abaixo");
                }
                else if (neighborFlipped && neighborFlipped.tipo === "cerca" && !neighborNormal) {

                    footprintTiles = [
                        base,
                        { x: base.x, y: base.y + 1 },
                        { x: base.x, y: base.y + 2 },
                        { x: base.x, y: base.y + 3 },
                    ];
                    //console.log("Cerca flipada detectada → tiles mais longos abaixo");
                }
                else if (!neighborNormal && neighborFlipped) {

                    footprintTiles = [
                        { x: base.x, y: base.y - 1 },
                        base,
                    ];
                    //console.log("Cruzamento de cercas → priorizando flipada");
                }
                else {

                    footprintTiles = [
                        base,
                        { x: base.x, y: base.y + 1 },
                        { x: base.x, y: base.y + 2 },
                    ];
                    //console.log("Sem cerca → padrão simples (2 tiles)");
                }
            }

            let total = 0;
            footprintTiles.forEach(tile => {
                const calc = tile.x + tile.y * 1.001;
                total += calc;
            });

            const avg = total / footprintTiles.length;
            s.setDepth(avg);
        });
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

        const heldVertical = heldFence.flipX
        const targetVertical = targetFence.flipX

        console.log("Held é vertical: ", heldVertical);
        console.log("Target é vertical: ", targetVertical);

        const overlapTiles = overlap.map(toXY);

        if (overlapTiles.length !== 1) {
            return null;
        }

        const o = overlapTiles[0];

        let onHeldEdge = false;
        let onTargetEdge = false;

        if (!heldVertical && !targetVertical) {
            onHeldEdge = o.x === hMinX || o.x === hMaxX;
            onTargetEdge = o.x === tMinX || o.x === tMaxX;
        } else if (heldVertical && targetVertical) {
            onHeldEdge = o.y === hMinY || o.y === hMaxY;
            onTargetEdge = o.y === tMinY || o.y === tMaxY;
        } else if (heldVertical && !targetVertical) {
            onHeldEdge = o.y === hMinY || o.y === hMaxY;
            onTargetEdge = o.x === tMinX || o.x === tMaxX;
        } else {
            onHeldEdge = o.x === hMinX || o.x === hMaxX;
            onTargetEdge = o.y === tMinY || o.y === tMaxY;
        }

        if (!(onHeldEdge && onTargetEdge)) {
            return null;
        }

        const edgeContact = o;

        const direction =
            edgeContact.x === hMinX ? "left" :
                edgeContact.x === hMaxX ? "right" :


                    console.log("----------> ", direction);
        const grid = this.scene.gridMap;

        if (grid) {

            let minX = Math.min(hMinX, tMinX);
            let maxX = Math.max(hMaxX, tMaxX);

            if (!heldVertical && !targetVertical) {

                if (direction == "left") {
                    console.log("Held horizontal e target horizontal")

                    for (let i = minX + 1; i <= maxX; i++) {
                        if (grid[i][hMaxY] !== targetFence && grid[i][hMaxY] !== heldFence && grid[i][hMaxY] !== null) {
                            console.log(grid[i][hMaxY]);
                            return;
                        }
                    }

                } else {

                    minX = hMinX;
                    maxX = tMaxX - 1;

                    console.log("Held horizontal e target horizontal a direita")
                    for (let i = minX; i <= maxX; i++) {
                        console.log("checando posição: ", minX, " ", hMaxY);
                        if (grid[i][hMaxY] !== targetFence && grid[i][hMaxY] !== heldFence && grid[i][hMaxY] !== null) {
                            console.log(grid[i][hMaxY]);
                            return;
                        }
                    }

                }

            } else if (heldVertical && heldVertical) {

                console.log("ambos verticais esquerda")
                console.log(edgeContact.y, edgeContact.x);
                console.log(hMinY, hMaxY)
                console.log(tMinY, tMaxY)

                if (hMaxY > tMaxY) {
                    console.log("subindo")

                    const min = tMinY + 1
                    console.log("Faixa de " + hMaxY + " até " + min);
                    for (let i = hMaxY; i >= min; i--) {
                        if (grid[hMaxX][i] !== targetFence && grid[hMaxX][i] !== heldFence && grid[hMaxX][i] !== null) {
                            console.log("parou no ", i);
                            console.log(grid[hMaxX][i]);
                            return;
                        }
                    }
                } else {
                    console.log("descendo")

                    const max = tMaxY - 1
                    console.log("Faixa de " + hMinY + " até " + max);
                    for (let i = hMinY; i <= max; i++) {
                        if (grid[hMaxX][i] !== targetFence && grid[hMaxX][i] !== heldFence && grid[hMaxX][i] !== null) {
                            if (i == hMinY && grid[hMaxX][i].tipo !== "cerca") {
                                console.log("parou no ", i);
                                console.log(grid[hMaxX][i]);
                                return;
                            }
                        }
                    }
                }
            } else if (heldVertical && !targetVertical) {

                if (direction == "left") {
                    const maxY = hMaxY - 1;

                    console.log("Held vertical e target horizontal a esquerda")

                    for (let i = tMinX; i <= tMaxX; i++) {
                        console.log("checando posição: ", tMinX, " ", tMaxX);
                        if (grid[i][tMaxY] !== targetFence && grid[i][tMaxY] !== heldFence && grid[i][tMaxY] !== null) {
                            if (i == tMinX && grid[i][tMaxY].tipo !== "cerca") {
                                console.log("colidiu no: ", i);
                                return;
                            }
                        }
                    }

                    console.log("Faixa de altura: ", hMinY + 1, " ate " + maxY)
                    for (let i = hMinY + 1; i <= maxY; i++) {
                        if (grid[hMaxX][i] !== targetFence && grid[hMaxX][i] !== heldFence && grid[hMaxX][i] !== null) {
                            if (i == maxY && grid[hMaxX][i].tipo !== "cerca") {
                                console.log("colidiu no: ", i);
                                return;
                            }
                        }
                    }

                } else {

                    console.log("Held vertical e target horizontal direita")

                    const maxY = hMaxY - 1;

                    for (let i = minX; i <= maxX; i++) {
                        console.log("checando posição: ", minX, " ", hMaxY);
                        if (grid[i][hMaxY] !== targetFence && grid[i][hMaxY] !== heldFence && grid[i][hMaxY] !== null) {
                            console.log(grid[i][hMaxY]);
                            return;
                        }
                    }

                    console.log("Faixa de altura: " + hMinY + " ate " + maxY)
                    for (let i = hMinY; i <= maxY; i++) {
                        if (grid[hMaxX][i] !== heldFence && grid[hMaxX][i] !== null) {
                            console.log(grid[hMaxX][i]);
                            return;
                        }
                    }
                }
            } else if (!heldVertical && targetVertical) {

                if (direction === "left") {
                    console.log("held horizontal e target vertical esquerda")

                    console.log(edgeContact.x, edgeContact.y);
                    console.log(hMinX, hMaxX)
                    console.log(tMinY, tMaxY)

                    console.log("Faixa de altura: " + tMinY + " ate " + tMaxY)
                    for (let i = tMinY; i <= tMaxY; i++) {
                        if (grid[tMaxX][i] !== targetFence && grid[tMaxX][i] !== heldFence && grid[tMaxX][i] !== null) {
                            if (i == tMaxY && grid[tMaxX][i].tipo !== "cerca") {
                                console.log("colidiu no ", i)
                                console.log(grid[tMaxX][i]);
                                return;
                            }
                        }
                    }

                    const min = hMinX + 1

                    console.log("Faixa de largura: " + min + " ate " + hMaxX)
                    for (let i = min; i <= hMaxX; i++) {
                        if (grid[i][hMaxY] !== heldFence && grid[i][hMaxY] !== null) {
                            console.log(grid[i][hMaxY]);
                            return;
                        }
                    }
                } else {
                    console.log("Held horizontal e target vertical direita")

                    console.log("Faixa de altura: " + tMinY + " ate " + tMaxY)
                    for (let i = tMinY; i <= tMaxY; i++) {
                        if (grid[tMaxX][i] !== targetFence && grid[tMaxX][i] !== heldFence && grid[tMaxX][i] !== null) {
                            if (i == tMaxY && grid[tMaxX][i].tipo !== "cerca") {
                                console.log("colidiu no ", i)
                                console.log(grid[tMaxX][i]);
                                return;
                            }
                        }
                    }

                    const max = hMaxX - 1

                    console.log("Faixa de largura: " + hMinX + " ate " + max)
                    for (let i = hMinX; i <= max; i++) {
                        if (grid[i][hMaxY] !== targetFence && grid[i][hMaxY] !== heldFence && grid[i][hMaxY] !== null) {
                            if (hMinX == i && grid[i][hMaxY].tipo !== "cerca") {
                                console.log("colidiu no: ", i);
                                return;
                            }
                        }
                    }
                }


            }
        }

        return {
            overlap: overlapTiles,
            contactPoint: edgeContact,
            heldVertical,
            targetVertical,
            direction:
                edgeContact.x === hMinX ? "left" :
                    edgeContact.x === hMaxX ? "right" :
                        edgeContact.y === hMinY ? "above" : "below",
            held: heldFence,
            target: targetFence
        };
    }

    canConnectBetweenFences(sprite, fenceA, fenceB) {
        if (!sprite || !fenceA || !fenceB) return null;
        if (fenceA === fenceB) return null;
        if (fenceA.tipo !== "cerca" || fenceB.tipo !== "cerca") return null;

        const grid = this.scene.gridMap;
        if (!grid) return null;


        const tilesSprite = this.getSpriteFootprintTiles(sprite);
        const tilesA = this.getSpriteFootprintTiles(fenceA);
        const tilesB = this.getSpriteFootprintTiles(fenceB);

        // Limites de cada cerca
        const aMinX = Math.min(...tilesA.map(t => t.x));
        const aMaxX = Math.max(...tilesA.map(t => t.x));
        const aMinY = Math.min(...tilesA.map(t => t.y));
        const aMaxY = Math.max(...tilesA.map(t => t.y));

        const bMinX = Math.min(...tilesB.map(t => t.x));
        const bMaxX = Math.max(...tilesB.map(t => t.x));
        const bMinY = Math.min(...tilesB.map(t => t.y));
        const bMaxY = Math.max(...tilesB.map(t => t.y));

        const sMinX = Math.min(...tilesSprite.map(t => t.x));
        const sMaxX = Math.max(...tilesSprite.map(t => t.x));
        const sMinY = Math.min(...tilesSprite.map(t => t.y));
        const sMaxY = Math.max(...tilesSprite.map(t => t.y));

        const aVertical = fenceA.flipX;
        const bVertical = fenceB.flipX;

        const sameRow = (aMinY <= bMaxY && aMaxY >= bMinY);
        const sameCol = (aMinX <= bMaxX && aMaxX >= bMinX);

        // --- 1️⃣ verifica sobreposição de tiles do sprite com A e B ---
        const spriteSet = new Set(tilesSprite.map(t => `${t.x},${t.y}`));
        const overlapA = tilesA.filter(t => spriteSet.has(`${t.x},${t.y}`));
        const overlapB = tilesB.filter(t => spriteSet.has(`${t.x},${t.y}`));

        if (overlapA.length === 0 || overlapB.length === 0) return null;

        if (overlapA.length > 1 || overlapB > 1) return null;

        console.log("checando extremidades");

        const touchesExtremityA = overlapA[0].x === aMaxX && overlapA[0].y === aMaxY || overlapA[0].x === aMinX && overlapA[0].y === aMinY

        const touchesExtremityB = overlapB[0].x === bMaxX && overlapB[0].y === bMaxY || overlapB[0].x === bMinX && overlapB[0].y === bMinY

        console.log(touchesExtremityA, touchesExtremityB);

        if (!touchesExtremityA || !touchesExtremityB) {
            return null;
        }


        if (aVertical && bVertical && sameCol) {
            // Conexão vertical (uma acima da outra)
            const startY = Math.min(aMinY, bMinY);
            const endY = Math.max(aMaxY, bMaxY);


            console.log("de ", startY, " ate ", endY);
            for (let y = startY + 1; y < endY; y++) {
                const cell = grid[bMaxX]?.[y];
                if (cell && cell !== fenceA && cell !== fenceB && cell !== sprite) {
                    console.log("colidindo no", y);
                    return null;
                }
            }

            return { axis: "vertical", from: fenceA, to: fenceB };

        } else if (!aVertical && !bVertical && sameRow) {
            // Conexão horizontal (lado a lado)
            const startX = Math.min(aMinX, bMinX);
            const endX = Math.max(aMaxX, bMaxX);

            for (let x = startX + 1; x < endX; x++) {
                const cell = grid[x]?.[aMaxY];
                if (cell && cell !== fenceA && cell !== fenceB && cell !== sprite) {
                    return null;
                }
            }

            return { axis: "horizontal", from: fenceA, to: fenceB };

        } else {
            if (sameCol) {
                console.log("SameCol");

                console.log("indo de ", sMinY + 1, " ate ", sMaxY - 1);

                console.log("pontas cerca : ", sMinX, sMinX, sMaxX, sMaxY)

                for (let x = sMinY + 1; x < sMaxY; x++) {
                    const cell = grid[sMaxX]?.[x];
                    if (cell != sprite && cell != null) {
                        console.log("parou no ", x, aMaxX)
                        console.log(cell);
                        return null;
                    }
                }

                return { axis: "horizontal", from: fenceA, to: fenceB };
            } else if (sameRow) {

                console.log("SameRow");

                console.log("indo de ", sMinX + 1, " ate ", sMaxX - 1);

                for (let x = sMinX + 1; x < sMaxX; x++) {
                    const cell = grid[x]?.[sMaxY];
                    if (cell != sprite && cell != null) {
                        //console.log("parou no ", x)
                        return null;
                    }
                }

                return { axis: "horizontal", from: fenceA, to: fenceB };
            }
        }
    }

}


