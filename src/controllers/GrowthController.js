export default class GrowthController {

    constructor(scene) {

        this.scene = scene;
        this.controllers = scene.controllers;
        this.growingSprites = scene.gameVariables.growingSprites;
    }

    start() {


        this.updateStages();

        this.scene.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => this.updateStages()
        });

    }

    startGrowth(sprite, duration, stages = []) {

        sprite.growthStart = Date.now();
        sprite.growthDuration = duration;
        sprite.growthEnd = sprite.growthStart + duration;

        sprite.growthStageIndex = 0;
        sprite.growthStages = stages;

        sprite.harvestReady = false;

        this.growingSprites.push(sprite);
    }

    getGrowthPercent(sprite) {

        if (!sprite.growthStart) return 0;

        const now = Date.now();

        const elapsed = now - sprite.growthStart;

        return Phaser.Math.Clamp(elapsed / sprite.growthDuration, 0, 1);
    }

    updateStages() {

        const now = Date.now();

        this.growingSprites.forEach(sprite => {

            if (!sprite.growthStages) return;

            const elapsed = now - sprite.growthStart;
            const percent = Phaser.Math.Clamp(elapsed / sprite.growthDuration, 0, 1);

            if (percent >= 1) {

                if (!sprite.harvestReady) {

                    sprite.harvestReady = true;

                    const lastStage = sprite.growthStages[sprite.growthStages.length - 1];

                    if (lastStage?.texture) {
                        sprite.setTexture(lastStage.texture);
                        if (lastStage?.origem) {
                            sprite.setOrigin(...lastStage.origem);
                        }
                    }
                }

                return;
            }

            const nextStage = sprite.growthStages[sprite.growthStageIndex];

            if (!nextStage) return;

            if (percent >= nextStage.percent) {

                if (nextStage.texture) {
                    sprite.setTexture(nextStage.texture);

                    if (nextStage?.origem) {
                        sprite.setOrigin(...nextStage.origem);
                    }
                }

                sprite.growthStageIndex++;
            }

        });
    }

    cancelGrowth(sprite) {

        sprite.growthTimer?.remove();

        this.growingSprites = this.growingSprites.filter(s => s !== sprite);

    }

}