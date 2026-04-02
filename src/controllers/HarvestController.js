export default class HarvestController {

    constructor(scene, control = {}) {
        this.scene = scene;
        this.uiEvents = control.uiEvents;
        this.controllers = scene.controllers;
    }

    tryHarvest(sprite) {

        if (!sprite.harvestReady) return;
        if (this.controllers.queue.isFull()) return;

        sprite.setAlpha(0.7);
        sprite.disableInteractive();
        sprite.clearTint();
        this.scene.gameVariables.hoveredSprite = null;
        this.controllers.sprite.hoverText.setVisible(false);

        let bar = null

        this.controllers.queue.add({

            action: (done) => {

                bar = this.controllers.bar.criarBarraProgresso(
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

                sprite.setAlpha(1);
                sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

            }
        });
    }


    harvestPlant(sprite) {

        if (sprite.harvestTime == undefined) return;

        const sprite_nome = sprite.nome;
        sprite.harvestTime += 1;
        const preco_venda = sprite.preco_venda;
        const xp = sprite.xp;

        const confirm = this.controllers.soil.clearSoil(sprite);

        if (confirm) {
            this.uiEvents.emit("action:reward", {
                xp: xp ?? 0,
                gold: preco_venda ?? 0,
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
}