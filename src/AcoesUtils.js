import { solos } from "./objects.js"

export default class AcoesUtils {
    constructor(scene) {
        this.scene = scene;

        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.input = scene.input;
        this.itemMenuUI = scene.itemMenuUI;
        this.gridUtils = scene.gridUtils;
    }

    setHoverEnabled(enabled) {
        this.scene.gameVariables.hoverEnabled = enabled;

        if (!enabled) {
            this.scene.hoverText.setVisible(false);
            this.scene.input.manager.canvas.style.cursor = "default";
        }
    }

    startArando() {
        if (this.scene.gameVariables.arando) return;

        if (this.scene.gameVariables.planting) this.stopSeed();
        if (this.scene.gameVariables.selling) this.stopSell();

        this.scene.gameVariables.arando = true;

        console.log(this.scene.gameVariables.arando);
    }

    stopArando() {
        if (!this.scene.gameVariables.arando) return;

        this.scene.gameVariables.arando = false;
        this.clearPreviewTiles();
        console.log("parando arar");
    }

    clearPreviewOccupiedTiles() {
        this.scene.gameVariables.previewOccupiedtiles = [];
    }

    cancelArar() {
        if (!this.scene.gameVariables.arando) return;

        this.scene.gameVariables.arando = false;
        this.clearPreviewTiles();
        this.scene.gameVariables.previewOccupiedtiles = [];
        this.ativarInteratividadeItens();

        console.log("parando arar");
    }

    clearPreviewTiles() {
        for (let tile of this.scene.gameVariables.previewTiles) {
            tile.destroy();
        }
        this.scene.gameVariables.previewTiles = [];
    }

    updateSeed() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;
        if (this.scene.gameVariables.selling) this.stopSell();
        if (this.scene.gameVariables.arando) this.stopArando();

        const sprite = this.scene.gameVariables.selectedSeed;
        const pointer = this.scene.input.activePointer;

