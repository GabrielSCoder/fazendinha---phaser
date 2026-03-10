import { solos } from "../objects.js"

export default class SoloController {
    constructor(scene, config = {}) {
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
        this.uiEvents = config.uiEvents;
        this.AcoesUtils = scene.acoesUtils;
        this.interact = scene.interactController;
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
        if (!this.scene.gameVariables.plowing) return;
        if (this.scene.gameVariables.selling) this.scene.sellControl.stopSelling();
        if (this.scene.gameVariables.planting) this.scene.plantControl.stopSeeding();

        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const startX = Math.floor(iso.x);
        const startY = Math.floor(iso.y);

        this.AcoesUtils.clearPreviewTiles();

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
                    .setOrigin(0, 0)
                    .setDepth(9999);

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


    startPlowing() {
        if (this.scene.gameVariables.plowing) return;

        if (this.scene.gameVariables.planting) this.uiEvents.emit("action:StopSeeding");
        if (this.scene.gameVariables.selling) this.uiEvents.emit("action:StopSelling");

        this.uiEvents.emit("interact:DesativateAll");
        this.scene.gameVariables.plowing = true;
    }

    stopPlowing() {
        if (!this.scene.gameVariables.plowing) return;

        this.scene.gameVariables.plowing = false;
        this.AcoesUtils.clearPreviewTiles();
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

        const tile = this.scene.gameVariables.previewOccupiedtiles[0];
        if (!tile) return null;

        const blockSize = 4;
        const startX = tile.startX ?? tile.x;
        const startY = tile.startY ?? tile.y;

        const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, blockSize, blockSize);
        if (ocupado) return null;

        const itemData = solos.find(c => c.nome === "solo_preparado");
        if (!itemData) return null;

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = itemData.tipo || "solo";

        const w = blockSize;
        const h = blockSize;

        const centerX = startX + (w / 2) - (1 - originX - 0.25);
        const centerY = startY + (h / 2) - (1 - originY - 0.18);

        const screenPos = this.gridUtils.isoToScreen(centerX, centerY);

        const sprite = this.scene.spriteUtils.addGameSprite(
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
        sprite.gridStartX = startX;
        sprite.gridStartY = startY;
        sprite.blockSize = blockSize;
        sprite.nome = "solo_preparado";
        sprite.tipo = tipo;
        sprite.disableInteractive();

        this.gridUtils.markTemporaryReserved(startX, startY, blockSize, blockSize);

        if (!this.scene.gameVariables.sprites)
            this.scene.gameVariables.sprites = [];

        this.scene.gameVariables.sprites.push(sprite);

        this.scene.cameraController.ignoreInUICamera([...this.scene.gameVariables.sprites]);

        return {
            sprite,
            screenX: screenPos.x,
            screenY: screenPos.y
        };
    }

    confirmSoil(sprite) {

        sprite.setAlpha(1);
        sprite.isReserved = false;

        const { gridStartX, gridStartY, blockSize } = sprite;

        this.gridUtils.clearTemporaryReserved(
            gridStartX,
            gridStartY,
            blockSize,
            blockSize
        );

        this.gridUtils.markGround(
            gridStartX,
            gridStartY,
            blockSize,
            blockSize
        );

        this.gridUtils.markOccupied(
            sprite,
            gridStartX,
            gridStartY,
            blockSize,
            blockSize
        );

        this.gridUtils.recalculateDepthAround(sprite);

    }

    executePlowingSoil(reserva, done) {

        const { sprite, screenX, screenY } = reserva;

        sprite.progressBar = this.scene.barController.criarBarraProgresso(
            screenX,
            screenY,
            50,
            10,
            1.8,
            () => {

                sprite.progressBar = null;

                this.confirmSoil(sprite);

                done();
            }
        );
    }

    cancelReserve(reserva) {

        const sprite = reserva.sprite;

        const { gridStartX, gridStartY, blockSize } = sprite;

        this.gridUtils.clearTemporaryReserved(
            gridStartX,
            gridStartY,
            blockSize,
            blockSize
        );

        this.scene.gameVariables.sprites =
            this.scene.gameVariables.sprites.filter(s => s !== sprite);

        sprite.destroy();
    }

    clearSoil(sprite) {

        if (!sprite) return;

        this.scene.growthController.cancelGrowth(sprite)
        sprite.nome = "solo_preparado";
        sprite.tipo = "solo_preparado";
        sprite.planta_cultivada = null;
        sprite.growthStages = null;
        sprite.preco_venda = 0;
        sprite.tempoColheita = null;
        sprite.img_pronta = null;
        sprite.growthStage = null;
        sprite.harvestReady = false;
        sprite.preco_colheita = null;
        sprite.setTexture("solo.png");
    }

}