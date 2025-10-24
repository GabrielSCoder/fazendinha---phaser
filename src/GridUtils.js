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

    // canSnapFence(heldFence, targetFence) {
    //     if (!heldFence || !targetFence) return null;
    //     if (heldFence.tipo !== 'cerca' || targetFence.tipo !== 'cerca') return null;

    //     console.log("passo 1");
    //     const hFoot = heldFence.footprint;
    //     const tFoot = targetFence.footprint;
    //     if (!hFoot?.length || !tFoot?.length) return null;

    //     console.log("passo 2");
    //     console.log("hfoot: " + hFoot + "tfoot: " + tFoot);
    //     // Último tile do alvo
    //     const tEnd = tFoot[tFoot.length - 1]; tFoot
    //     // Primeiro tile do alvo
    //     const tStart = tFoot[0];
    //     // Primeiro e último do que estou segurando
    //     const hStart = hFoot[0];
    //     const hEnd = hFoot[hFoot.length - 1];

    //     console.log("passo 4");
    //     console.log("tEnd: " + tEnd + " tStart: " + tStart + " hstart :" + hStart.x + " hEnd :" + hEnd);

    //     // 🔹 Encostando verticalmente (um abaixo do outro)
    //     if (hStart.x === tEnd.x && hStart.y === tEnd.y + 1) {
    //         console.log("if 1")
    //         return { direction: 'below', targetTile: tEnd };
    //     }
    //     if (hEnd.x === tStart.x && hEnd.y === tStart.y - 1) {
    //         console.log("if 2")
    //         return { direction: 'above', targetTile: tStart };
    //     }

    //     // 🔹 Encostando horizontalmente
    //     if (hStart.y === tEnd.y && hStart.x === tEnd.x + 1) {
    //         console.log("if 3")
    //         return { direction: 'right', targetTile: tEnd };
    //     }
    //     if (hEnd.y === tStart.y && hEnd.x === tStart.x - 1) {
    //         console.log("if 4")
    //         return { direction: 'left', targetTile: tStart };
    //     }

    //     return null;
    // }

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

        console.log(overlap);

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

        const overlapTiles = overlap.map(toXY);

        // console.log(overlapTiles);

        if (overlapTiles.length !== 1) {
            return null;
        }

        const o = overlapTiles[0];

        console.log(o);

        const onHeldEdge =
            o.x === hMinX || o.x === hMaxX || o.y === hMinY || o.y === hMaxY;
        const onTargetEdge =
            o.x === tMinX || o.x === tMaxX || o.y === tMinY || o.y === tMaxY;

        console.log(onHeldEdge);
        console.log(onTargetEdge);

        if (!(onHeldEdge && onTargetEdge)) {
            return null;
        }

        const edgeContact = o;

        console.log(edgeContact);

        const heldVertical = (hMaxY - hMinY) > (hMaxX - hMinX);
        const targetVertical = (tMaxY - tMinY) > (tMaxX - tMinX);

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


    // Helpers -----------------------------------------------------------------

    // Retorna { w, h } em tiles (mesma unidade usada com screenToIso / gridMap)

    // Retorna startX/startY no grid (unidade usada no gridMap) para um sprite.
    // Usa sprite.lastFreePos se existir, senão calcula a partir da posição do sprite.
    computeStartFromSprite(sprite) {
        const fp = this.getSpriteFootprintTiles(sprite);
        if (sprite.lastFreePos && typeof sprite.lastFreePos.startX === 'number') {
            return { startX: sprite.lastFreePos.startX, startY: sprite.lastFreePos.startY };
        }

        const iso = this.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (fp.w / 2 - 0.5));
        const startY = Math.round(iso.y - (fp.h / 2 - 0.5));

        return { startX, startY };
    }

    // Atualiza sprite.x/y baseado no start grid (centraliza no footprint)
    snapSpriteToGridStart(sprite, startX, startY) {
        const fp = this.getSpriteFootprintTiles(sprite);
        const centerIsoX = startX + (fp.w / 2 - 0.5);
        const centerIsoY = startY + (fp.h / 2 - 0.5);
        const screen = this.isoToScreen(centerIsoX, centerIsoY, this.scene.gridSize, this.scene.offsetX, this.scene.offsetY);

        sprite.x = screen.x;
        // pequeno ajuste vertical para encaixe visual (opcional)
        sprite.y = screen.y + (this.scene.gridSize * 0.12 || 0);
        // guarda grid coords úteis
        sprite.gridX = startX;
        sprite.gridY = startY;
        sprite.lastFreePos = { startX, startY };
    }

    snapFence(held, target, snap) {
        if (!held || !target || !snap) return false;

        // dados
        const dir = snap.direction; // 'above'|'below'|'left'|'right'
        const heldFP = this.getSpriteFootprintTiles(held);
        const targFP = this.getSpriteFootprintTiles(target);

        // start do target (em coords do grid). assume target.lastFreePos existe se ele já estava fixado
        const tStart = this.computeStartFromSprite(target);
        let tStartX = tStart.startX;
        let tStartY = tStart.startY;
        let tW = targFP.w;
        let tH = targFP.h;

        // start do held (onde ele está agora); vamos calcular depois baseado no target
        const hW = heldFP.w;
        const hH = heldFP.h;

        // --- decide como remover tile do target ---
        // remover 1 tile da extremidade (se possível). Se remoção deixaria dimensão < 1, aborta.
        let newTStartX = tStartX;
        let newTStartY = tStartY;
        let newTW = tW;
        let newTH = tH;

        if (dir === 'below') {
            // held está abaixo -> remove a última linha (na direção y crescente) do target
            if (tH <= 1) return false; // não dá pra remover
            newTH = tH - 1;
            // startX/Y não muda para remoção do fim
        } else if (dir === 'above') {
            // held está acima -> remove a primeira linha do target (shift)
            if (tH <= 1) return false;
            newTH = tH - 1;
            newTStartY = tStartY + 1; // shift start para baixo
        } else if (dir === 'right') {
            // held está à direita -> remove a última coluna do target
            if (tW <= 1) return false;
            newTW = tW - 1;
        } else if (dir === 'left') {
            // held está à esquerda -> remove a primeira coluna do target
            if (tW <= 1) return false;
            newTW = tW - 1;
            newTStartX = tStartX + 1; // shift start para direita
        } else {
            return false;
        }

        // --- valida limites do grid antes de aplicar ---
        const maxW = this.scene.gridMap.length;
        const maxH = this.scene.gridMap[0].length;

        // target new bounds
        if (newTStartX < 0 || newTStartY < 0 || newTStartX + newTW - 1 >= maxW || newTStartY + newTH - 1 >= maxH) {
            console.warn('snapFence: new target out of bounds');
            return false;
        }

        // compute held start based on new target extents and direction
        let hStartX = tStartX;
        let hStartY = tStartY;

        // Strategy: align held start so it's adjacent to the modified target area.
        // Simple alignment: align held's startX to target's startX (or center if widths differ).
        if (dir === 'below') {
            hStartX = newTStartX;              // alinha no mesmo x inicial
            hStartY = newTStartY + newTH;      // posicionado logo abaixo do novo target
        } else if (dir === 'above') {
            hStartX = newTStartX;
            hStartY = newTStartY - hH;         // acima do novo target
        } else if (dir === 'right') {
            hStartX = newTStartX + newTW;      // à direita do novo target
            hStartY = newTStartY;
        } else { // left
            hStartX = newTStartX - hW;         // à esquerda do novo target
            hStartY = newTStartY;
        }

        // --- valida limites do held ---
        if (hStartX < 0 || hStartY < 0 || hStartX + hW - 1 >= maxW || hStartY + hH - 1 >= maxH) {
            console.warn('snapFence: held would be out of bounds');
            return false;
        }

        // --- checar colisões de espaço livre antes de aplicar ---
        // Temporariamente limpamos ocupação do target e held para checar (ou só checar ignorando os próprios sprites)
        // Usaremos checkOccupiedGrid(startX, startY, endX, endY, spriteToIgnore)
        // checa área do target reduzida (deve estar livre exceto pelo próprio target)
        const targetOccupied = this.checkOccupiedGrid(newTStartX, newTStartY, newTStartX + newTW - 1, newTStartY + newTH - 1, target);
        if (targetOccupied) {
            console.warn('snapFence: reduced target area occupied by others');
            return false;
        }

        // checa area do held (onde será colocado), ignorando o próprio held
        const heldOccupied = this.checkOccupiedGrid(hStartX, hStartY, hStartX + hW - 1, hStartY + hH - 1, held);
        if (heldOccupied) {
            console.warn('snapFence: held target area occupied');
            return false;
        }

        // --- aplica as alterações --- //
        // 1) limpar ocupação antiga dos dois
        this.clearOccupied(target);
        this.clearOccupied(held);

        // 2) atualizar dados do target (start/size)
        // atualizar footprint visual lógico (se você quiser manter visual footprint array)
        target.footprint = [newTW, newTH];
        target.lastFreePos = { startX: newTStartX, startY: newTStartY };

        // 3) marcar ocupado novo do target
        this.markOccupied(target, newTStartX, newTStartY, newTW, newTH);

        // 4) posicionar held no grid e marcar
        this.snapSpriteToGridStart(held, hStartX, hStartY);
        this.markOccupied(held, hStartX, hStartY, hW, hH);

        // 5) Atualizar sprites (graficamente)
        // Se você tem que trocar a textura do target/held para refletir "sem ponta", faça aqui.
        // Exemplo (opcional):
        // target.setTexture('fence_mid'); held.setTexture('fence_mid');

        // 6) optional: redesenhar footprint/matrix
        if (typeof this.drawFootprints === 'function') this.drawFootprints();
        if (typeof this.drawMatrix === 'function') this.drawMatrix();

        return true;
    }


}
