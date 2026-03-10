export default class HarvestController {

    constructor(scene) {
        this.scene = scene;
    }

    tryHarvest(sprite) {

        if (!sprite.harvestReady) return;

        sprite.setAlpha(0.7);
        sprite.disableInteractive();
        sprite.clearTint();
        this.scene.gameVariables.hoveredSprite = null;
        this.scene.hoverText.setVisible(false);

        this.scene.queue.add({

            action: (done) => {

                this.scene.barController.criarBarraProgresso(
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

            }

        });

    }


    harvestPlant(sprite) {

        if (sprite.harvestTime == undefined) return;
        // const semente = sprite.sementeData;

        // this.scene.inventory.add(semente.planta_colheita);

        // this.scene.player.addXP(semente.xp);

        // sprite.destroy();
        sprite.harvestTime += 1;

        this.scene.soilControl.clearSoil(sprite);

    }

    harvestRenewable(sprite) {

        const data = sprite;

        sprite.harvestReady = false;

        this.scene.growthController.startGrowth(
            sprite,
            sprite.growthDuration,
            data.stages
        );

        sprite.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

    }
}