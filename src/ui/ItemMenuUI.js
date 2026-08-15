export default class ItemMenuUI {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;

        this.itemMenu = scene.add.container(0, 0)
            .setDepth(2000)
            .setVisible(false);

        this.selectedSprite = null;

        this.buttons = {};
        this.lines = [];

        this.createMenu();

        scene.input.on('pointerup', (pointer, objs) => {
            if (!objs.length) {
                this.hide();
            }
        });

        this.gameEvents();
    }

    gameEvents() {
        this.uiEvents.on("ui:closeMenuSprite", () => {
            this.hide();
        })
    }

    createMenu() {

        this.bg = this.scene.add.rectangle(
            0,
            0,
            1,
            1,
            0xffffff,
            1
        )
            .setOrigin(0)
            .setStrokeStyle(1, 0xffffff, 0.5);

        this.itemMenu.add(this.bg);

        this.buttons.move = this.createButton("Mover");
        this.buttons.sell = this.createButton("Vender");
        this.buttons.rotate = this.createButton("Girar");
        this.buttons.use = this.createButton("Usar");

        this.buttons.move.on('pointerup', (pointer, localX, localY, event) => {
            this.onMoveClick(pointer, localX, localY, event);
        });

        this.buttons.use.on('pointerup', () => {
            this.hide();
            const sprite = this.scene.gameVariables.selectedSprite;
            if (!sprite) return;
            if (sprite.tipo === "veiculo") {
                this.scene.gameVariables.changeActionSize(sprite.base_action, sprite.base_action);

                switch (sprite.vehicle_action) {
                    case "plow":
                        this.uiEvents.emit("action:StartPlowing", {vehicle : true, img: sprite, action: "plow" });
                        break;
                    case "harvest":
                        this.uiEvents.emit("action:StartHarvesting", {vehicle : true, img: sprite, action: "harvest" });
                        break;
                    case "seed":
                        this.scene.gameVariables.vehicleSelected = sprite;
                        this.controllers.shopMenu.activeCategory = 'Sementes';
                        this.controllers.shopMenu.open();
                        break;
                    default:
                        break;
                }
            }
        })

        this.buttons.sell.on("pointerup", () => {
            this.scene.gameVariables.selectedSpriteDelete = this.scene.gameVariables.selectedSprite;
            this.uiEvents.emit("ui:notify", {
                type: "sell", nome: this.scene.gameVariables.selectedSpriteDelete.nome,
                preco: this.scene.gameVariables.selectedSpriteDelete.preco_venda,
                action: "action:SellItemUI"
            });
        })

        this.buttons.rotate.on('pointerup', () => this.controllers.spriteUtils.onRotateClick());

        this.itemMenu.add([
            this.buttons.move,
            this.buttons.sell,
            this.buttons.rotate,
            this.buttons.use
        ]);

        this.createLines();

        this.itemMenu.add(this.lines);
    }

    createLines() {

        for (let i = 0; i < 3; i++) {

            const line = this.scene.add.rectangle(
                0,
                0,
                50,
                2,
                0x000000,
                0.25
            )
                .setOrigin(0);

            this.lines.push(line);
        }
    }

    createButton(text) {

        const btn = this.scene.add.text(
            0,
            0,
            text,
            {
                fontSize: '10px',
                fontFamily: 'LuckiestGuy-Regular',
                color: '#000',
                backgroundColor: '#ffffff',
                padding: {
                    left: 2,
                    right: 2,
                    top: 2,
                    bottom: 2
                }
            }
        )
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

    updateMenuOptions(sprite) {

        const options = [];

        if (!sprite.cannotMove) {
            options.push("move");
        }

        if (!sprite.cannotSell) {
            options.push("sell");
        }

        if (!sprite.cannotRotate) {
            options.push("rotate");
        }

        if (sprite.tipo === "veiculo") {
            options.push("use");
        }

        this.updateButtonPositions(options);
    }

    updateButtonPositions(options) {

        const buttonHeight = 20;
        const padding = 4;

        let y = padding;

        options.forEach((option, index) => {

            const button = this.buttons[option];

            button.setPosition(5, y);
            button.setVisible(true);

            y += buttonHeight;
        });

        Object.entries(this.buttons).forEach(([key, button]) => {

            if (!options.includes(key)) {
                button.setVisible(false);
            }
        });

        const visibleLines = options.length - 1;

        this.lines.forEach((line, index) => {

            if (index < visibleLines) {

                line.setPosition(
                    0,
                    padding + buttonHeight * (index + 1) - 2
                );

                line.setVisible(true);

            } else {

                line.setVisible(false);

            }
        });

        const menuHeight =
            padding * 2 +
            buttonHeight * options.length;

        this.bg.setSize(50, menuHeight);

        this.itemMenu.setSize(50, menuHeight);
    }

    show(x, y, sprite = null) {

        this.selectedSprite = sprite;

        if (!sprite) {
            this.hide();
            return;
        }

        this.updateMenuOptions(sprite);

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