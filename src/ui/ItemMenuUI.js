export default class ItemMenuUI {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;

        this.itemMenu = scene.add.container(0, 0)
            .setDepth(2000)
            .setVisible(false);

        const bgx = scene.add.rectangle(0, 0, 50, 60, 0xffffff, 1).setOrigin(0);
        bgx.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 5, 1);
        const btnSell = this.createButton('Vender', 3, 23);
        const btnRotate = this.createButton('Girar', 5, 44);

        const line = this.scene.add.rectangle(
            0,
            20,
            50,
            2,
            0x000,
            0.25
        ).setOrigin(0);

        const line2 = this.scene.add.rectangle(
            0,
            40,
            50,
            2,
            0x000,
            0.25
        ).setOrigin(0);

        this.itemMenu.add([bgx, btnMove, line, btnSell, line2, btnRotate]);

        this.selectedSprite = null;

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

        btnRotate.on('pointerup', () => this.controllers.spriteUtils.onRotateClick());

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
            fontSize: '10px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#000',
            backgroundColor: '#ffffff',
            padding: { left: 4, right: 4, top: 2, bottom: 2 }
        })
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => {
            btn.setBackgroundColor('#dddddd');
        });

        btn.on('pointerout', () => {
            btn.setBackgroundColor('#ffffff');
        });

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
        // sprite.setAlpha(0.7);
        sprite.isMoving = true;
        this.gridUtils.ReOccupiedFences();
        sprite.setDepth(300);

        for (let other of this.scene.gameVariables.sprites) {
            if (other !== sprite) other.disableInteractive();
        }
    }



}
