class HarvestController {

    constructor(scene) {
        this.scene = scene;
    }

    tryHarvest(sprite) {

        if (!sprite.harvestReady) return;

        if (sprite.tipo == "solo_plantado_simples") {
            this.harvestPlant(sprite);
        }

        else if (sprite.tipo == "arvore" || sprite.tipo == "animal") {
            this.harvestRenewable(sprite);
        }

    }

    harvestPlant(sprite) {

        const semente = sprite.sementeData;

        this.scene.inventory.add(semente.planta_colheita);

        // this.scene.player.addXP(semente.xp);

        sprite.destroy();

        this.scene.tileController.createPreparedSoil(
            sprite.x,
            sprite.y
        );
    }

    harvestRenewable(sprite) {

        const data = sprite;

        // this.scene.inventory.add(data.produz);

        sprite.harvestReady = false;

        this.scene.growthController.startGrowth(
            sprite,
            sprite.growthDuration,
            data.stages
        );

    }
}