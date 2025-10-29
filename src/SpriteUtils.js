export default class SpriteUtils {
    
    constructor(scene) {
        this.scene = scene;
    }

    addGameSprite(key, x, y, scale = 0.5, originX, originY) {
        const sprite = this.scene.add.sprite(x, y, key).setScale(scale).setInteractive({
            pixelPerfect: true,
            alphaTolerance: 1,
            useHandCursor: true
        }).setOrigin(originX, originY);

        sprite.isMoving = false;
        sprite.isDraggable = true;

        this.scene.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });

        this.scene.sprites.push(sprite);

        this.scene.input.setDraggable(sprite);

        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (this.middleButtonDown) return;

            if (!sprite.isMoving) {
                this.scene.selectedSprite = sprite;
                this.scene.itemMenuUI.show(this.scene.selectedSprite.x, this.scene.selectedSprite.y, this.scene.selectedSprite);
            }
        });

        sprite.on("pointerover", () => {
            sprite.setTint(0xffff00);
        })

        sprite.on("pointerout", () => {
            sprite.clearTint()
        })

        return sprite;
    }
}