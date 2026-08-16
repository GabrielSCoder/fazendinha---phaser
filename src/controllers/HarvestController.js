export default class HarvestController {

    constructor(scene, control = {}) {
        this.scene = scene;
        this.uiEvents = control.uiEvents;
        this.controllers = scene.controllers;
        this.gridUtils = scene.controllers.gridUtils;
    }

    init() {
        this.classEvents();
    }

    classEvents() {

        this.uiEvents.on("action:StartHarvesting", (data) => {
            this.startHarvestingGroup(data);
        })

        this.uiEvents.on("action:StopHarvesting", () => {
            this.stopHarvestingGroup();
        })
    }

    tryHarvest(sprite) {

        if (!sprite.harvestReady)
            return;

        if (this.controllers.queue.isFull())
            return;

        this.addHarvestToQueue(sprite);
    }

    harvestPlant(sprite) {

        if (sprite.harvestTime == undefined) return;

        const sprite_nome = sprite.nome;
        sprite.harvestTime += 1;
        const preco_venda = sprite.preco_colheita;
        const xp = sprite.xp;

        const confirm = this.controllers.soil.clearSoil(sprite);

        if (confirm) {
            this.uiEvents.emit("action:reward", {
                xp: xp ?? 0,
                gold: preco_venda ?? 0,
                energy: this.scene.gameVariables.vehicleSelected ? { action: "harvest", amount: -this.scene.gameVariables.energyHarvestCost } : null,
                x: sprite.x,
                y: sprite.y
            });
            this.uiEvents.emit("harvest", { target: "solo_plantado_simples", seed: sprite_nome.toLowerCase(), sprite: sprite });
        }

    }

    harvestRenewable(sprite) {

        const data = sprite;

        sprite.harvestReady = false;
        sprite.harvestTime += 1;

        sprite.setTexture(sprite.original_sprite);

        this.uiEvents.emit("action:reward", {
            xp: sprite.xp ?? 0,
            gold: sprite.preco_venda ?? 0,
            x: sprite.x,
            y: sprite.y
        });

        this.controllers.growth.startGrowth(
            sprite,
            sprite.growthDuration,
            data.stages
        );

        this.uiEvents.emit("harvest", { target: data.tipo, name: data.id, sprite: sprite });
        sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        sprite.setAlpha(1);
    }

    startHarvestingGroup(data) {

        if (this.scene.gameVariables.harvesting) return;
        if (this.scene.gameVariables.plowing) this.uiEvents.emit("action:StopPlowing");
        if (this.scene.gameVariables.planting) this.uiEvents.emit("action:StopSeeding");
        if (this.scene.gameVariables.selling) this.uiEvents.emit("action:StopSelling");

        this.uiEvents.emit("interact:DesativateAll");
        this.scene.gameVariables.harvesting = true;

        console.log(data)

        this.controllers.spriteUtils.addToolSprite(data, this.scene.scale / 2, this.scene.scale / 2, 0.2, 0.5, 0.5);
    }

    stopHarvestingGroup() {

        if (!this.scene.gameVariables.harvesting) return;

        this.controllers.acoesUtils.clearPreviewTiles();
        this.controllers.acoesUtils.clearPreviewOccupiedTiles();

        const tool = this.scene.gameVariables.toolSprite;

        if (tool) {
            this.controllers.spriteUtils.destroyToolSprite(tool);
        }

        this.scene.gameVariables.selectedSprite = null;

        this.scene.gameVariables.harvesting = false;

        this.scene.gameVariables.changeActionSize(1, 1);

        this.uiEvents.emit("interact:ActivateAll");
    }

    updateHarvest(blocksWide = 1, blocksHigh = 1) {

        if (!this.scene.gameVariables.harvesting) return;

        if (this.scene.gameVariables.middleButtonDown) return;
        if (this.scene.gameVariables.activeBar) return;

        if (this.scene.gameVariables.selling) {
            this.controllers.sell.stopSelling();
        }

        if (this.scene.gameVariables.plowing) {
            this.uiEvents.emit("action:StopPlowing");
        }

        const tool = this.scene.gameVariables.toolSprite;
        const pointer = this.scene.input.activePointer;
        const cam = this.scene.cameras.main;
        const pointerOffset = blocksWide > 1 ? 2.7 : 1.3;

        if (tool) {
            tool.x = pointer.worldX;
            tool.y = pointer.worldY;
        }

        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.controllers.gridUtils.screenToIso(
            worldPoint.x,
            worldPoint.y
        );

        const startX = Math.floor(iso.x - pointerOffset);
        const startY = Math.floor(iso.y - pointerOffset);

        this.controllers.acoesUtils.clearPreviewTiles();

        const blockSize = 4;

        const totalWidth = blockSize * blocksWide;
        const totalHeight = blockSize * blocksHigh;

        const outerCornersIso = [
            { x: startX, y: startY },
            { x: startX + totalWidth, y: startY },
            { x: startX + totalWidth, y: startY + totalHeight },
            { x: startX, y: startY + totalHeight }
        ];

        const outerCornersScreen =
            outerCornersIso.map(c =>
                this.gridUtils.isoToScreen(c.x, c.y)
            );

        const outerPoints = [];

        for (const c of outerCornersScreen) {
            outerPoints.push(c.x, c.y);
        }

        this.scene.gameVariables.previewOccupiedtiles = [];

        for (let bx = 0; bx < blocksWide; bx++) {

            for (let by = 0; by < blocksHigh; by++) {

                const sx = startX + bx * blockSize;
                const sy = startY + by * blockSize;

                const soil = this.controllers.spriteUtils.findHarvestableSprite(
                    sx,
                    sy,
                    blockSize
                );

                const valid = !!soil;

                const fillColor = valid
                    ? 0x00aa00
                    : 0xaa0000;

                const borderColor = valid
                    ? 0x66ff66
                    : 0xff6666;

                const cornersIso = [
                    { x: sx, y: sy },
                    { x: sx + blockSize, y: sy },
                    { x: sx + blockSize, y: sy + blockSize },
                    { x: sx, y: sy + blockSize }
                ];

                const cornersScreen =
                    cornersIso.map(c =>
                        this.gridUtils.isoToScreen(c.x, c.y)
                    );

                const points = [];

                for (const c of cornersScreen) {
                    points.push(c.x, c.y);
                }

                const tile = this.scene.add
                    .polygon(
                        0,
                        0,
                        points,
                        fillColor,
                        0.35
                    )
                    .setStrokeStyle(
                        1,
                        borderColor,
                        0.9
                    )
                    .setOrigin(0, 0)
                    .setDepth(1999);

                this.scene.gameVariables.previewTiles.push(tile);

                this.controllers.camera.ignoreInUICamera([tile]);

                this.scene.gameVariables.previewOccupiedtiles.push({
                    x: sx,
                    y: sy,
                    w: blockSize,
                    h: blockSize,
                    occupied: !valid,
                    sprite: soil
                });
            }
        }

        const outerBorder = this.scene.add
            .polygon(
                0,
                0,
                outerPoints,
                0x000000,
                0
            )
            .setStrokeStyle(
                2,
                0xffffff,
                0.7
            )
            .setOrigin(0, 0);

        this.scene.gameVariables.previewTiles.push(
            outerBorder
        );

        this.controllers.camera.ignoreInUICamera([
            outerBorder
        ]);
    }

    harvestArea() {

        if (this.controllers.queue.isFull()) return;
        if (!this.scene.gameVariables.harvesting) return;

        const hasVehicle =
            !!this.scene.gameVariables.vehicleSelected;

        let haveEnergy = true

        if (hasVehicle && this.controllers.energy.getEnergy() < this.scene.gameVariables.energyHarvestCost) haveEnergy = false;

        if (!haveEnergy) {

            this.uiEvents.emit("queue:cancelAll");
            this.stopHarvestingGroup();

            this.uiEvents.emit("ui:notify", {
                type: "",
                text: "Sem energia suficiente"
            });

            return;
        }

        const tiles =
            this.scene.gameVariables.previewOccupiedtiles || [];

        const sprites = [
            ...new Set(
                tiles
                    .filter(tile =>
                        !tile.occupied &&
                        tile.sprite &&
                        !tile.sprite.destroyed &&
                        tile.sprite.harvestReady
                    )
                    .map(tile => tile.sprite)
            )
        ];

        if (!sprites.length)
            return;

        sprites.forEach(sprite => {

            sprite.setAlpha(0.7);
            sprite.disableInteractive();
            sprite.clearTint();
        });

        this.scene.gameVariables.hoveredSprite = null;
        this.controllers.sprite.hoverText.setVisible(false);

        let bar = null;

        this.controllers.queue.add({

            action: (done) => {

                const first = sprites[0];

                bar =
                    this.controllers.bar.criarBarraProgresso(
                        first.x,
                        first.y + 10,
                        50,
                        10,
                        0.5,
                        () => {

                            sprites.forEach(sprite => {

                                if (!sprite || sprite.destroyed)
                                    return;

                                if (!sprite.harvestReady)
                                    return;

                                if (sprite.regrow) {
                                    this.harvestRenewable(sprite);
                                } else {
                                    this.harvestPlant(sprite);
                                }
                            });

                            done();
                        }
                    );
            },

            onCancel: () => {

                if (bar) {
                    bar.cancel();
                    bar = null;
                }

                sprites.forEach(sprite => {

                    if (!sprite || sprite.destroyed)
                        return;

                    sprite.setAlpha(1);

                    sprite.setInteractive({
                        pixelPerfect: true,
                        alphaTolerance: 1,
                        useHandCursor: true
                    });
                });
            }
        });
    }

    addHarvestToQueue(sprite) {

        if (!sprite || sprite.destroyed)
            return;

        if (!sprite.harvestReady)
            return;

        if (sprite.regrow) {
            // caso você queira tratar renováveis depois
        }

        sprite.setAlpha(0.7);
        sprite.disableInteractive();
        sprite.clearTint();

        if (this.scene.gameVariables.hoveredSprite === sprite) {
            this.scene.gameVariables.hoveredSprite = null;
            this.controllers.sprite.hoverText.setVisible(false);
        }

        let bar = null;

        this.controllers.queue.add({

            action: (done) => {

                bar =
                    this.controllers.bar.criarBarraProgresso(
                        sprite.x,
                        sprite.y + 10,
                        50,
                        10,
                        0.5,
                        () => {

                            if (sprite.regrow) {
                                this.harvestRenewable(sprite);
                            } else {
                                this.harvestPlant(sprite);
                            }

                            done();
                        }
                    );
            },

            onCancel: () => {

                if (bar) {
                    bar.cancel();
                    bar = null;
                }

                if (!sprite.destroyed) {

                    sprite.setAlpha(1);

                    sprite.setInteractive({
                        pixelPerfect: true,
                        alphaTolerance: 1,
                        useHandCursor: true
                    });
                }
            }
        });
    }

    // tryHarvest(sprite) {

    //     if (!sprite.harvestReady) return;
    //     if (this.controllers.queue.isFull()) return;

    //     sprite.setAlpha(0.7);
    //     sprite.disableInteractive();
    //     sprite.clearTint();
    //     this.scene.gameVariables.hoveredSprite = null;
    //     this.controllers.sprite.hoverText.setVisible(false);

    //     let bar = null

    //     this.controllers.queue.add({

    //         action: (done) => {

    //             bar = this.controllers.bar.criarBarraProgresso(
    //                 sprite.x,
    //                 sprite.y + 10,
    //                 50,
    //                 10,
    //                 0.5,
    //                 () => {

    //                     if (sprite.regrow) {
    //                         this.harvestRenewable(sprite);
    //                     } else {
    //                         this.harvestPlant(sprite);
    //                     }

    //                     done();
    //                 }
    //             );
    //         },

    //         onCancel: () => {

    //             if (bar) {
    //                 bar.cancel();
    //                 bar = null;
    //             }

    //             sprite.setAlpha(1);
    //             sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

    //         }
    //     });
    // }
}