import { solos } from "./objects.js"

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
    }

    startArando() {
        if (this.scene.gameVariables.arando) return;

        if (this.scene.gameVariables.planting) this.stopSeed();
        if (this.scene.gameVariables.selling) this.stopSell();
        this.desativarInteratividadeItens();
        this.scene.gameVariables.arando = true;

        console.log(this.scene.gameVariables.arando);
    }

    stopArando() {
        if (!this.scene.gameVariables.arando) return;

        this.scene.gameVariables.arando = false;
        this.clearPreviewTiles();
        console.log("parando arar");
        this.ativarInteratividadeItens()
    }

    cancelArar() {
        if (!this.scene.gameVariables.arando) return;

        this.scene.gameVariables.arando = false;
        this.clearPreviewTiles();
        this.scene.gameVariables.previewOccupiedtiles = [];
        this.ativarInteratividadeItens();

        console.log("parando arar");
    }

    freeSolo() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;

        this.scene.gameVariables.selectedSeed.setDepth(2000);
        this.scene.gameVariables.selectedSprite = null;

        this.ativarInteratividadeItensPorNome("solo_prepadado");

        // this.scene.gameVariables.planting = false;
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
                sprite.disableInteractive();
                sprite.setAlpha(0.7);

                if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
                this.scene.gameVariables.sprites.push(sprite);

                this.gridUtils.clearOccupied(sprite);
                this.gridUtils.markOccupied(sprite, startX, startY, w, h);
                this.gridUtils.recalculateDepthAround(sprite);

                placedTiles.push({ startX, startY, endX, endY });

                this.scene.acoesUtils.criarBarraProgresso(screenPos.x, screenPos.y, 50, 10, 1.8, () => {
                    sprite.setAlpha(1.0)
                })
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

    ararSoloAction(done) {
        const reserva = this.criarReservaSolo();

        if (!reserva) return done();

        this.criarBarraProgresso(
            reserva.screenX,
            reserva.screenY,
            50,
            10,
            1.8,
            () => {
                this.confirmarSolo(reserva.sprite);
                done();
            }
        );
    }

    criarReservaSolo() {

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

        sprite.setAlpha(0.4);
        sprite.isReserved = true;
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

    confirmarSolo(sprite) {

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

    executarArarSolo(reserva, done) {

        const { sprite, screenX, screenY } = reserva;

        this.criarBarraProgresso(
            screenX,
            screenY,
            50,
            10,
            1.8,
            () => {

                this.confirmarSolo(sprite);

                done();
            }
        );
    }

    cancelReserva(reserva) {

        const sprite = reserva.sprite;

        const { gridStartX, gridStartY, blockSize } = sprite;

        this.gridUtils.clearTemporaryReserved(
            gridStartX,
            gridStartY,
            blockSize,
            blockSize
        );

        sprite.destroy();
    }

}