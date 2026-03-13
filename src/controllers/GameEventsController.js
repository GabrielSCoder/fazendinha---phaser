export default class GameEventsController {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;

        this.uiEvents.on("action:reward", (data) => {

            if (data.xp) {
                this.uiEvents.emit("action:addXP", data.xp);
            }

            if (data.gold) {
                this.uiEvents.emit("action:setGold", data.gold);
            }

            if (data.money) {
                this.uiEvents.emit("action:setMoney", data.money);
            }

            this.uiEvents.emit("floating:rewards", data);

        });
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

            if (sprite.xp && !sprite.xpYeld) {

                let res = false;

                const tipo_compra = sprite.preco_compra > sprite.preco_compra_grana || !sprite.preco_compra_grana ? "gold" : "money"

                this.uiEvents.emit("action:buyItem", {
                    type: tipo_compra,
                    price: tipo_compra == "gold" ? sprite.preco_compra : sprite.preco_compra_grana,
                    level: 1
                }, (result) => {

                    if (!result) {
                        res = false;
                        return;
                    }

                    let dados = {}

                    if (tipo_compra == "gold") {

                        dados = {
                            xp: sprite.xp ?? 0,
                            gold: -sprite.preco_compra,
                            x: sprite.x,
                            y: sprite.y
                        }
                    } else {
                        dados = {
                            xp: sprite.xp ?? 0,
                            money: -sprite.preco_compra_grana,
                            x: sprite.x,
                            y: sprite.y
                        }
                    }

                    this.uiEvents.emit("action:reward", dados);

                    sprite.xpYeld = true;
                    res = true
                });

                if (!res) {

                    this.uiEvents.emit("ui:notify", { type: "" });
                    this.scene.gameVariables.freeClick = true;
                    const sprite = this.scene.gameVariables.selectedSprite;

                    this.scene.spriteUtils.destroySprite(sprite);

                    return;
                }

            }

            this.gridUtils.clearOccupied(sprite);
            this.gridUtils.markOccupied(sprite, startX, startY, w, h);
            sprite.setAlpha(1);

            sprite.lastFreePos = { startX, startY };

            sprite.clearTint();
            sprite.isMoving = false;
            this.gridUtils.recalculateDepthAround(sprite);
            this.scene.gameVariables.selectedSprite = null;
            this.gridUtils.drawFootprints();

            this.uiEvents.emit("interact:ActivateAll");

            if (this.scene.gameVariables.buyItemTmp) {
                // console.log(this.scene.gameVariables.buyItemTmp);
                this.scene.events.emit("itemPurchased", this.scene.gameVariables.buyItemTmp);
            }
        }
    }

    abrirLojaCheck() {
        if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.planting) {
            const sprite = this.scene.gameVariables.selectedSeed;

            if (sprite)
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

            this.scene.gameVariables.planting = false;

        } else if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.selling) {
            this.scene.acoesUtils.stopSell();
        } else if (this.scene.shopMenu.isOpen() && this.scene.gameVariables.plowing) {
            this.uiEvents.emit("action:StopPlowing")
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

        if (sprite.xp && !sprite.xpYeld) {

            let res = false;

            const tipo_compra = sprite.preco_compra > sprite.preco_compra_grana || !sprite.preco_compra_grana ? "gold" : "money"

            this.uiEvents.emit("action:buyItem", {
                type: tipo_compra,
                price: tipo_compra == "gold" ? sprite.preco_compra : sprite.preco_compra_grana,
                level: 1
            }, (result) => {

                if (!result) {
                    res = false;
                    return;
                }

                let dados = {}

                if (tipo_compra == "gold") {

                    dados = {
                        xp: sprite.xp ?? 0,
                        gold: -sprite.preco_compra,
                        x: sprite.x,
                        y: sprite.y
                    }
                } else {
                    dados = {
                        xp: sprite.xp ?? 0,
                        money: -sprite.preco_compra_grana,
                        x: sprite.x,
                        y: sprite.y
                    }
                }

                this.uiEvents.emit("action:reward", dados);

                sprite.xpYeld = true;
                res = true
            });

            if (!res) {

                this.uiEvents.emit("ui:notify", { type: "" });
                this.scene.gameVariables.freeClick = true;
                const sprite = this.scene.gameVariables.selectedSprite;

                this.scene.spriteUtils.destroySprite(sprite);

                return;
            }

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

        this.uiEvents.emit("interact:ActivateAll");
        this.uiEvents.emit('ui:setButtonState', 'vender', true);
        this.uiEvents.emit('ui:setButtonState', 'arar', true);

        if (sprite.tipo == "arvore" || sprite.tipo == "animal") {

            if (!sprite.harvestReady && !sprite.growthStart) {

                const stages = [
                    { percent: 1, texture: sprite.texture.key }
                ];

                this.scene.growthController.startGrowth(sprite, sprite.tempoColheita * 60 * 1000, stages)
            }
        }

        if (this.scene.gameVariables.buyItemTmp) {
            this.scene.events.emit("itemPurchased", this.scene.gameVariables.buyItemTmp);
        }
    }

    plantarSementeCheck(solo, done) {

        const token = this.scene.queue.cancelToken;

        if (solo.cancelled) return done();
        if (token !== this.scene.queue.cancelToken) return done();

        if (!this.scene.gameVariables.planting) return done();
        if (!this.scene.gameVariables.selectedSeed) return done();

        const price = this.scene.gameVariables.selectedSeed.preco_compra;
        let HaveMoney = false;

        this.uiEvents.emit("action:buyItem", {
            type: "gold",
            price: price,
            level: 1
        }, (result) => {
            HaveMoney = result;
        })

        if (!HaveMoney) {
            this.uiEvents.emit("action:StopSeeding")
            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("ui:notify", { type: "" });
            return done();
        }


        const startX = solo.x - 100 / 2;
        const startY = solo.y - solo.displayHeight / 2;

        if (solo.progressBar) return;
        solo.progressBar = this.scene.barController.criarBarraProgresso(
            startX,
            startY,
            50,
            10,
            1.8,
            () => {

                if (solo.cancelled) return;
                if (token !== this.scene.queue.cancelToken) return;

                this.uiEvents.emit("action:Seed", solo);

                solo.progressBar = null;

                done();
            }
        );
    }

    ararSoloCheck(pointer, done) {
        if (!this.scene.gameVariables.plowing) return;

        if (this.scene.gameVariables.freeClick) {
            this.scene.gameVariables.freeClick = false;
            return done();
        }

        if (this.scene.gameVariables.changeCameraZoom) return;
        if (this.scene.gameVariables.middleButtonDown) return;

        this.scene.acoesUtils.ararSolo(done);
    }

    controleSolo() {

        if (!this.scene.gameVariables.plowing) return;
        if (!this.scene.gameVariables.previewOccupiedtiles?.length) return;
        if (this.scene.queue.isFull()) return;

        const resp = this.canPlow();

        const reserva = this.scene.soilControl.createReserveSoil();
        if (!reserva?.length) return;

        if (!resp) {
            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("action:StopPlowing");
            this.scene.soilControl.cancelReserve(reserva);
            this.uiEvents.emit("ui:notify", { type: "" });
            return;
        }

        let validReserva = reserva;

        if (this.scene.gameVariables.actionTileX != 1 || this.scene.gameVariables.actionTileY != 1) {
            const maxTiles = this.scene.soilControl.getAffordableTiles();

            if (!maxTiles) {
                this.scene.soilControl.cancelReserve(reserva);
                return;
            }

            validReserva = reserva.slice(0, maxTiles);
            const restReserva = reserva.slice(maxTiles);

            this.scene.soilControl.cancelReserve(restReserva);
        }

        validReserva.forEach(tile => {
            tile.sprite.setAlpha(0.4);
        });

        let progressBar = null;

        this.scene.queue.add({

            action: (done) => {

                progressBar = this.scene.soilControl.executePlowingSoil(validReserva, () => {

                    done();

                });

            },

            onCancel: () => {

                if (progressBar) {
                    progressBar.cancel();
                    progressBar = null;
                }

                this.scene.soilControl.cancelReserve(reserva);

            }

        });

    }

    canPlow() {

        const price = this.scene.gameVariables.plowingCost;

        let HaveMoney = false;

        this.uiEvents.emit("action:buyItem", {
            type: "gold",
            price: price,
            level: 1
        }, (result) => {
            HaveMoney = result;
        })

        if (!HaveMoney) {
            return false;
        }

        return true;
    }

    controlePlantar() {

        const solo = this.scene.gameVariables.selectedSprite;

        if (this.scene.queue.isFull()) return;

        if (!solo) return;

        if (solo.nome !== "solo_preparado") return;

        if (solo.isQueued) return;
        if (solo.isReserved) return;
        if (this.scene.gameVariables.selling) return;

        solo.isQueued = true;

        solo.setAlpha(0.7);
        solo.clearTint();
        solo.disableInteractive();
        solo.cancelled = false;
        solo.hoverEnabled = false;

        this.scene.queue.add({

            action: (done) => {
                this.plantarSementeCheck(solo, done);
            },

            onCancel: () => {

                solo.cancelled = true;

                if (solo.progressBar) {
                    solo.progressBar.cancel();
                    solo.progressBar = null;
                    this.scene.gameVariables.selectedSprite = null;
                }

                solo.clearTint();
                solo.setAlpha(1);
                solo.isQueued = false;
                solo.setInteractive({ useHandCursor: true });

            }

        });


    }
}
