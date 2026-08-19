
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

        this.uiEvents.on("action:StartPlowing", (data) => {
            this.startPlowing(data);
        })

        this.uiEvents.on("action:StopPlowing", () => {
            this.stopPlowing();
        })

        this.uiEvents.on("action:FreeSoil", (solo) => {
            this.freeSoil(solo);
        });
    }

    updatePlowing(blocksWide = 1, blocksHigh = 1) {

        if (this.scene.gameVariables.activeBar) return;
        if (!this.scene.gameVariables.plowing) return;
        if (this.scene.gameVariables.selling)
            this.controllers.sell.stopSelling();

        if (this.scene.gameVariables.planting)
            this.controllers.plant.stopSeeding();

        const pointer = this.scene.input.activePointer;
        const sprite = this.scene.gameVariables.toolSprite;
        const cam = this.scene.cameras.main;

        const hasVehicle = !!sprite;

        const worldPoint = cam.getWorldPoint(
            pointer.x,
            pointer.y
        );

        const pointerOffset =
            blocksWide > 1 ? 2.7 : 1.3;

        if (sprite) {
            sprite.x = pointer.worldX + 10;
            sprite.y = pointer.worldY - 10;
        }

        const iso =
            this.controllers.gridUtils.screenToIso(
                worldPoint.x,
                worldPoint.y
            );

        const startX =
            Math.floor(iso.x - pointerOffset);

        const startY =
            Math.floor(iso.y - pointerOffset);

        this.controllers.acoesUtils.clearPreviewTiles();

        const blockSize = 4;

        const totalWidth =
            blockSize * blocksWide;

        const totalHeight =
            blockSize * blocksHigh;

        const outerCornersIso = [
            { x: startX, y: startY },
            { x: startX + totalWidth, y: startY },
            { x: startX + totalWidth, y: startY + totalHeight },
            { x: startX, y: startY + totalHeight }
        ];

        const outerCornersScreen =
            outerCornersIso.map(c =>
                this.gridUtils.isoToScreen(c.x, c.y)
            );

        const outerPoints = [];

        for (const c of outerCornersScreen) {
            outerPoints.push(c.x, c.y);
        }

        this.scene.gameVariables.previewOccupiedtiles = [];

        for (let bx = 0; bx < blocksWide; bx++) {

            for (let by = 0; by < blocksHigh; by++) {

                const sx =
                    startX + bx * blockSize;

                const sy =
                    startY + by * blockSize;

                const isOccupied =
                    this.gridUtils.checkOccupiedGrid(
                        sx,
                        sy,
                        sx + blockSize - 1,
                        sy + blockSize - 1,
                        null
                    );

                // Só procura solo seco se estiver usando veículo
                let drySoil = null;

                if (hasVehicle && isOccupied) {

                    drySoil =
                        this.controllers.spriteUtils.findDrySoil(
                            sx,
                            sy,
                            blockSize
                        );
                }

                let action = "blocked";

                // Espaço vazio → criar solo
                if (!isOccupied) {

                    action = "plow";

                    // Veículo + solo seco → renovar
                } else if (hasVehicle && drySoil) {

                    action = "renew";
                }

                const valid =
                    action === "plow" ||
                    action === "renew";

                const fillColor =
                    valid
                        ? 0x00aa00
                        : 0xaa0000;

                const borderColor =
                    valid
                        ? 0x66ff66
                        : 0xff6666;

                const cornersIso = [
                    { x: sx, y: sy },
                    { x: sx + blockSize, y: sy },
                    { x: sx + blockSize, y: sy + blockSize },
                    { x: sx, y: sy + blockSize }
                ];

                const cornersScreen =
                    cornersIso.map(c =>
                        this.gridUtils.isoToScreen(c.x, c.y)
                    );

                const points = [];

                for (const c of cornersScreen) {
                    points.push(c.x, c.y);
                }

                const tile = this.scene.add
                    .polygon(
                        0,
                        0,
                        points,
                        fillColor,
                        0.35
                    )
                    .setStrokeStyle(
                        1,
                        borderColor,
                        0.9
                    )
                    .setOrigin(0, 0)
                    .setDepth(3000);

                this.scene.gameVariables.previewTiles.push(tile);

                this.controllers.camera.ignoreInUICamera([
                    tile
                ]);

                this.scene.gameVariables.previewOccupiedtiles.push({
                    x: sx,
                    y: sy,
                    w: blockSize,
                    h: blockSize,
                    occupied: isOccupied,

                    // O que deve acontecer nessa célula
                    action: action,

                    sprite: drySoil
                });
            }
        }

        const outerBorder = this.scene.add
            .polygon(
                0,
                0,
                outerPoints,
                0x000000,
                0
            )
            .setStrokeStyle(
                2,
                0xffffff,
                0.7
            )
            .setOrigin(0, 0);

        this.scene.gameVariables.previewTiles.push(
            outerBorder
        );

        this.controllers.camera.ignoreInUICamera([
            outerBorder
        ]);
    }

    startPlowing(data) {
        if (this.scene.gameVariables.plowing) return;

        if (this.scene.gameVariables.planting) this.uiEvents.emit("action:StopSeeding");
        if (this.scene.gameVariables.selling) this.uiEvents.emit("action:StopSelling");
        if (this.scene.gameVariables.harvesting) this.uiEvents.emit("action:StopHarvesting");

        this.uiEvents.emit("interact:DesativateAll");
        this.scene.gameVariables.plowing = true;
        this.controllers.spriteUtils.addToolSprite(data, this.scene.scale / 2, this.scene.scale / 2, 0.2, 0.5, 0.5);
    }

    stopPlowing() {
        if (!this.scene.gameVariables.plowing) return;
        this.controllers.acoesUtils.clearPreviewTiles();
        this.controllers.acoesUtils.clearPreviewOccupiedTiles();
        this.scene.gameVariables.plowing = false;
        this.scene.gameVariables.changeActionSize(1, 1);
        this.uiEvents.emit("interact:ActivateAll");
        this.controllers.spriteUtils.destroyToolSprite();
    }

    freeSoil(solo) {

        if (!this.scene.gameVariables.planting)
            return;

        if (!solo || solo.destroyed)
            return;

        solo.isReserved = false;
        solo.isQueued = false;

        const reserved =
            this.scene.gameVariables.plantingReservedSoils || [];

        this.scene.gameVariables.plantingReservedSoils =
            reserved.filter(s => s !== solo);

        this.scene.gameVariables.selectedSeed.setDepth(2000);

        this.controllers.interact.ativarInteratividadeItensPorNome(solo.nome);
    }

    createReserveSoil() {

        const tiles = [];

        const blockSize = 4;

        const preview =
            this.scene.gameVariables.previewOccupiedtiles || [];

        const hasVehicle =
            !!this.scene.gameVariables.toolSprite;

        const itemData =
            this.solos.find(c => c.nome === "solo_preparado");

        if (!itemData)
            return [];

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = itemData.tipo || "solo";

        preview.forEach(tile => {

            const startX = tile.startX ?? tile.x;
            const startY = tile.startY ?? tile.y;

            /*
             * ==========================================
             * CRIAR NOVO SOLO
             * ==========================================
             */
            if (tile.action === "plow") {

                const ocupado =
                    this.gridUtils.checkOccupiedBlock(
                        startX,
                        startY,
                        blockSize,
                        blockSize
                    );

                if (ocupado)
                    return;

                const w = blockSize;
                const h = blockSize;

                const centerX =
                    startX +
                    (w / 2) -
                    (1 - originX - 0.1);

                const centerY =
                    startY +
                    (h / 2) -
                    (1 - originY - 0.15);

                const screenPos =
                    this.gridUtils.isoToScreen(
                        centerX,
                        centerY
                    );

                const sprite =
                    this.scene.controllers.spriteUtils.addGameSprite(
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

                this.gridUtils.markTemporaryReserved(
                    startX,
                    startY,
                    blockSize,
                    blockSize
                );

                if (!this.scene.gameVariables.sprites)
                    this.scene.gameVariables.sprites = [];

                this.scene.gameVariables.sprites.push(sprite);

                this.controllers.camera.ignoreInUICamera([
                    sprite
                ]);

                tiles.push({
                    sprite,
                    screenX: screenPos.x,
                    screenY: screenPos.y,
                    action: "plow"
                });

                return;
            }

            /*
             * ==========================================
             * RENOVAR SOLO SECO
             * ==========================================
             */
            if (
                tile.action === "renew" &&
                hasVehicle &&
                tile.sprite
            ) {

                const sprite = tile.sprite;

                if (sprite.isReserved || sprite.isQueued)
                    return;

                sprite.isReserved = true;
                sprite.setAlpha(0.4);
                sprite.disableInteractive();

                tiles.push({
                    sprite,
                    screenX: sprite.x,
                    screenY: sprite.y,
                    action: "renew"
                });
            }
        });

        return tiles;
    }

    confirmSoil(sprite) {

        sprite.setAlpha(1);
        sprite.isReserved = false;

        const tool = this.scene.gameVariables.toolSprite;

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

        tool.setDepth(9999);

        sprite.uuid = crypto.randomUUID();

        this.uiEvents.emit("action:reward", {
            xp: 1,
            gold: -this.scene.gameVariables.plowingCost ?? 0,
            energy: this.scene.gameVariables.vehicleSelected ? { action: "plow", amount: -this.scene.gameVariables.energyPlowCost } : null,
            x: sprite.x,
            y: sprite.y
        })

        this.uiEvents.emit("plow", { target: "solo_preparado", sprite: sprite });
    }

    executePlowingSoil(reserva, done) {

        const first = reserva[0];

        if (!first)
            return;

        const resp = this.canPlow();

        if (!resp) {
            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("action:StopPlowing");
            this.uiEvents.emit("ui:notify", { type: "" });
            return;
        }

        const bar =
            this.controllers.bar.criarBarraProgresso(
                first.screenX,
                first.screenY,
                50,
                10,
                0.5,
                () => {

                    reserva.forEach(tile => {

                        if (tile.action === "plow") {

                            this.confirmSoil(tile.sprite);

                        } else if (tile.action === "renew") {

                            this.renewSoil(tile.sprite);
                        }
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
        })

        return Math.floor(gold / price);
    }

    cancelReserve(reserva) {

        if (!reserva?.length)
            return;

        reserva.forEach(tile => {

            const sprite = tile.sprite;

            if (!sprite)
                return;

            if (tile.action === "plow") {

                const {
                    gridX,
                    gridY,
                    blockSize
                } = sprite;

                sprite.destroy();

                this.gridUtils.clearTemporaryReserved(
                    gridX,
                    gridY,
                    blockSize,
                    blockSize
                );

                this.scene.gameVariables.sprites =
                    this.scene.gameVariables.sprites.filter(
                        s => s !== sprite
                    );

                return;
            }

            if (tile.action === "renew") {

                sprite.isReserved = false;
                sprite.isQueued = false;
                sprite.cancelled = false;
                sprite.hoverEnabled = true;

                sprite.setAlpha(1);
                sprite.clearTint();

                sprite.setInteractive({
                    pixelPerfect: true,
                    alphaTolerance: 1,
                    useHandCursor: true
                });
            }
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

    renewSoil(sprite) {

        if (!sprite)
            return;

        sprite.nome = "solo_preparado";
        sprite.tipo = "solo_preparado";

        const tool = this.scene.gameVariables.toolSprite;

        console.log(tool)

        sprite.setTexture("solo2");

        sprite.setAlpha(1);

        sprite.isReserved = false;
        sprite.isQueued = false;
        sprite.cancelled = false;
        sprite.hoverEnabled = true;

        sprite.clearTint();

        if (!tool || !tool.action == "plow")
            sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

        this.uiEvents.emit("action:reward", {
            xp: 1,
            gold: -this.scene.gameVariables.prepareSoilCost ?? 0,
            energy: this.scene.gameVariables.vehicleSelected ? { action: "renew", amount: -this.scene.gameVariables.energyRenewSoilCost } : null,
            x: sprite.x,
            y: sprite.y
        });

        this.uiEvents.emit("renewSoil", {
            target: "solo_preparado",
            sprite: sprite
        });
    }

    executeRenewSoil(sprite, done) {

        const bar =
            this.controllers.bar.criarBarraProgresso(
                sprite.x,
                sprite.y,
                50,
                10,
                0.5,
                () => {

                    this.renewSoil(sprite);

                    done();
                }
            );

        return bar;
    }

    clearSoil(sprite) {

        if (!sprite) return;

        const tool = this.scene.gameVariables.toolSprite;

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

        if (!tool || !tool.action == "harvest")
            sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

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

}