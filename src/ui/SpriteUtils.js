import { plantar_solo, vender } from "../msgs.js";

export default class SpriteUtils {
    constructor(scene) {
        this.scene = scene;
    }

    addGameSprite(data, x, y, scale = 0.5, originX, originY) {

        const is_semente = data.tipo === "semente";
        const custom_scale = data.tipo === "semente" ? 0.2 : scale;

        const sprite = this.scene.add.sprite(x, y, data.img).setScale(custom_scale).setInteractive({
            pixelPerfect: true,
            alphaTolerance: 1,
            useHandCursor: true
        }).setOrigin(originX, originY);

        sprite.isMoving = false;
        sprite.isDraggable = true;

        this.scene.gameVariables.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });
        this.scene.gameVariables.sprites.push(sprite);
        this.scene.input.setDraggable(sprite);

        if (is_semente) this.scene.gameVariables.planting = true;

        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (sprite.isReserved) return;

            if (!this.scene.gameVariables.hoverEnabled) return;

            if (this.scene.gameVariables.middleButtonDown) return;

            if (this.scene.gameVariables.plantingBar)
                this.scene.hoverText.setVisible(false);

            if (this.scene.gameVariables.selling) {
                this.scene.gameVariables.selectedSprite = sprite;
                this.scene.acoesUtils.venderItem();
            } else if (!sprite.isMoving && sprite.tipo !== "solo") {
                this.scene.gameVariables.selectedSprite = sprite;
                this.scene.itemMenuUI.show(
                    this.scene.gameVariables.selectedSprite.x,
                    this.scene.gameVariables.selectedSprite.y,
                    this.scene.gameVariables.selectedSprite
                );
            } else if (
                sprite.nome === "solo_preparado" &&
                !this.scene.gameVariables.planting
            ) {
                this.scene.shopMenu.activeCategory = 'Sementes';
                this.scene.shopMenu.open();
            } else if (
                sprite.nome === "solo_preparado" &&
                this.scene.gameVariables.planting &&
                this.scene.gameVariables.selectedSeed
            ) {
                console.log("aqui")
                this.scene.gameVariables.selectedSprite = sprite;
            }
        });

        sprite.on("pointerover", () => {

            if (sprite.isReserved) return;
            if (sprite.isQueued) return;
            
            sprite.setTint(0xffff00);

            if (!sprite.isMoving) {
                let text = "";

                if (sprite.tipo !== "solo") {
                    text = sprite.nome || "Sem nome";
                } else if (sprite.nome !== "solo_plantado_simples") {
                    text = plantar_solo;
                } else {
                    text = sprite.plata_cultivada || "0%";
                }

                if (this.scene.gameVariables.selling)
                    text = vender;

                this.scene.hoverText.setText(text);

                const offsetY = 5;
                this.scene.hoverText.setPosition(
                    sprite.x - this.scene.hoverText.width / 2,
                    sprite.y - sprite.displayHeight / 2
                );
                this.scene.hoverText.setVisible(true);
            }
        });

        sprite.on("pointerout", () => {
            sprite.clearTint();
            this.scene.hoverText.setVisible(false);
        });

        return sprite;
    }
}
