export default class ItemMenuUI {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;

        this.itemMenu = scene.add.container(0, 0)
            .setDepth(2000)
            .setVisible(false);

        const bgx = scene.add.rectangle(0, 0, 80, 80, 0x000000, 0.7).setOrigin(0);
        bgx.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 40, 15);
        const btnSell = this.createButton('Vender', 40, 40);
        const btnRotate = this.createButton('Girar', 40, 65);

        this.itemMenu.add([bgx, btnMove, btnSell, btnRotate]);

        this.selectedSprite = null;
        this.storedItemsContainer = scene.add.container(50, 50).setDepth(500);

        btnMove.on('pointerup', (pointer, localX, localY, event) => {
            this.onMoveClick(pointer, localX, localY, event);
        });

        btnSell.on("pointerup", () => {
            this.scene.gameVariables.selectedSpriteDelete = this.scene.gameVariables.selectedSprite;
            this.uiEvents.emit("ui:notify", {
                type: "sell", nome: this.scene.gameVariables.selectedSpriteDelete.nome,
                preco: this.scene.gameVariables.selectedSpriteDelete.preco_venda,
                action: "action:SellItemUI"
            });
        })

        btnRotate.on('pointerup', () => this.onRotateClick());

        scene.input.on('pointerup', (pointer, objs) => {
            if (!objs.length) this.hide();
        });

        this.gameEvents();
    }

    gameEvents() {
        this.uiEvents.on("ui:closeMenuSprite", () => {
            this.hide();
        })
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
        this.selectedSprite = null;
        this.itemMenu.setVisible(false);
    }


    isVisibile() {
        return this.itemMenu.visible
    }

    onMoveClick(pointer, localX, localY, event) {
        this.hide();
        event.stopPropagation();

        const sprite = this.scene.gameVariables.selectedSprite;
        if (!sprite) return;
        sprite.originalPosition = { x: sprite.x, y: sprite.y };
        sprite.setAlpha(0.7);
        sprite.isMoving = true;
        this.gridUtils.ReOccupiedFences();
        sprite.setDepth(300);

        for (let other of this.scene.gameVariables.sprites) {
            if (other !== sprite) other.disableInteractive();
        }
    }

    onRotateClick() {

        const sprite = this.scene.gameVariables.selectedSprite;
        if (!sprite || !sprite.footprint) return;
        this.hide();

        if (!sprite.originalFootprint) {
            if (Array.isArray(sprite.footprint)) {
                sprite.originalFootprint = [...sprite.footprint];
            } else {
                const { w, h } = sprite.footprint;
                sprite.originalFootprint = [w, h];
            }
        }

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

        for (let other of this.scene.gameVariables.sprites) {
            if (other !== sprite) other.disableInteractive();
        }


        if (sprite.tipo == "cerca") {
            sprite.isMoving = true;
            this.scene.gameVariables.freeClick = true;
            sprite.setDepth(2000);
        }

    }

}
