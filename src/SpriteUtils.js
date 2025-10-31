import {plantar_solo} from "./msgs.js";

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

        if (!this.hoverText) {
            this.hoverText = this.scene.add.text(0, 0, "", {
                fontSize: "12px",
                fontFamily: "Arial",
                color: "#ffffff",
                padding: { x: 6, y: 3 }
            }).setDepth(10000).setVisible(false);

            this.scene.cameraController.ignoreInUICamera([this.hoverText]);
        }

        if (is_semente) this.scene.planting = true;

        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (this.middleButtonDown) return;

            if (!sprite.isMoving && sprite.tipo !== "solo") {
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
                if (sprite.tipo !== "solo") {
                    this.hoverText.setText(sprite.nome || "Sem nome");
                } else if (sprite.nome !== "solo_plantado_simples") {
                    this.hoverText.setText(plantar_solo);
                } else {
                    this.hoverText.setText(sprite.plata_cultivada || "0%");
                }
                
                const offsetY = 5;
                this.hoverText.setPosition(
                    sprite.x - this.hoverText.width / 2,
                    sprite.y - sprite.displayHeight / 2
                );
                this.hoverText.setVisible(true);
            }
        })

        sprite.on("pointerout", () => {
            sprite.clearTint()
            this.hoverText.setVisible(false);
        })

        return sprite;
    }
}