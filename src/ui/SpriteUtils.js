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

        sprite.originalScale = sprite.scaleX;
        sprite.isMoving = false;
        sprite.isDraggable = true;
        sprite.nome = data.nome;
        sprite.tipo = data.tipo;
        sprite.preco_venda = data.preco_venda;
        sprite.preco_compra = data.preco_compra;
        sprite.xp = data.xp;
        sprite.xpYeld = false;

        if (is_semente) {
            this.scene.gameVariables.planting = true;
            sprite.regrow = false;
        }

        const canGrow = this.scene.spriteController.growingSprites.find(c => c == data.tipo);

        if (canGrow) {
            sprite.tempoColheita = data.tempo_colheita_horas;
            sprite.img_pronta = data.img_pronta ?? "";
            sprite.growthStage = 0;
            sprite.harvestReady = false;
            sprite.preco_colheita = data.preco_venda;
            sprite.canGrow = true;
            if (!is_semente) sprite.regrow = true;
        }

        this.scene.gameVariables.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });
        this.scene.gameVariables.sprites.push(sprite);
        this.scene.input.setDraggable(sprite);

        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (sprite.isReserved) return;

            if (sprite.harvestReady) return;

            if (!this.scene.gameVariables.hoverEnabled) return;

            if (this.scene.gameVariables.middleButtonDown) return;

            if (this.scene.gameVariables.selling) {
                this.scene.gameVariables.selectedSprite = sprite;
                this.scene.gameVariables.eventsCenter.emit("action:SellItem");
            } else if (!sprite.isMoving && sprite.tipo !== "solo_plantado_simples" && sprite.tipo !== "solo_preparado") {
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
                this.scene.gameVariables.selectedSprite = sprite;
            }
        });

        sprite.on("pointerup", () => {
            this.scene.harvestController.tryHarvest(sprite)
        })

        sprite.on("pointerover", () => {


            if (sprite.isReserved) return;
            if (sprite.isQueued) return;
            if (sprite.isMoving) return;

            sprite.setTint(0xf2d602);

            this.scene.gameVariables.hoveredSprite = sprite;

            if (!sprite.isMoving) {

                this.scene.spriteController.updateHoverText(sprite);

                this.scene.spriteController.hoverText.setPosition(
                    sprite.x - this.scene.spriteController.hoverText.width / 2,
                    sprite.y - sprite.displayHeight / 2
                );

                this.scene.spriteController.hoverText.setVisible(true);
            }

        });

        sprite.on("pointerout", () => {
            sprite.clearTint();
            // sprite.setScale(sprite.originalScale);
            this.scene.gameVariables.hoveredSprite = null;
            this.scene.spriteController.hoverText.setVisible(false);
        });

        return sprite;
    }

    destroySprite(sprite) {

        sprite.isMoving = false;
        this.scene.gameVariables.buyItemTmp = null;
        sprite.destroy();

        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
            (s) => s && s !== sprite && !s.destroyed
        );

        this.scene.gridUtils.recalculateDepthAround(sprite);
        this.scene.gameVariables.selectedSprite = null;

        this.scene.gameVariables.sprites.forEach((s) => {
            if (s && !s.destroyed) {
                s.setInteractive({
                    pixelPerfect: true,
                    alphaTolerance: 1,
                    useHandCursor: true,
                });
            }
        });

        this.scene.gridUtils.drawFootprints();
    }
}
