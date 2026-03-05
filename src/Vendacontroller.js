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
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;
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
        sprite.setDepth(9999);
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

    
}