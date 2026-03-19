export default class SpriteUtils {
    constructor(scene, configs = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = configs.uiEvents;
    }

    addGameSprite(data, x, y, scale = 0.5, originX, originY) {

        const is_semente = data.tipo === "semente";
        const custom_scale = data.tipo === "semente" ? 0.2 : scale;

        const sprite = this.scene.add.sprite(x, y, data.img).setScale(custom_scale).setInteractive({
            pixelPerfect: true,
            alphaTolerance: 1,
            useHandCursor: true
        }).setOrigin(originX, originY);

        sprite.id = data.id;
        sprite.originalScale = sprite.scaleX;
        sprite.isMoving = false;
        sprite.isDraggable = true;
        sprite.nome = data.nome;
        sprite.tipo = data.tipo;
        sprite.preco_venda = data.preco_venda;
        sprite.preco_compra = data.preco_compra;
        sprite.preco_compra_grana = data.preco_compra_grana;
        sprite.xp = data.xp;
        sprite.xpYeld = false;
        sprite.original_sprite = data.img;

        if (is_semente) {
            this.scene.gameVariables.planting = true;
            sprite.regrow = false;
        }

        const canGrow = this.controllers.sprite.growingSprites.find(c => c == data.tipo);

        if (canGrow) {
            sprite.tempoColheita = data.tempo_colheita_horas;
            sprite.img_pronta = data.img_pronta ?? "";
            sprite.growthStage = 0;
            sprite.harvestReady = false;
            sprite.preco_colheita = data.preco_venda;
            sprite.canGrow = true;

            const stages = [
                { percent: 1, texture: sprite.texture.key },
                { percent: 100, texture: sprite.img_pronta ?? sprite.texture.key }
            ];

            sprite.stages = stages;

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
                this.scene.gameVariables.selectedSpriteDelete = sprite;
                this.uiEvents.emit("ui:notify", {
                    type: "sell", nome: this.scene.gameVariables.selectedSpriteDelete.nome,
                    preco: this.scene.gameVariables.selectedSpriteDelete.preco_venda, action: "action:SellItem"
                });
            } else if (!sprite.isMoving && sprite.tipo !== "solo_plantado_simples" && sprite.tipo !== "solo_preparado" && sprite.nome !== "solo_seco") {
                this.scene.gameVariables.selectedSprite = sprite;
                this.controllers.itemMenu.show(
                    this.scene.gameVariables.selectedSprite.x,
                    this.scene.gameVariables.selectedSprite.y,
                    this.scene.gameVariables.selectedSprite
                );
            } else if (
                sprite.nome === "solo_preparado" &&
                !this.scene.gameVariables.planting
            ) {
                this.controllers.shopMenu.activeCategory = 'Sementes';
                this.controllers.shopMenu.open();
            } else if (sprite.nome === "solo_seco") {
                this.controllers.soil.renewDrySoil(sprite)
            } else if (
                sprite.nome === "solo_preparado" &&
                this.scene.gameVariables.planting &&
                this.scene.gameVariables.selectedSeed
            ) {
                this.scene.gameVariables.selectedSprite = sprite;
            }
        });

        sprite.on("pointerup", () => {
            this.controllers.harvest.tryHarvest(sprite)
        })

        sprite.on("pointerover", () => {


            if (sprite.isReserved) return;
            if (sprite.isQueued) return;
            if (sprite.isMoving) return;

            sprite.setTint(0xf2d602);

            this.scene.gameVariables.hoveredSprite = sprite;

            if (!sprite.isMoving) {

                this.controllers.sprite.updateHoverText(sprite);

                this.controllers.sprite.hoverText.setPosition(
                    sprite.x - this.controllers.sprite.hoverText.width / 2,
                    sprite.y - sprite.displayHeight / 2
                );

                this.controllers.sprite.hoverText.setVisible(true);
            }

        });

        sprite.on("pointerout", () => {
            sprite.clearTint();
            // sprite.setScale(sprite.originalScale);
            this.scene.gameVariables.hoveredSprite = null;
            this.controllers.sprite.hoverText.setVisible(false);
        });

        return sprite;
    }

    onRotateClick() {

        const sprite = this.scene.gameVariables.selectedSprite;
        if (!sprite || !sprite.footprint) return;
        this.controllers.itemMenu.hide();

        if (!sprite.originalFootprint) {
            if (Array.isArray(sprite.footprint)) {
                sprite.originalFootprint = [...sprite.footprint];
            } else {
                const { w, h } = sprite.footprint;
                sprite.originalFootprint = [w, h];
            }
        }

        if (sprite.isRotated) {
            sprite.flipX = false;
            sprite.isRotated = false;
            sprite.footprint = [...sprite.originalFootprint];
        } else {
            sprite.flipX = true;
            sprite.isRotated = true;
            const [origW, origH] = sprite.originalFootprint;
            sprite.footprint = [origH, origW];
        }

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const [w, h] = sprite.footprint;
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        sprite.gridX = Math.round(iso.x);
        sprite.gridY = Math.round(iso.y);

        sprite.lastFreePos = { startX, startY };

        for (let other of this.scene.gameVariables.sprites) {
            if (other !== sprite) other.disableInteractive();
        }


        // if (sprite.tipo == "cerca") {
        sprite.isMoving = true;
        this.scene.gameVariables.freeClick = true;
        sprite.setDepth(2000);
        // }

        this.gridUtils.drawFootprints();


    }

    destroySprite(sprite) {

        sprite.isMoving = false;
        this.scene.gameVariables.buyItemTmp = null;
        sprite.destroy();

        this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
            (s) => s && s !== sprite && !s.destroyed
        );

        this.controllers.gridUtils.recalculateDepthAround(sprite);
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

        this.controllers.gridUtils.drawFootprints();
    }
}
