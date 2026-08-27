import { solos } from "../objects.js"

export default class PlantaController {
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
        this.staticMode = scene.gameVariables.staticMode;

    }

    init() {
        this.classEvents();
    }

    classEvents() {

        this.uiEvents.on("action:StopSeeding", () => {
            this.stopSeeding();
        })

        this.uiEvents.on("action:Seed", (solo) => {
            this.plantSeed(solo);
        })
    }

    updateSeeding(blocksWide = 1, blocksHigh = 1) {

        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;

        if (this.scene.gameVariables.middleButtonDown) return;
        if (this.scene.gameVariables.activeBar) return;

        if (this.scene.gameVariables.selling) {
            this.controllers.sell.stopSelling();
        }

        if (this.scene.gameVariables.plowing) {
            this.uiEvents.emit("action:StopPlowing");
        }

        if (this.scene.gameVariables.harvesting) {
            this.uiEvents.emit("action:StopHarvesting");
        }

        const tool = this.scene.gameVariables.toolSprite;
        const sprite = this.scene.gameVariables.selectedSeed;
        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const pointerOffset = blocksWide > 1 ? 2.7 : 1.3;
        const seedOffset = tool ? 40 : 20;

        sprite.x = pointer.worldX + seedOffset;
        sprite.y = pointer.worldY;
        sprite.setDepth(9999);

        if (tool) {
            tool.x = pointer.worldX;
            tool.y = pointer.worldY;
        }

        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.controllers.gridUtils.screenToIso(
            worldPoint.x,
            worldPoint.y
        );

        const startX = Math.floor(iso.x - pointerOffset);
        const startY = Math.floor(iso.y - pointerOffset);

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

                const sx = startX + bx * blockSize;
                const sy = startY + by * blockSize;

                const soil = this.controllers.spriteUtils.findPreparedSoil(
                    sx,
                    sy,
                    blockSize
                );

                const valid = !!soil;

                const fillColor = valid
                    ? 0x00aa00
                    : 0xaa0000;

                const borderColor = valid
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
                    .setDepth(1999);

                this.scene.gameVariables.previewTiles.push(tile);

                this.controllers.camera.ignoreInUICamera([tile]);

                this.scene.gameVariables.previewOccupiedtiles.push({
                    x: sx,
                    y: sy,
                    w: blockSize,
                    h: blockSize,
                    occupied: !valid,
                    sprite: soil
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

    stopSeeding() {

        if (!this.scene.gameVariables.planting) return;

        this.controllers.acoesUtils.clearPreviewTiles();
        this.controllers.acoesUtils.clearPreviewOccupiedTiles();

        if (this.controllers.soil?.cancelReserve) {
            const reserved = this.controllers.soil.getReservedSoils?.();

            if (reserved?.length) {
                this.controllers.soil.cancelReserve(reserved);
            }
        }


        const seed = this.scene.gameVariables.selectedSeed;

        if (seed) {

            seed.setDepth(2000);

            seed.destroy();

            this.scene.gameVariables.sprites =
                this.scene.gameVariables.sprites.filter(
                    s => s && s !== seed && !s.destroyed
                );
        }

        const tool = this.scene.gameVariables.toolSprite;

        if (tool) {
            this.controllers.spriteUtils.destroyToolSprite();
        }

        this.scene.gameVariables.selectedSprite = null;
        this.scene.gameVariables.selectedSeed = null;

        this.scene.gameVariables.planting = false;

        this.scene.gameVariables.changeActionSize(1, 1);

        this.uiEvents.emit("interact:ActivateAll");
    }

    plantSeed(solo) {

        if (!this.scene.gameVariables.selectedSeed || !solo || solo.nome != "solo_preparado") return;

        const semente = this.scene.gameVariables.selectedSeed;
        const tipo_plantacao = semente.tipo_plantacao;

        const sprite = solo;

        if (!tipo_plantacao) return;

        const itemData = solos.find(solo => solo.nome === tipo_plantacao);

        const tool = this.scene.gameVariables.toolSprite;

        if (!itemData) return;

        sprite.setTexture(itemData.img)

        const stages = [
            { percent: 1, texture: semente.img_pronta, origem: [0.52, 0.45] }
        ];

        let plantCalc = this.scene.gameVariables.fastHarvestMode ? this.scene.gameVariables.debugHaverstTime : semente.tempoColheita;

        if (!this.staticMode)
            this.controllers.growth.startGrowth(sprite, plantCalc * 60 * 1000, stages);

        sprite.tipo = semente.tipo_plantacao;
        sprite.isMoving = false;
        sprite.nome = semente.nome;
        sprite.plantado = true;
        sprite.planta_cultivada = semente.id;
        sprite.preco_colheita = semente.preco_venda;
        sprite.preco_compra = semente.preco_compra;
        sprite.regrow = false;
        sprite.harvestTime = solo.harvestTime;
        sprite.xp = semente.xp;

        this.gridUtils.recalculateDepthAround(sprite);

        sprite.setAlpha(1)
        sprite.isQueued = false;
        sprite.setInteractive({ useHandCursor: true });

        if (tool)
            tool.setDepth(9999);

        this.uiEvents.emit("action:reward", {
            xp: 1,
            gold: -sprite.preco_compra ?? 0,
            energy: this.scene.gameVariables.vehicleSelected ? { action: "seed", amount: -this.scene.gameVariables.energySeedCost } : null,
            x: sprite.x,
            y: sprite.y
        })



        this.uiEvents.emit("plant", { target: "solo_plantado_simples", seed: sprite.nome.toLowerCase(), sprite: sprite });

        this.uiEvents.emit("action:FreeSoil", sprite);
    }

    createReservePlantSoil() {

        const preview =
            this.scene.gameVariables.previewOccupiedtiles;

        if (!preview?.length)
            return [];

        const reservation = [];

        for (const tile of preview) {

            if (tile.occupied)
                continue;

            const soil = tile.sprite;

            if (!soil)
                continue;

            if (soil.isReserved || soil.isQueued)
                continue;

            soil.isReserved = true;
            soil.action = "seed";

            reservation.push(soil);
        }

        return reservation;
    }

    cancelReserve(reservation) {

        if (!reservation)
            return;

        reservation.forEach(soil => {

            if (!soil)
                return;

            soil.isReserved = false;
        });
    }

    canAffordOneSeed(preco) {
        if (!this.scene.gameVariables.selectedSeed) return;
        if (!preco) return;

        let HaveMoney = false;

        this.uiEvents.emit("action:buyItem", {
            type: "gold",
            price: preco,
            level: 1
        }, (result) => {
            HaveMoney = result;
        })

        if (!HaveMoney) {
            return false;
        }

        return true;
    }
}