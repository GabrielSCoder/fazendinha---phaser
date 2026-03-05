export default class GameEventsController {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;
    }

    colocarCercasCheck() {
        if (
            this.scene.gameVariables.selectedSprite?.tipo === "cerca" &&
            this.scene.gameVariables.fenceSnapTarget &&
            this.scene.gameVariables.collisionDataTemp
        ) {
            const sprite = this.scene.gameVariables.selectedSprite;

            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            sprite.gridX = Math.round(iso.x);
            sprite.gridY = Math.round(iso.y);

            this.gridUtils.clearOccupied(sprite);
            this.gridUtils.markOccupied(sprite, startX, startY, w, h);
            sprite.setAlpha(1);

            sprite.lastFreePos = { startX, startY };

            sprite.clearTint();
            sprite.isMoving = false;
            this.gridUtils.recalculateDepthAround(sprite);
            this.scene.gameVariables.selectedSprite = null;
            this.gridUtils.drawFootprints();

            this.scene.acoesUtils.ativarInteratividadeItens();

            if (this.scene.gameVariables.buyItemTmp) {
                console.log(this.scene.gameVariables.buyItemTmp);
                this.scene.events.emit("itemPurchased", this.scene.gameVariables.buyItemTmp);
            }
        }
    }

    abrirLojaCheck() {
        if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.planting) {
            const sprite = this.scene.gameVariables.selectedSeed;
            sprite.destroy();

            this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
                (s) => s && s !== sprite && !s.destroyed
            );

            this.scene.gameVariables.selectedSeed = null;

            this.scene.gameVariables.sprites.forEach((s) => {
                if (s && !s.destroyed) {
                    s.setInteractive({
                        pixelPerfect: true,
                        alphaTolerance: 1,
                        useHandCursor: true,
                    });
                }
            });
        } else if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.selling) {
            this.scene.acoesUtils.stopSell();
        } else if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.arando) {
            this.scene.acoesUtils.cancelArar();
        }

        if (
            this.scene.shopMenu.isOpen() &&
            this.scene.gameVariables.selectedSprite &&
            this.scene.gameVariables.selectedSprite.isMoving
        ) {
            const sprite = this.scene.gameVariables.selectedSprite;

            let willDestroy = !sprite.originalPosition;

            if (!willDestroy) {
                sprite.x = sprite.originalPosition.x;
                sprite.y = sprite.originalPosition.y;
                sprite.setAlpha(1.0);
                sprite.clearTint();
            } else {
                this.scene.gameVariables.buyItemTmp = null;
                sprite.destroy();

                this.scene.gameVariables.sprites = this.scene.gameVariables.sprites.filter(
                    (s) => s && s !== sprite && !s.destroyed
                );
            }

            this.gridUtils.recalculateDepthAround(sprite);
            this.scene.gameVariables.selectedSprite = null;

            if (!willDestroy) sprite.isMoving = false;

            this.scene.gameVariables.sprites.forEach((s) => {
                if (s && !s.destroyed) {
                    s.setInteractive({
                        pixelPerfect: true,
                        alphaTolerance: 1,
                        useHandCursor: true,
                    });
                }
            });

            this.gridUtils.drawFootprints();
        }
    }

    fixarObjetoCheck() {
        if (
            this.scene.gameVariables.fenceSnapTarget &&
            this.scene.gameVariables.collisionDataTemp
        ) {
            this.scene.gameVariables.fenceSnapTarget = null;
            this.scene.gameVariables.collisionDataTemp = null;
            return;
        }

        const resp = this.scene.acoesUtils.breakConditions();
        if (!resp) return;

        const sprite = this.scene.gameVariables.selectedSprite;

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));
        const endX = startX + w - 1;
        const endY = startY + h - 1;

        const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, endX, endY, sprite);

        if (ocupado) {
            console.log("❌ Tile ocupado — revertendo sprite.");
            return;
        }

        sprite.gridX = Math.round(iso.x);
        sprite.gridY = Math.round(iso.y);

        this.gridUtils.clearOccupied(sprite);
        this.gridUtils.markOccupied(sprite, startX, startY, w, h);

        sprite.lastFreePos = { startX, startY };

        sprite.clearTint();
        sprite.setAlpha(1);
        sprite.isMoving = false;
        this.gridUtils.recalculateDepthAround(sprite);

        if (sprite.tipo === "cerca") this.gridUtils.ReOccupiedFences();

        this.scene.gameVariables.selectedSprite = null;
        this.gridUtils.drawFootprints();

        this.scene.acoesUtils.ativarInteratividadeItens();
        this.uiEvents.emit('ui:setButtonState', 'vender', true);
        this.uiEvents.emit('ui:setButtonState', 'arar', true);

        if (this.scene.gameVariables.buyItemTmp) {
            console.log(this.scene.gameVariables.buyItemTmp);
            this.scene.events.emit("itemPurchased", this.scene.gameVariables.buyItemTmp);
        }
    }

    plantarSementeCheck(solo, done) {
        if (!this.scene.gameVariables.planting) return done();
        if (!this.scene.gameVariables.selectedSeed) return done();

        const startX = solo.x - 100 / 2;
        const startY = solo.y - solo.displayHeight / 2;

        if (!this.scene.gameVariables.plantingBar)
            this.scene.acoesUtils.criarBarraProgresso(startX, startY, 50, 10, 1.8, () => {
                this.scene.acoesUtils.plantarSemente(solo);
                this.scene.acoesUtils.setHoverEnabled(true);
                done()
            });
    }

    markI(solo, done) {

        const startX = solo.x - 100 / 2;
        const startY = solo.y - solo.displayHeight / 2;

        this.scene.acoesUtils.criarBarraProgresso(startX, startY, 50, 10, 1.8, () => {
            solo.setAlpha(0.7)
            solo.isQueued = false;
            done();
        })
    }


    ararSoloCheck(pointer, done) {
        if (!this.scene.gameVariables.arando) return;

        if (this.scene.gameVariables.freeClick) {
            this.scene.gameVariables.freeClick = false;
            return done();
        }

        if (this.scene.gameVariables.changeCameraZoom) return;
        if (this.scene.gameVariables.middleButtonDown) return;

        this.scene.acoesUtils.ararSolo(done);
    }

    controleSolo() {
        if (!this.scene.gameVariables.arando) return;
        if (!this.scene.gameVariables.previewOccupiedtiles?.length) return;
        if (this.scene.queue.isFull()) return;

        const reserva = this.scene.acoesUtils.criarReservaSolo();

        if (!reserva) return;

        reserva.sprite.setAlpha(0.4);

        this.scene.queue.add({
            sprite: reserva.sprite,
            action: (done) => {
                reserva.sprite.setAlpha(0.7);
                this.scene.acoesUtils.executarArarSolo(reserva, done);
            }}
        )
    }

    controleSolo2() {

        if (!this.scene.gameVariables.arando) return;
        const preview = this.scene.gameVariables.previewOccupiedtiles;
        if (!preview || preview.length === 0) return;

        const validTiles = preview.filter(tile => !tile.occupied);

        if (validTiles.length === 0) {
            console.log("⚠ nenhum tile livre");
            return;
        }

        const reservedSprites = [];

        for (const tile of validTiles) {

            const sprite = this.scene.acoesUtils.criarReservaSolo2(tile);

            if (sprite) {
                reservedSprites.push(sprite);
            }
        }

        if (reservedSprites.length === 0) return;

        const center = reservedSprites[0];

        this.scene.acoesUtils.criarBarraProgresso(
            center.x,
            center.y,
            50,
            10,
            1.8,
            () => {


                reservedSprites.forEach(sprite => {
                    console.log(sprite);
                    sprite.setAlpha(1.0);
                    sprite.isReserved = false;
                });

            }
        );
    }



    constrolePlantar() {
        const solo = this.scene.gameVariables.selectedSprite;

        if (this.scene.queue.isFull()) return;

        if (!solo) return;

        if (solo.nome !== "solo_preparado") return;

        if (solo.isQueued) return;
        if (solo.isReserved) return;

        solo.isQueued = true;

        solo.setAlpha(0.7);
        solo.disableInteractive();

        this.scene.queue.add({
            sprite: solo,
            action: (done) => {
                this.plantarSementeCheck(solo, done);
            }
        });
    }
}
