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

        //console.log("Ligando listeners....")

        this.uiEvents.on("action:StopSeeding", () => {
            this.stopSeeding();
        })

        this.uiEvents.on("action:Seed", (solo) => {
            //console.log("-----")
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

        const sprite = solo;

        if (!tipo_plantacao) return;

        const itemData = solos.find(solo => solo.nome === tipo_plantacao);

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
        sprite.preco_venda = semente.preco_venda;
        sprite.preco_compra = semente.preco_compra;
        sprite.regrow = false;
        sprite.harvestTime = solo.harvestTime;
        sprite.xp = semente.xp;

        this.gridUtils.recalculateDepthAround(sprite);

        sprite.setAlpha(1)
        sprite.isQueued = false;
        sprite.setInteractive({ useHandCursor: true });

        this.uiEvents.emit("action:reward", {
            xp: 1,
            gold: -sprite.preco_compra ?? 0,
            x: sprite.x,
            y: sprite.y
        })

        this.uiEvents.emit("plant", { target: "solo_plantado_simples", seed: sprite.nome.toLowerCase(), sprite: sprite });

        this.uiEvents.emit("action:FreeSoil");
    }


}