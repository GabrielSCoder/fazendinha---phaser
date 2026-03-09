import { solos } from "../objects.js"

export default class PlantaController {
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

    updateSeeding() {
        if (!this.scene.gameVariables.planting) return;
        if (!this.scene.gameVariables.selectedSeed) return;
        if (this.scene.gameVariables.selling) this.uiEvents.emit("action:StopSelling");
        if (this.scene.gameVariables.plowing) this.uiEvents.emit("action:StopPlowing");

        const sprite = this.scene.gameVariables.selectedSeed;
        const pointer = this.scene.input.activePointer;

        sprite.x = pointer.worldX + 20;
        sprite.y = pointer.worldY;
    }

    stopSeeding() {
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

        this.uiEvents.emit("interact:ActivateAll");

        this.scene.gameVariables.planting = false;
    }

    plantSeed(solo) {
        if (!this.scene.gameVariables.selectedSeed || !solo || solo.nome != "solo_preparado") return;
        const semente = this.scene.gameVariables.selectedSeed;
        const tipo_plantacao = semente.tipo_plantacao;


        if (!tipo_plantacao) return;

        const itemData = solos.find(solo => solo.nome === tipo_plantacao);

        if (!itemData) return;

        const sprite_del = solo;
        sprite_del.destroy();
        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = "solo_plantado_simples";

        const { w, h } = this.gridUtils.getSpriteFootprint(solo);

        const iso = this.gridUtils.screenToIso(solo.x, solo.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const screenPos = this.gridUtils.isoToScreen(iso.x, iso.y);

        const sprite = this.scene.spriteUtils.addGameSprite(itemData, screenPos.x, screenPos.y, scale, originX, originY);

        const stages = [
            { percent: 1, texture: semente.img_pronta }
        ];

        this.scene.growthController.startGrowth(sprite, semente.tempoColheita * 60 * 1000, stages);

        sprite.footprint = itemData.area || [w, h];
        sprite.tipo = tipo;
        sprite.gridX = Math.round(startX + w * 0.5 - 0.5);
        sprite.gridY = Math.round(startY + h * 0.5 - 0.5);
        sprite.lastFreePos = { startX, startY };
        sprite.isMoving = false;
        sprite.nome = semente.nome;
        sprite.plantado = true;
        sprite.planta_cultivada = semente.nome;

        if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
        this.scene.gameVariables.sprites.push(sprite);
        this.scene.cameraController.ignoreInUICamera([...this.scene.gameVariables.sprites]);

        this.gridUtils.markOccupied(sprite, startX, startY, w, h);
        this.gridUtils.recalculateDepthAround(sprite);

        this.uiEvents.emit("action:FreeSoil");
    }


}