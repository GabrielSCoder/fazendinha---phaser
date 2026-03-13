export default class VendaController {
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
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;
        this.plantingController = scene.plantControl;
        this.soilController = scene.soilControl;
        this.controllers = scene.controllers;

    }

    classEvents() {
        this.uiEvents.on("action:StartSelling", () => {
            this.startSelling();
        })

        this.uiEvents.on("action:StopSelling", () => {
            this.stopSelling();
        })

        this.uiEvents.on("action:SellItem", () => {
            this.sellItem();
        })

        this.uiEvents.on("action:SellItemUI", () => {
            this.sellItemUi();
        })
    }

    init() {
        this.classEvents();
    }

    startSelling() {
        if (this.scene.gameVariables.selling) return;

        this.scene.gameVariables.selectedSpriteDelete = null;

        if (this.scene.gameVariables.plowing) this.uiEvents.emit("action:StopPlowing");
        if (this.scene.gameVariables.planting) this.uiEvents.emit("action:StopSeeding");

        let originX = 0.5;
        let originY = 0.5;
        let scale = 0.2;
        let itemData = { img: "pa" };

        const sprite = this.controllers.spriteUtils.addGameSprite(
            itemData,
            this.scene.scale / 2,
            this.scene.scale / 2,
            scale,
            originX,
            originY
        );

        sprite.nome = "tool";
        sprite.isMoving = true;
        sprite.setDepth(9999);
        sprite.disableInteractive();

        this.scene.gameVariables.toolSprite = sprite;

        if (!this.scene.gameVariables.sprites)
            this.scene.gameVariables.sprites = [];

        this.scene.gameVariables.sprites.push(sprite);

        this.controllers.camera.ignoreInUICamera([
            ...this.scene.gameVariables.sprites
        ]);

        this.scene.gameVariables.selling = true;
    }

    stopSelling() {
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        const sprite_del = this.scene.gameVariables.toolSprite;
        sprite_del.destroy();

        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
            s => s && s !== sprite_del && !s.destroyed
        );

        this.scene.gameVariables.toolSprite = null;
        this.scene.gameVariables.selling = false;
        this.scene.gameVariables.selectedSprite = null;
        this.scene.gameVariables.selectedSpriteDelete = null;
    }

    updateSelling() {
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        const sprite = this.scene.gameVariables.toolSprite;
        const pointer = this.scene.input.activePointer;

        sprite.x = pointer.worldX + 10;
        sprite.y = pointer.worldY - 10;
    }

    sellItem() {
        if (!this.scene.gameVariables.selectedSpriteDelete) return;
        if (!this.scene.gameVariables.selling) return;
        if (!this.scene.gameVariables.toolSprite) return;

        this.completeSell();
    }

    sellItemUi() {

        if (!this.scene.gameVariables.selectedSpriteDelete) return;

        this.completeSell();
    }

    completeSell() {

        const item = this.scene.gameVariables.selectedSpriteDelete;

        if (item.growthStart && !item.harvestReady) {
            this.controllers.growth.cancelGrowth(item);
        }

        this.gridUtils.clearOccupied(item);

        this.controllers.sprite.hoverText.setVisible(false);
        const sprite_del = item;
        sprite_del.destroy();
        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        this.scene.gameVariables.selectedSprite = null;
        this.scene.gameVariables.selectedSpriteDelete = null;
        this.scene.gameVariables.hoveredSprite = null;

        this.gridUtils.drawFootprints();
        this.gridUtils.drawMatrix();

        this.uiEvents.emit("action:reward", {
            xp: 0,
            gold: item.preco_venda,
            x: item.x,
            y: item.y
        });
    }


}