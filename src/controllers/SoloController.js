
export default class SoloController {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.input = scene.input;
        this.itemMenuUI = scene.itemMenuUI;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;
        this.AcoesUtils = scene.acoesUtils;
        this.interact = scene.interactController;
        this.solos = scene.solos;

    }

    init() {
        this.classEvents();
    }

    classEvents() {

        this.uiEvents.on("action:StartPlowing", () => {
            this.startPlowing();
        })

        this.uiEvents.on("action:StopPlowing", () => {
            this.stopPlowing();
        })

        this.uiEvents.on("action:FreeSoil", () => {
            this.freeSoil();
        })
    }

    updatePlowing(blocksWide = 1, blocksHigh = 1) {

        if (this.scene.gameVariables.middleButtonDown) return;
        if (this.scene.gameVariables.activeBar) return;
        if (!this.scene.gameVariables.plowing) return;
        if (this.scene.gameVariables.selling) this.controllers.sell.stopSelling();
        if (this.scene.gameVariables.planting) this.controllers.plant.stopSeeding();


        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.controllers.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const startX = Math.floor(iso.x);
        const startY = Math.floor(iso.y);

        this.controllers.acoesUtils.clearPreviewTiles();

        const blockSize = 4; 
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

        this.scene.gameVariables.previewOccupiedtiles = [];

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
                    .setOrigin(0, 0)
                    .setDepth(9999);

                this.scene.gameVariables.previewTiles.push(tile);
                this.controllers.camera.ignoreInUICamera([tile]);

                this.scene.gameVariables.previewOccupiedtiles.push({ x: sx, y: sy, w: blockSize, h: blockSize, occupied: isOccupied });
            }
        }

        const outerBorder = this.scene.add
            .polygon(0, 0, outerPoints, 0x000000, 0)
            .setStrokeStyle(2, 0xffffff, 0.7)
            .setOrigin(0, 0);

        this.scene.gameVariables.previewTiles.push(outerBorder);
        this.controllers.camera.ignoreInUICamera([outerBorder]);
    }


    startPlowing() {
        if (this.scene.gameVariables.plowing) return;

        if (this.scene.gameVariables.planting) this.uiEvents.emit("action:StopSeeding");
        if (this.scene.gameVariables.selling) this.uiEvents.emit("action:StopSelling");

        this.uiEvents.emit("interact:DesativateAll");
        this.scene.gameVariables.plowing = true;
    }

    stopPlowing() {
        if (!this.scene.gameVariables.plowing) return;
        this.controllers.acoesUtils.clearPreviewTiles();
        this.controllers.acoesUtils.clearPreviewOccupiedTiles();
        this.scene.gameVariables.plowing = false;
        this.uiEvents.emit("interact:ActivateAll");
    }

    freeSoil() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;

        this.scene.gameVariables.selectedSeed.setDepth(2000);
        this.scene.gameVariables.selectedSprite = null;

        this.uiEvents.emit("interact:ActivateByName", "solo_preparado");

        // this.scene.gameVariables.planting = false;
    }


    createReserveSoil() {

        const tiles = [];
        const validTiles = [];

        const blockSize = 4;

        this.scene.gameVariables.previewOccupiedtiles.forEach(tile => {

            const startX = tile.startX ?? tile.x;
            const startY = tile.startY ?? tile.y;

            const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, blockSize, blockSize);

            if (!ocupado) {
                validTiles.push({ startX, startY });
            }

        });

        if (!validTiles.length) return [];

        const itemData = this.solos.find(c => c.nome === "solo_preparado");
        if (!itemData) return [];

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = itemData.tipo || "solo";

        // PASSO 2: criar reservas
        validTiles.forEach(({ startX, startY }) => {

            const w = blockSize;
            const h = blockSize;

            const centerX = startX + (w / 2) - (1 - originX - 0.1);
            const centerY = startY + (h / 2) - (1 - originY - 0.15);

            console.log(centerX)
            console.log(centerY)

            const screenPos = this.gridUtils.isoToScreen(centerX, centerY);

            const sprite = this.scene.controllers.spriteUtils.addGameSprite(
                itemData,
                screenPos.x,
                screenPos.y,
                scale,
                originX,
                originY
            );

            sprite.harvestTime = 0;
            sprite.setAlpha(0.4);
            sprite.isReserved = true;
            sprite.hoverEnabled = true;
            sprite.gridX = startX;
            sprite.gridY = startY;
            sprite.blockSize = blockSize;
            sprite.nome = "solo_preparado";
            sprite.tipo = tipo;
            sprite.preco_venda = itemData.preco_venda;
            sprite.disableInteractive();

            // agora reserva
            this.gridUtils.markTemporaryReserved(startX, startY, blockSize, blockSize);

            if (!this.scene.gameVariables.sprites)
                this.scene.gameVariables.sprites = [];

            this.scene.gameVariables.sprites.push(sprite);

            this.controllers.camera.ignoreInUICamera([sprite]);

            tiles.push({
                sprite,
                screenX: screenPos.x,
                screenY: screenPos.y
            });

        });

        return tiles;
    }

    confirmSoil(sprite) {

        sprite.setAlpha(1);
        sprite.isReserved = false;

        const { gridX, gridY, blockSize } = sprite;

        this.gridUtils.clearTemporaryReserved(
            gridX,
            gridY,
            blockSize,
            blockSize
        );

        this.gridUtils.markGround(
            gridX,
            gridY,
            blockSize,
            blockSize
        );

        this.gridUtils.markOccupied(
            sprite,
            gridX,
            gridY,
            blockSize,
            blockSize
        );

        this.gridUtils.recalculateDepthAround(sprite);

        sprite.uuid = `${sprite.gridX}_${sprite.gridY}`

        this.uiEvents.emit("action:reward", {
            xp: 1,
            gold: -this.scene.gameVariables.plowingCost ?? 0,
            x: sprite.x,
            y: sprite.y
        })

        this.uiEvents.emit("plow", { target: "solo_preparado", sprite: sprite });
    }

    executePlowingSoil(reserva, done) {

        const first = reserva[0];

        const resp = this.canPlow();

        if (!resp) {
            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("action:StopPlowing");
            this.uiEvents.emit("ui:notify", { type: "" });
            return;
        }

        const bar = this.controllers.bar.criarBarraProgresso(
            first.screenX,
            first.screenY,
            50,
            10,
            0.5,
            () => {

                reserva.forEach(tile => {

                    this.confirmSoil(tile.sprite);
                });

                done();

            }
        );

        return bar;
    }

    getAffordableTiles() {

        const price = this.scene.gameVariables.plowingCost;
        let gold = null;

        this.uiEvents.emit("action:getGold", (result) => {
            gold = result;
            //console.log(gold)
        })

        return Math.floor(gold / price);
    }

    cancelReserve(reserva) {

        reserva.forEach(tile => {

            const sprite = tile.sprite;

            const { gridStartX, gridStartY, blockSize } = sprite;

            sprite.destroy();

            this.gridUtils.clearTemporaryReserved(
                gridStartX,
                gridStartY,
                blockSize,
                blockSize
            );

            this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(s => s !== sprite);

        });

    }

    canPlow(reney = false) {

        const price = !reney ? this.scene.gameVariables.plowingCost : this.scene.gameVariables.prepareSoilCost;

        let HaveMoney = false;

        this.uiEvents.emit("action:buyItem", {
            type: "gold",
            price: price,
            level: 1
        }, (result) => {
            HaveMoney = result;
        })

        if (!HaveMoney) {
            return false;
        }

        return true;
    }

    renewDrySoil(sprite) {

        if (this.controllers.queue.isFull()) return;

        let progressBar = null;

        sprite.setAlpha(0.7);
        sprite.disableInteractive();
        sprite.clearTint();
        this.scene.gameVariables.hoveredSprite = null;
        this.controllers.sprite.hoverText.setVisible(false);

        this.canPlow(true)

        this.controllers.queue.add({

            action: (done) => {

                progressBar = this.controllers.soil.executeRenewSoil(sprite, () => {

                    done();

                });

            },

            onCancel: () => {

                if (progressBar) {
                    progressBar.cancel();
                    progressBar = null;
                }

                sprite.setAlpha(1)
                sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

            }

        });

    }

    executeRenewSoil(sprite, done) {

        const bar = this.controllers.bar.criarBarraProgresso(
            sprite.x,
            sprite.y,
            50,
            10,
            1.8,
            () => {

                sprite.nome = "solo_preparado";
                sprite.tipo = "solo_preparado";

                sprite.setTexture("solo2");
                sprite.setAlpha(1)

                sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

                this.uiEvents.emit("action:reward", {
                    xp: 1,
                    gold: -this.scene.gameVariables.prepareSoilCost ?? 0,
                    x: sprite.x,
                    y: sprite.y
                })

                this.uiEvents.emit("renewSoil", { target: "solo_preparado", sprite: sprite });

                done();

            }
        );

        return bar;
    }

    clearSoil(sprite) {

        if (!sprite) return;

        this.controllers.growth.cancelGrowth(sprite)
        sprite.nome = "solo_seco";
        sprite.tipo = "solo_seco";
        sprite.planta_cultivada = null;
        sprite.growthStages = null;
        sprite.preco_venda = 1;
        sprite.xp = 0;
        sprite.tempoColheita = null;
        sprite.img_pronta = null;
        sprite.growthStage = null;
        sprite.harvestReady = false;
        sprite.preco_colheita = null;
        sprite.setOrigin(0.52, 0.4);
        sprite.setTexture("solo_seco");
        sprite.setAlpha(1);
        sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

        return true;
    }

}