        sprite.x = pointer.worldX + 20;
        sprite.y = pointer.worldY;
    }

    freeSolo() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;

        this.scene.gameVariables.selectedSeed.setDepth(2000);
        this.scene.gameVariables.selectedSprite = null;

        this.ativarInteratividadeItensPorNome("solo_prepadado");

        // this.scene.gameVariables.planting = false;
    }

    stopSeed() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;

        this.scene.gameVariables.selectedSeed.setDepth(2000);

        const sprite_del = this.scene.gameVariables.selectedSeed;
        sprite_del.destroy();

        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
            s => s && s !== sprite_del && !s.destroyed
        );

        this.scene.gameVariables.selectedSprite = null;
        this.scene.gameVariables.selectedSeed = null;

        this.ativarInteratividadeItensPorNome("solo_prepadado");

        this.scene.gameVariables.planting = false;
    }

    startSell() {
        if (this.scene.gameVariables.selling) return;

        if (this.scene.gameVariables.arando) this.cancelArar();
        if (this.scene.gameVariables.planting) this.stopSeed();

        let originX = 0.5;
        let originY = 0.5;
        let scale = 0.2;
        let itemData = { img: "pa" };

        const sprite = this.scene.spriteUtils.addGameSprite(
            itemData,
            this.scene.scale / 2,
            this.scene.scale / 2,
            scale,
            originX,
            originY
        );

        sprite.nome = "tool";
        sprite.isMoving = true;
        sprite.setDepth(2000);
        sprite.disableInteractive();

        this.scene.gameVariables.toolSprite = sprite;

        if (!this.scene.gameVariables.sprites)
            this.scene.gameVariables.sprites = [];

        this.scene.gameVariables.sprites.push(sprite);

        this.scene.cameraController.ignoreInUICamera([
            ...this.scene.gameVariables.sprites
        ]);

        this.scene.gameVariables.selling = true;
    }

    stopSell() {
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        const sprite_del = this.scene.gameVariables.toolSprite;
        sprite_del.destroy();

        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
            s => s && s !== sprite_del && !s.destroyed
        );

        this.scene.gameVariables.toolSprite = null;
        this.scene.gameVariables.selling = false;

        console.log("venda cancelada");
    }

    updateSelling() {
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        const sprite = this.scene.gameVariables.toolSprite;
        const pointer = this.scene.input.activePointer;

        sprite.x = pointer.worldX + 10;
        sprite.y = pointer.worldY - 10;
    }


    updateFence() {
        const sprite = this.scene.gameVariables.selectedSprite;
        if (!sprite || sprite.tipo !== "cerca") return;

        sprite.setTint(0xffffff);

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        let foundSnap = false;
        let possibleSnaps = [];
        let cols = []
        for (let gx = startX; gx < startX + w; gx++) {
            for (let gy = startY; gy < startY + h; gy++) {
                if (gx < 0 || gy < 0 || gx > this.gridWidth * this.logicFactor - 1 || gy > this.gridHeight * this.logicFactor - 1) continue;
                const cell = this.scene.gameVariables.gridMap[gx]?.[gy];
                if (cell && cell.tipo === "cerca" && cell.lastFreePos !== sprite.lastFreePos) {
                    cols.push(cell);
                }
            }
        }

        if (cols.length && cols.length === 1) {
            const cell = cols[0];
            const canSnap = this.gridUtils.canSnapFence(sprite, cell);
            if (canSnap) {
                possibleSnaps.push({ cell, data: canSnap });
            }
        } else if (cols.length && cols.length === 2) {
            const [f1, f2] = cols;
            const canLink = this.gridUtils.canConnectBetweenFences(sprite, f1, f2);
            if (canLink) {
                possibleSnaps.push({ cell: f1, data: canLink });
            }
        }

        if (possibleSnaps.length === 1) {
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.scene.gameVariables.fenceSnapTarget = possibleSnaps[0].cell;
            this.scene.gameVariables.collisionDataTemp = possibleSnaps[0].data;
        } else if (possibleSnaps.length === 2) {
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.scene.gameVariables.fenceSnapTarget = possibleSnaps.map(s => s.cell);
            this.scene.gameVariables.collisionDataTemp = possibleSnaps.map(s => s.data);
        } else {
            console.log("nenhum encontrado")
            sprite.setTint(0xffaaaa);
            this.scene.gameVariables.fenceSnapTarget = null;
        }
    }

    updateSprite() {

        if (this.scene.gameVariables.planting) return;

        if (this.scene.gameVariables.selectedSprite && this.scene.gameVariables.selectedSprite.isMoving) {
            const sprite = this.scene.gameVariables.selectedSprite;
            const pointer = this.scene.input.activePointer;

            if (this.scene.gameVariables.middleButtonDown) return;

            if (this.scene.gameVariables.freeClick) return;

            // converte para iso usando pointer
            let iso = this.gridUtils.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);

            this.convert(iso, sprite)

            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            // this.gridUtils.recalculateDepthAround(sprite);


            const occupied = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            // sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            this.gridUtils.drawSpriteFootprint(sprite);
        }
    }

    updateArando(blocksWide = 1, blocksHigh = 1) {
        if (this.scene.gameVariables.middleButtonDown) return;
        if (!this.scene.gameVariables.arando) return;
        if (this.scene.gameVariables.selling) this.stopSell();
        if (this.scene.gameVariables.planting) this.stopSeed();

        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const startX = Math.floor(iso.x);
        const startY = Math.floor(iso.y);

        this.clearPreviewTiles();

        const blockSize = 4; // tamanho fixo de um "solo"
        const totalWidth = blockSize * blocksWide;
        const totalHeight = blockSize * blocksHigh;

        const outerCornersIso = [
            { x: startX, y: startY },
            { x: startX + totalWidth, y: startY },
            { x: startX + totalWidth, y: startY + totalHeight },
            { x: startX, y: startY + totalHeight }
        ];
        const outerCornersScreen = outerCornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));
        const outerPoints = [];
        for (const c of outerCornersScreen) outerPoints.push(c.x, c.y);

        // === Desenhar os sub-blocos individualmente ===
        this.scene.gameVariables.previewOccupiedtiles = []; // limpa antes de preencher
        for (let bx = 0; bx < blocksWide; bx++) {
            for (let by = 0; by < blocksHigh; by++) {

                const sx = startX + bx * blockSize;
                const sy = startY + by * blockSize;

                const isOccupied = this.gridUtils.checkOccupiedGrid(
                    sx, sy,
                    sx + blockSize - 1,
                    sy + blockSize - 1,
                    null
                );

                const fillColor = isOccupied ? 0xaa0000 : 0x00aa00; // escuro
                const borderColor = isOccupied ? 0xff6666 : 0x66ff66; // claro

                const cornersIso = [
                    { x: sx, y: sy },
                    { x: sx + blockSize, y: sy },
                    { x: sx + blockSize, y: sy + blockSize },
                    { x: sx, y: sy + blockSize }
                ];
                const cornersScreen = cornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));
                const points = [];
                for (const c of cornersScreen) points.push(c.x, c.y);

                const tile = this.scene.add
                    .polygon(0, 0, points, fillColor, 0.35)
                    .setStrokeStyle(1, borderColor, 0.9)
                    .setOrigin(0, 0);

                this.scene.gameVariables.previewTiles.push(tile);
                this.scene.cameraController.ignoreInUICamera([tile]);

                this.scene.gameVariables.previewOccupiedtiles.push({ x: sx, y: sy, w: blockSize, h: blockSize, occupied: isOccupied });
            }
        }

        const outerBorder = this.scene.add
            .polygon(0, 0, outerPoints, 0x000000, 0)
            .setStrokeStyle(2, 0xffffff, 0.7)
            .setOrigin(0, 0);

        this.scene.gameVariables.previewTiles.push(outerBorder);
        this.scene.cameraController.ignoreInUICamera([outerBorder]);
    }

    getSpriteByPointerPosition() {

        if (!this.scene.gameVariables.gridMap || !this.scene.gameVariables.gridMap.length) return;

        const pointer = this.scene.input.activePointer;

        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(
            worldPoint.x,
            worldPoint.y
        );

        const tileX = Math.floor(iso.x);
        const tileY = Math.floor(iso.y);

        if (tileX < 1 || tileX > this.gridWidth * this.logicFactor - 1 || tileY < 1 || tileY > this.gridHeight * this.logicFactor - 1) return;

        const cell = this.scene.gameVariables.gridMap[tileX][tileY];

        console.log(cell);

        if (cell != null && cell.tipo == "cerca") return cell;

        return null;
    }

    gridStart() {
        const g = this.scene.gridGraphics;
        g.clear();

        // Define cor e opacidade de preenchimento (verde translúcido, por ex.)
        const fillColor = 0x00ff00;
        const fillAlpha = 0.15;

        for (let x = 0; x < this.gridWidth * 2; x++) {
            for (let y = 0; y < this.gridHeight * 2; y++) {
                const p1 = this.gridUtils.isoToScreen(x, y, this.gridSize, this.offsetX, this.offsetY);
                const p2 = this.gridUtils.isoToScreen(x + 1, y, this.gridSize, this.offsetX, this.offsetY);
                const p3 = this.gridUtils.isoToScreen(x + 1, y + 1, this.gridSize, this.offsetX, this.offsetY);
                const p4 = this.gridUtils.isoToScreen(x, y + 1, this.gridSize, this.offsetX, this.offsetY);

                g.beginPath();
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
                g.lineTo(p3.x, p3.y);
                g.lineTo(p4.x, p4.y);
                g.closePath();

                // Preenche a célula
                g.fillStyle(fillColor, fillAlpha);
                g.fillPath();

                // (Opcional) desenha contorno leve
                g.lineStyle(1, 0x00ff00, 0.3);
                g.strokePath();
            }
        }
    }

    convert(iso, sprite) {
        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
        const offsetX = (w % 2 === 0) ? 0.5 : 0;
        const offsetY = (h % 2 === 0) ? 0.5 : 0;
        let snapped = null;
        let multiFactor = 0;

        if (sprite.tipo === "cerca") {
            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x), Math.floor(iso.y));
            multiFactor = this.gridSize * 0.20

            sprite.x = snapped.x;
            sprite.y = snapped.y - multiFactor;

        } else if (sprite.tipo === "solo") {
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + offsetX, Math.floor(iso.y) + offsetY);
            sprite.x = snapped.x;
            sprite.y = snapped.y + this.gridSize * 0.12;
        } else {
            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + offsetX, Math.floor(iso.y) + offsetY);
            sprite.x = snapped.x;
            sprite.y = snapped.y + multiFactor;
        }
    }

    breakConditions() {

        if (this.scene.gameVariables.planting) return false;

        if (this.scene.gameVariables.arando) return false;

        if (this.scene.gameVariables.ignoreNextPointerUp) return false;

        if (this.scene.gameVariables.freeClick) {
            console.log("free click")
            this.scene.gameVariables.freeClick = false;
            return false;
        }

        if (this.scene.gameVariables.changeCameraZoom) return false;

        if (this.scene.gameVariables.middleButtonDown) return false;

        if (this.scene.itemMenuUI.itemMenu.visible) return false;

        if (!this.scene.gameVariables.scene.gameVariables.selectedSprite || !this.scene.gameVariables.scene.gameVariables.selectedSprite.isMoving) return false;

        return true;
    }

    criarBarraProgresso(x, y, largura, altura, duracaoSegundos, funcao) {
        if (this.scene.gameVariables.plantingBar) return;

        this.scene.gameVariables.plantingBar = true;

        // === Cria gráficos ===
        const barra = this.scene.add.graphics();
        barra.fillStyle(0x000000, 0.5);
        barra.fillRect(x, y, largura, altura);
        barra.setAlpha(0);

        const progresso = this.scene.add.graphics();
        progresso.setAlpha(0);

        barra.setDepth(1999)
        progresso.setDepth(1999)

        this.scene.cameraController.ignoreInUICamera([progresso, barra]);

        this.scene.tweens.add({
            targets: [barra, progresso],
            alpha: 1,
            duration: 300,
            ease: "Sine.easeOut"
        });

        // === Controle de progresso ===
        let elapsed = 0;
        const timer = this.scene.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                elapsed += 0.1;
                const ratio = Phaser.Math.Clamp(elapsed / duracaoSegundos, 0, 1);

                progresso.clear();
                progresso.fillStyle(0xeb4034);
                progresso.fillRect(x + 1, y + 1, (largura - 2) * ratio, altura - 2);

                if (ratio >= 1) {
                    // Finaliza barra quando completa
                    timer.remove();

                    // Faz um fade-out suave
                    this.scene.tweens.add({
                        targets: [barra, progresso],
                        alpha: 0,
                        duration: 500,
                        ease: "Sine.easeIn",
                        onComplete: () => {
                            barra.destroy();
                            progresso.destroy();
                            this.scene.gameVariables.plantingBar = false;
                            if (typeof funcao === "function") {
                                funcao.call(this);
                            }
                        }
                    });
                }
            }
        });

        return { barra, progresso };
    }

    plantarSemente() {
        if (!this.scene.gameVariables.selectedSeed || !this.scene.gameVariables.selectedSprite || this.scene.gameVariables.selectedSprite.nome != "solo_preparado") return;
        const semente = this.scene.gameVariables.selectedSeed;
        const tipo_plantacao = semente.tipo_plantacao;

        if (!tipo_plantacao) return;

        const itemData = solos.find(solo => solo.nome === tipo_plantacao);

        if (!itemData) return;

        const sprite_del = this.scene.gameVariables.selectedSprite;
        sprite_del.destroy();
        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = itemData.tipo || "solo";

        const { w, h } = this.gridUtils.getSpriteFootprint(this.scene.gameVariables.selectedSprite);

        const iso = this.gridUtils.screenToIso(this.scene.gameVariables.selectedSprite.x, this.scene.gameVariables.selectedSprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const screenPos = this.gridUtils.isoToScreen(iso.x, iso.y);

        const sprite = this.scene.spriteUtils.addGameSprite(itemData, screenPos.x, screenPos.y, scale, originX, originY);

        sprite.footprint = itemData.area || [w, h];
        sprite.tipo = tipo;
        sprite.gridX = Math.round(startX + w * 0.5 - 0.5);
        sprite.gridY = Math.round(startY + h * 0.5 - 0.5);
        sprite.lastFreePos = { startX, startY };
        sprite.isMoving = false;
        sprite.nome = itemData.nome
        sprite.plantado = true
        sprite.plata_cultivada = semente.nome;

        if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
        this.scene.gameVariables.sprites.push(sprite);
        this.scene.cameraController.ignoreInUICamera([...this.scene.gameVariables.sprites])

        this.gridUtils.markOccupied(sprite, startX, startY, w, h);
        this.gridUtils.recalculateDepthAround(sprite);

        this.freeSolo();
    }

    ararSolo() {

        if (this.scene.gameVariables.arando && this.scene.gameVariables.previewOccupiedtiles?.length) {

            const itemData = solos.find(c => c.nome == "solo_preparado");
            if (!itemData) return;

            const scale = itemData.escala || 1;
            const originX = itemData.origem?.[0] ?? 0.5;
            const originY = itemData.origem?.[1] ?? 0.5;
            const tipo = itemData.tipo || "solo";

            const blockSize = 4;

            // Guarda os blocos efetivamente ocupados
            const placedTiles = [];

            for (const tile of this.scene.gameVariables.previewOccupiedtiles) {
                const startX = tile.startX ?? tile.x;
                const startY = tile.startY ?? tile.y;

                // Evita processar a mesma posição duas vezes
                if (placedTiles.some(t => t.startX === startX && t.startY === startY)) continue;

                const endX = startX + blockSize - 1;
                const endY = startY + blockSize - 1;

                const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, blockSize, blockSize);
                if (ocupado) {
                    console.log(`❌ Bloco em (${startX}, ${startY}) já ocupado — ignorando.`);
                    continue;
                }

                // Marca o solo como arado
                this.gridUtils.markGround(startX, startY, blockSize, blockSize);

                const w = blockSize;
                const h = blockSize;

                const centerX = startX + (w / 2) - (1 - originX - 0.25);
                const centerY = startY + (h / 2) - (1 - originY - 0.18);

                const screenPos = this.gridUtils.isoToScreen(centerX, centerY);

                const sprite = this.scene.spriteUtils.addGameSprite(itemData, screenPos.x, screenPos.y, scale, originX, originY);

                sprite.footprint = itemData.area || [w, h];
                sprite.tipo = tipo;
                sprite.gridX = Math.round(startX + w * 0.5 - 0.5);
                sprite.gridY = Math.round(startY + h * 0.5 - 0.5);
                sprite.lastFreePos = { startX, startY };
                sprite.isMoving = false;
                sprite.nome = itemData.nome || "solo_preparado";
                // sprite.setAlpha(0.7);
                // sprite.disableInteractive();

                if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
                this.scene.gameVariables.sprites.push(sprite);

                this.gridUtils.clearOccupied(sprite);
                this.gridUtils.markOccupied(sprite, startX, startY, w, h);
                this.gridUtils.recalculateDepthAround(sprite);

                placedTiles.push({ startX, startY, endX, endY });
            }

            this.scene.gameVariables.previewOccupiedtiles = placedTiles;

            if (placedTiles.length > 0) {
                this.scene.cameraController.ignoreInUICamera([...this.scene.gameVariables.sprites]);
                console.log(`✅ ${placedTiles.length} blocos de solo colocados corretamente no grid.`);
            } else {
                console.log("⚠ Nenhum bloco válido para arar.");
            }
        }
    }

    comprarItem(itemData) {

        const scale = itemData.escala;
        let originX = 0.5;
        let originY = 0.5;
        let tipo = "normal";

        if (itemData.origem) {
            originX = itemData.origem[0];
            originY = itemData.origem[1];
        }

        if (!itemData.tipo) {
            itemData.tipo = tipo;
        }

        if (itemData.noStopBuy) this.scene.gameVariables.buyItemTmp = itemData;

        const sprite = this.scene.spriteUtils.addGameSprite(itemData, this.scale / 2, this.scale / 2, scale, originX, originY);

        if (itemData.area) {
            sprite.footprint = itemData.area;
            sprite.tipo = itemData.tipo;
        }

        sprite.setAlpha(0.7);
        sprite.nome = itemData.nome;
        sprite.isMoving = true;
        sprite.setDepth(2000);

        if (sprite.tipo === "semente") {
            sprite.tipo_plantacao = itemData.tipo_plantacao
            this.scene.gameVariables.selectedSeed = sprite
            sprite.setAlpha(1);
        }
        else
            this.scene.gameVariables.scene.gameVariables.selectedSprite = sprite;

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        sprite.lastFreePos = { startX, startY };

        this.gridUtils.clearOccupied(sprite);

        const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
        sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

        if (sprite.tipo !== "semente") {
            for (let other of this.scene.gameVariables.sprites) {
                if (other !== sprite) other.disableInteractive();
            }
        }
        else {
            for (let other of this.scene.gameVariables.sprites) {
                if (other !== sprite && other.nome !== "solo_preparado") other.disableInteractive();
            }
        }


        if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
        this.scene.gameVariables.sprites.push(sprite);

        this.scene.cameraController.ignoreInUICamera([...this.scene.gameVariables.sprites])

        console.log("🛒 Novo item comprado, pronto pra posicionar.");
    }

    venderItem() {
        if (!this.scene.gameVariables.selectedSprite) return;
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        const item = this.scene.gameVariables.selectedSprite;
        this.gridUtils.clearOccupied(item);

        this.scene.hoverText.setVisible(false);
        const sprite_del = item;
        sprite_del.destroy();
        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        this.scene.gameVariables.selectedSprite = null;

        this.gridUtils.drawFootprints();
        this.gridUtils.drawMatrix();
    }

    desativarInteratividadeItens() {
        for (let other of this.scene.gameVariables.sprites) {
            if (other !== this.scene.gameVariables.selectedSprite) other.disableInteractive();
        }
    }


    desativarInteratividadeItensExceto(nome) {
        for (let other of this.scene.gameVariables.sprites) {
            if (other !== this.scene.gameVariables.selectedSprite && other.nome !== nome) other.disableInteractive();
        }
    }

    ativarInteratividadeItens() {
        for (let other of this.scene.gameVariables.sprites) {
            other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }

    ativarInteratividadeItensPorNome(nome) {
        for (let other of this.scene.gameVariables.sprites) {
            if (other.nome === nome) other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }

    addActionToQueue(action) {
        this.scene.gameVariables.actionQueue.push(action);
        this.processNextAction();
    }

    processNextAction() {
        const gv = this.scene.gameVariables;

        if (gv.isProcessingAction || gv.actionQueue.length === 0) return;

        const next = gv.actionQueue.shift();
        gv.isProcessingAction = true;

        if (next.type === "arar") {
            this.executeArarAction(next.data).then(() => {
                gv.isProcessingAction = false;
                this.processNextAction();
            });
        }

        else if (next.type === "plantar") {
            this.executePlantAction(next.data).then(() => {
                gv.isProcessingAction = false;
                this.processNextAction();
            });
        }
    }

}