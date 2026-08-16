export default class GameEventsController {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;
        this.creativeMode = scene.gameVariables.creativeMode;
        this.noExperienceMode = scene.gameVariables.noExperienceMode;
        this.staticMode = scene.gameVariables.staticMode;
        this.noEnergyNeed = scene.gameVariables.noEnergyConsumption;
    }

    init() {
        this.uiEvents.on("action:reward", (data) => {

            if (this.creativeMode) return;

            if (data.xp) {
                if (this.noExperienceMode) return;
                this.uiEvents.emit("action:addXP", data.xp);
            }

            if (data.gold) {
                this.uiEvents.emit("action:setGold", data.gold);
            }

            if (data.money) {
                this.uiEvents.emit("action:setMoney", data.money);
            }

            if (data.energy) {
                if (this.noEnergyNeed) {
                    if (data.energy.amount > 0) {
                        this.uiEvents.emit("energy:changeEnergy", data.energy)
                    } else {
                        data.energy = null;
                    }
                } else {
                    this.uiEvents.emit("energy:changeEnergy", data.energy)
                }
            }

            if (data.id) {
                this.receberItem(data);
            }

            this.uiEvents.emit("floating:rewards", data);

        });

        this.uiEvents.on("action:expand", (data) => {
            //console.log("-----")
            this.checkMonetaryItem(data);
        })

        this.uiEvents.on("action:buyConsumible", (data) => {
            this.checkMonetaryItem(data)
        })
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

            const resolved = this.checkMonetaryItem(sprite);

            if (!resolved) return;

            this.fixObject({ sprite, iso, w, h, startX, startY });
        }
    }

    abrirLojaCheck() {
        if (this.controllers.shopMenu.isOpen() && this.scene.gameVariables.planting) {
            this.uiEvents.emit("action:StopSeeding");
        } else if (this.controllers.shopMenu.isOpen() && this.scene.gameVariables.selling) {
            this.uiEvents.emit("action:StopSelling");
        } else if (this.controllers.shopMenu.isOpen() && this.scene.gameVariables.plowing) {
            this.uiEvents.emit("action:StopPlowing")
        }

        if (
            this.controllers.shopMenu.isOpen() &&
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

    checkMonetaryItem(sprite) {


        if (sprite.xp && !sprite.xpYeld && !sprite.gift) {

            let res = false;

            const tipo_compra = sprite.preco_compra > sprite.preco_compra_grana || !sprite.preco_compra_grana ? "gold" : "money"

            const isExpansion = sprite.tipo == "expansão" ? true : false
            const isConsumible = sprite.tipo == "consumivel" ? true : false;

            if (isConsumible) { sprite.x = 0; sprite.y = 0; }

            this.uiEvents.emit("action:buyItem", {
                type: tipo_compra,
                price: tipo_compra == "gold" ? sprite.preco_compra : sprite.preco_compra_grana,
                level: 1
            }, (result) => {

                if (!result) {
                    res = false;
                    return false;
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

                if (!isExpansion && !isConsumible) {
                    this.uiEvents.emit("place", { target: sprite.tipo, nome: sprite.nome.toLowerCase() });
                    sprite.xpYeld = true;
                } else if (isConsumible) {
                    console.log("chegando aqui")
                    if (sprite.subtipo && sprite.subtipo == "energia") {
                        this.uiEvents.emit("energy:changeEnergy", { amount: sprite.energy_yeld })
                    }
                } else {
                    this.uiEvents.emit("expand", sprite);
                }
                res = true
            });

            if (!res) {

                this.uiEvents.emit("ui:notify", { type: "" });
                this.scene.gameVariables.freeClick = true;
                const sprite = this.scene.gameVariables.selectedSprite;

                this.controllers.spriteUtils.destroySprite(sprite);

                return false;
            }
        }

        return true;
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

        const resp = this.controllers.acoesUtils.breakConditions();
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
            //console.log("❌ Tile ocupado — revertendo sprite.");
            return;
        }

        const resolved = this.checkMonetaryItem(sprite);

        if (!resolved) return;

        this.fixObject({ sprite, iso, w, h, startX, startY });
    }

    fixObject(data) {

        const { sprite, iso, w, h, startX, startY } = data

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

            if (sprite.stages && !sprite.harvestReady && !sprite.growthStart && !this.staticMode) {

                let plantCalc = this.scene.gameVariables.fastHarvestMode ? this.scene.gameVariables.debugHaverstTime : sprite.tempoColheita;

                plantCalc = plantCalc * 60 * 1000;

                sprite.duration = plantCalc;

                this.controllers.growth.startGrowth(sprite, plantCalc, sprite.stages);
            }
        }

        if (!sprite.uuid) {
            sprite.uuid = crypto.randomUUID();
        }

        this.scene.gameVariables.selectedSprite = null;

        this.uiEvents.emit("move", { target: sprite.tipo, sprite: sprite });

        if (this.scene.gameVariables.buyItemTmp) {
            this.scene.events.emit("itemPurchased", this.scene.gameVariables.buyItemTmp);
        }
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

        if (this.scene.gameVariables.freeClick) {
            this.scene.gameVariables.freeClick = false;
            return;
        }

        if (!this.scene.gameVariables.previewOccupiedtiles?.length) return;
        if (this.controllers.queue.isFull()) return;

        const hasVehicle =
            !!this.scene.gameVariables.vehicleSelected;

        let haveEnergy = true

        if (hasVehicle && this.controllers.energy.getEnergy() < 1) haveEnergy = false;

        const resp = this.canPlow();

        const reserva =
            this.controllers.soil.createReserveSoil();

        if (!reserva?.length) return;

        if (!resp || !haveEnergy) {

            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("action:StopPlowing");

            this.controllers.soil.cancelReserve(reserva);

            this.uiEvents.emit("ui:notify", {
                type: "",
                text: !haveEnergy ? "Sem energia suficiente" : null
            });

            return;
        }

        let validReserva = reserva;

        if (
            this.scene.gameVariables.actionTileX != 1 ||
            this.scene.gameVariables.actionTileY != 1
        ) {

            const maxTiles =
                this.controllers.soil.getAffordableTiles();

            if (!maxTiles) {

                this.controllers.soil.cancelReserve(reserva);
                return;
            }

            validReserva =
                reserva.slice(0, maxTiles);

            const restReserva =
                reserva.slice(maxTiles);

            this.controllers.soil.cancelReserve(restReserva);
        }

        if (hasVehicle) {

            const maxEnergyTiles =
                this.getAffordableEnergyTiles(
                    validReserva
                );

            if (!maxEnergyTiles) {

                this.controllers.soil.cancelReserve(
                    validReserva
                );

                return;
            }

            if (maxEnergyTiles < validReserva.length) {

                const energyRest =
                    validReserva.slice(maxEnergyTiles);

                validReserva =
                    validReserva.slice(0, maxEnergyTiles);

                this.controllers.soil.cancelReserve(
                    energyRest
                );
            }
        }


        validReserva.forEach(tile => {
            tile.sprite.setAlpha(0.4);
        });

        let progressBar = null;

        this.controllers.queue.add({

            action: (done) => {

                progressBar =
                    this.controllers.soil.executePlowingSoil(
                        validReserva,
                        () => {
                            done();
                        }
                    );
            },

            onCancel: () => {

                if (progressBar) {
                    progressBar.cancel();
                    progressBar = null;
                }

                this.controllers.soil.cancelReserve(reserva);
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

    getAffordablePlantTiles(amount, price) {

        if (!price || price <= 0)
            return amount;

        const gold =
            this.controllers.profile.getGold();

        return Math.min(
            amount,
            Math.floor(gold / price)
        );
    }

    controlePlantar() {

        if (!this.scene.gameVariables.planting)
            return;

        if (!this.scene.gameVariables.selectedSeed)
            return;

        if (this.scene.gameVariables.selling)
            return;

        if (this.controllers.queue.isFull())
            return;

        const reserva =
            this.controllers.plant.createReservePlantSoil();

        if (!reserva.length)
            return;

        const hasVehicle =
            !!this.scene.gameVariables.vehicleSelected;

        let haveEnergy = true

        if (hasVehicle && this.controllers.energy.getEnergy() < this.scene.gameVariables.energySeedCost) haveEnergy = false;

        this.scene.gameVariables.plantingReservedSoils = reserva;

        const seed =
            this.scene.gameVariables.selectedSeed;

        const price = seed.preco_compra;

        const canPlant = this.controllers.plant.canAffordOneSeed(price);

        if (!canPlant || !haveEnergy) {
            this.uiEvents.emit("action:StopSeeding")
            this.uiEvents.emit("queue:cancelAll");
            this.controllers.plant.cancelReserve(reserva);
            this.uiEvents.emit("ui:notify", {
                type: "",
                text: !haveEnergy ? "Sem energia suficiente" : null
            });

            return;
        }

        const maxTiles =
            this.getAffordablePlantTiles(
                reserva.length,
                price
            );

        if (maxTiles <= 0) {

            this.controllers.plant.cancelReserve(reserva);
            this.uiEvents.emit("action:StopSeeding")

            this.uiEvents.emit("queue:cancelAll");
            this.uiEvents.emit("ui:notify", {
                type: ""
            });


            return;
        }

        const validReserva =
            reserva.slice(0, maxTiles);

        const restReserva =
            reserva.slice(maxTiles);

        this.controllers.plant.cancelReserve(restReserva);

        if (hasVehicle) {

            const maxEnergyTiles =
                this.getAffordableEnergyTiles(
                    validReserva
                );

            console.log(maxEnergyTiles)

            if (!maxEnergyTiles) {

                this.controllers.soil.cancelReserve(
                    validReserva
                );

                return;
            }

            if (maxEnergyTiles < validReserva.length) {

                const energyRest =
                    validReserva.slice(maxEnergyTiles);

                validReserva =
                    validReserva.slice(0, maxEnergyTiles);

                this.controllers.soil.cancelReserve(
                    energyRest
                );
            }
        }

        validReserva.forEach(solo => {

            solo.isQueued = true;
            solo.cancelled = false;
            solo.hoverEnabled = false;

            solo.setAlpha(0.4);
            solo.clearTint();
            solo.disableInteractive();
        });

        let progressBar = null;

        this.controllers.queue.add({

            action: (done) => {

                const first = validReserva[0];

                progressBar =
                    this.controllers.bar.criarBarraProgresso(

                        first.x - 25,
                        first.y - first.displayHeight / 2,
                        50,
                        10,
                        0.5,

                        () => {

                            validReserva.forEach(solo => {

                                if (!solo)
                                    return;

                                if (solo.cancelled)
                                    return;

                                if (!solo.isQueued)
                                    return;

                                this.uiEvents.emit(
                                    "action:Seed",
                                    solo
                                );

                                solo.isQueued = false;
                                solo.isReserved = false;
                            });

                            done();
                        }
                    );
            },

            onCancel: () => {

                if (progressBar) {

                    progressBar.cancel();
                    progressBar = null;
                }

                validReserva.forEach(solo => {

                    if (!solo)
                        return;

                    solo.isReserved = false;
                    solo.isQueued = false;
                    solo.cancelled = true;

                    solo.clearTint();
                    solo.setAlpha(1);

                    solo.setInteractive({
                        useHandCursor: true
                    });
                });

                this.controllers.plant.cancelReserve(
                    validReserva
                );
            }
        });
    }

    receberItem(data) {

        if (!data) return;
        if (this.scene.gameVariables.selectedSprite && this.scene.gameVariables.selectedSprite.isMoving) return;
        const itemData = this.controllers.catalog.findItem(data);

        if (!itemData) return;
        itemData.gift = true;

        this.uiEvents.emit("data:addItemStorage", itemData);

        this.uiEvents.emit("ui:notify", { type: "item", data: itemData, amount: 1 });
    }

    getAffordableEnergyTiles(reserva) {

        if (!reserva?.length)
            return 0;

        let energy = this.controllers.energy.getEnergy();

        let count = 0;

        console.log(reserva[0])

        for (const tile of reserva) {

            let cost = 0;

            if (tile.action === "plow") {

                cost =
                    this.scene.gameVariables.energyPlowCost;

            } else if (tile.action === "renew") {

                cost =
                    this.scene.gameVariables.energyRenewSoilCost;
            } else if (tile.action === "seed") {
                cost =
                    this.scene.gameVariables.energySeedCost;
            }

            if (cost <= 0)
                continue;

            if (energy < cost)
                break;

            energy -= cost;
            count++;
        }

        return count;
    }

}
