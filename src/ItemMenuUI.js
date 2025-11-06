export default class ItemMenuUI {
    constructor(scene) {
        this.scene = scene;
        this.gridUtils = scene.gridUtils;

        this.itemMenu = scene.add.container(0, 0)
            .setDepth(2000)
            .setVisible(false);

        const bgx = scene.add.rectangle(0, 0, 80, 80, 0x000000, 0.7).setOrigin(0);
        bgx.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 40, 15);
        const btnRotate = this.createButton('Girar', 40, 65);

        this.itemMenu.add([bgx, btnMove, btnRotate]);

        this.selectedSprite = null;
        this.storedItemsContainer = scene.add.container(50, 50).setDepth(500);

        btnMove.on('pointerup', (pointer, localX, localY, event) => {
            this.onMoveClick(pointer, localX, localY, event);
        });

        btnRotate.on('pointerup', () => this.onRotateClick());

        scene.input.on('pointerup', (pointer, objs) => {
            if (!objs.length) this.hide();
        });

    }

    createButton(text, x, y) {
        const btn = this.scene.add.text(x, y, text, {
            fontSize: '14px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#333',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        return btn;
    }

    // === Controles de visibilidade ===
    show(x, y, sprite = null) {
        this.selectedSprite = sprite;
        this.itemMenu.setPosition(x, y);
        this.itemMenu.setVisible(true);
    }

    hide() {
        this.itemMenu.setVisible(false);
        this.selectedSprite = null;
    }

    isVisibile() {
        return this.itemMenu.visible
    }

    onMoveClick(pointer, localX, localY, event) {
        this.hide();
        event.stopPropagation();

        const sprite = this.scene.selectedSprite;
        if (!sprite) return;
        sprite.originalPosition = { x: sprite.x, y: sprite.y };
        sprite.setAlpha(0.7);
        sprite.isMoving = true;
        this.gridUtils.ReOccupiedFences();
        sprite.setDepth(300);

        for (let other of this.scene.sprites) {
            if (other !== sprite) other.disableInteractive();
        }

    }

    onRotateClick() {
        const sprite = this.scene.selectedSprite;
        if (!sprite || !sprite.footprint) return;
        this.hide();

        // Salva footprint original na primeira rotação
        if (!sprite.originalFootprint) {
            if (Array.isArray(sprite.footprint)) {
                sprite.originalFootprint = [...sprite.footprint];
            } else {
                const { w, h } = sprite.footprint;
                sprite.originalFootprint = [w, h];
            }
        }

        // Alterna entre girado e normal
        if (sprite.isRotated) {
            sprite.flipX = false;
            sprite.isRotated = false;
            sprite.footprint = [...sprite.originalFootprint];
        } else {
            sprite.flipX = true;
            sprite.isRotated = true;
            const [origW, origH] = sprite.originalFootprint;
            sprite.footprint = [origH, origW];
        }

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const [w, h] = sprite.footprint;
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        sprite.gridX = Math.round(iso.x);
        sprite.gridY = Math.round(iso.y);

        sprite.lastFreePos = { startX, startY };

        for (let other of this.scene.sprites) {
            if (other !== sprite) other.disableInteractive();
        }

        // const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
        sprite.isMoving = true;
        sprite.setDepth(2000);
        this.scene.selectedSprite = sprite;
        
        // if (ocupado) {
        //     console.log("❌ Tile ocupado — revertendo sprite.");
        //     return;
        // }

        // const snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + 0.5, Math.floor(iso.y) + 0.5);

        // sprite.x = snapped.x;
        // sprite.y = snapped.y + this.scene.gridSize * 0.12;

        // this.gridUtils.clearOccupied(sprite);
        // this.gridUtils.markOccupied(sprite, startX, startY, w, h);

        // sprite.lastFreePos = { startX, startY };
        // sprite.clearTint();
        // this.gridUtils.recalculateDepthAround(sprite);

        // for (let other of this.scene.sprites) {
        //     other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        // }

        // this.gridUtils.drawFootprints();
    }

}
