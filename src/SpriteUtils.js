import { plantar_solo, vender } from "./msgs.js";

export default class SpriteUtils {

    constructor(scene) {
        this.scene = scene;
    }

    addGameSprite(data, x, y, scale = 0.5, originX, originY) {

        const is_semente = data.tipo === "semente"
        const custom_scale = data.tipo === "semente" ? 0.2 : scale;

        const sprite = this.scene.add.sprite(x, y, data.img).setScale(custom_scale).setInteractive({
            pixelPerfect: true,
            alphaTolerance: 1,
            useHandCursor: true
        }).setOrigin(originX, originY);

        sprite.isMoving = false;
        sprite.isDraggable = true;

        this.scene.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });

        this.scene.sprites.push(sprite);

        this.scene.input.setDraggable(sprite);

        if (is_semente) this.scene.planting = true;


        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();
            if (!this.scene.hoverEnabled) return;

            if (this.middleButtonDown) return;

            if (this.scene.plantingBar) this.scene.hoverText.setVisible(false);

            if (this.scene.selling) {
                this.scene.selectedSprite = sprite;
                this.scene.venderItem();
            } else if (!sprite.isMoving && sprite.tipo !== "solo") {
                this.scene.selectedSprite = sprite;
                this.scene.itemMenuUI.show(this.scene.selectedSprite.x, this.scene.selectedSprite.y, this.scene.selectedSprite);
            } else if (sprite.nome === "solo_preparado" && !this.scene.planting) {
                this.scene.shopMenu.open();
            } else if (sprite.nome === "solo_preparado" && this.scene.planting && this.scene.selectedSeed) {
                this.scene.selectedSprite = sprite;
            }
        });

        sprite.on("pointerover", () => {

            sprite.setTint(0xffff00);

            if (!sprite.isMoving) {
                let text = ""

                if (sprite.tipo !== "solo") {
                    text = sprite.nome || "Sem nome";
                } else if (sprite.nome !== "solo_plantado_simples") {
                    text = plantar_solo;
                } else {
                    text = sprite.plata_cultivada || "0%";
                }

                if (this.scene.selling)
                    text = text + "\n" + vender

                this.scene.hoverText.setText(text);

                const offsetY = 5;
                this.scene.hoverText.setPosition(
                    sprite.x - this.scene.hoverText.width / 2,
                    sprite.y - sprite.displayHeight / 2
                );
                this.scene.hoverText.setVisible(true);
            }
        })

        sprite.on("pointerout", () => {
            sprite.clearTint()
            this.scene.hoverText.setVisible(false);
        })

        return sprite;
    }
}