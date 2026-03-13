export default class HarvestController {

    constructor(scene, control = {}) {
        this.scene = scene;
        this.uiEvents = control.uiEvents;
    }

    tryHarvest(sprite) {

        if (!sprite.harvestReady) return;
        if (this.scene.queue.isFull()) return;


        sprite.setAlpha(0.7);
        sprite.disableInteractive();
        sprite.clearTint();
        this.scene.gameVariables.hoveredSprite = null;
        this.scene.spriteController.hoverText.setVisible(false);

        let bar = null

        this.scene.queue.add({

            action: (done) => {

                bar = this.scene.barController.criarBarraProgresso(
                    sprite.x,
                    sprite.y + 10,
                    50,
                    10,
                    1.8,
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

        sprite.harvestTime += 1;
        const preco_venda = sprite.preco_venda;
        const xp = sprite.xp;

        const confirm = this.scene.soilControl.clearSoil(sprite);

        if (confirm) {
            this.uiEvents.emit("action:reward", {
                xp: xp ?? 0,
                gold: preco_venda ?? 0,
                x: sprite.x,
                y: sprite.y
            });
        }

    }

    harvestRenewable(sprite) {

        const data = sprite;

        sprite.harvestReady = false;

        this.uiEvents.emit("action:reward", {
            xp: sprite.xp ?? 0,
            gold: sprite.preco_venda ?? 0,
            x: sprite.x,
            y: sprite.y
        });

        this.scene.growthController.startGrowth(
            sprite,
            sprite.growthDuration,
            data.stages
        );

        sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        sprite.setAlpha(1);
    }
}