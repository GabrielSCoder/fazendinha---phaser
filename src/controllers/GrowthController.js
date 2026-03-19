export default class GrowthController {

    constructor(scene) {

        this.scene = scene;

        this.growingSprites = [];
        this.controllers = scene.controllers;

    }

    init() {
        this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.updateStages()
        });
    }

    startGrowth(sprite, duration, stages = []) {

        sprite.growthStart = this.scene.time.now;
        sprite.growthDuration = duration;
        sprite.growthEnd = sprite.growthStart + duration;

        sprite.growthStageIndex = 0;
        sprite.growthStages = stages;

        this.growingSprites.push(sprite);

        sprite.growthTimer = this.scene.time.delayedCall(duration, () => {

            sprite.harvestReady = true;

            const lastStage = stages[stages.length - 1];

            if (lastStage?.texture) {
                sprite.setTexture(lastStage.texture);
            }

        });

    }


    getGrowthPercent(sprite) {

        if (!sprite.growthStart) return 0;

        const now = this.scene.time.now;

        const elapsed = now - sprite.growthStart;

        return Phaser.Math.Clamp(elapsed / sprite.growthDuration, 0, 1);
    }

    updateStages() {

        const now = this.scene.time.now;

        this.growingSprites.forEach(sprite => {

            if (!sprite.growthStages) return;
            if (sprite.harvestReady) return;

            const percent = this.getGrowthPercent(sprite);

            const nextStage = sprite.growthStages[sprite.growthStageIndex];

            if (!nextStage) return;

            if (percent >= nextStage.percent) {

                if (nextStage.texture) {
                    sprite.setTexture(nextStage.texture);
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