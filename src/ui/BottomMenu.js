
export default class BottomMenu {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.shopMenu = config.shopMenu || null;
        this.itemMenu = config.itemMenu || null;
        this.uiEvents = config.uiEvents;
        this.soilControl = scene.controllers.soil;
        this.sellControl = scene.controllers.sell;
        this.variables = scene.gameVariables;
        this.buttons = {};
        this.createUI();
        this.registerEvents();
    }

    createButton({ text, x, y, onClick }) {

        const btn = this.scene.add.text(x, y, text, {
            fontSize: '16px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        return btn;
    }

    createUI() {
        const { width, height } = this.scene.scale;
        const menuWidth = 240;
        const menuHeight = 60;

        const upperMenuWidth = 40
        const upperMenuHeight = 100

        this.containerUI = this.scene.add.container(0, 0).setDepth(1000);
        this.containerUI.setScrollFactor(0);

        this.upperMenu = this.scene.add.container(
            width - upperMenuWidth - 230,
            height - upperMenuHeight - 30
        )

        this.bottomMenu = this.scene.add.container(
            width - menuWidth - 30,
            height - menuHeight - 20
        );

        this.containerUI.add(this.bottomMenu);
        this.containerUI.add(this.upperMenu);

        const bg = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.85)
            .setOrigin(0);

        this.bottomMenu.add(bg);

        this.btnLoja = this.scene.add.text(menuWidth - 40, menuHeight / 2, "LOJA", {
            fontSize: '16px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 8, bottom: 8 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.btnMatriz = this.scene.add.text(menuWidth - 100, menuHeight / 2, "Matriz", {
            fontSize: '14px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.btnCancelar = this.scene.add.text(menuWidth - 180, menuHeight / 2, "Cancelar", {
            fontSize: '14px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#d31d1d',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);

        this.btnZoomIn = this.scene.add.text(menuWidth - 50, menuHeight / 2, "+", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.btnZoomOut = this.scene.add.text(menuWidth - 20, menuHeight / 2, "-", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.btnMode = this.scene.add.text(menuWidth - 20, menuHeight / 2 - 40, "M", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.btnContainer = this.scene.add.container(menuWidth - 155, menuHeight / 2);

        this.btnBg = this.scene.add.rectangle(0, 0, 50, 50, 0x54c848, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);
        this.btnContainer.add(this.btnBg);

        this.btnArar = this.scene.add.image(0, 0, "enxada")
            .setOrigin(0.5)
            .setDisplaySize(40, 40);

        this.btnContainer.add(this.btnArar);

        this.btnContainer.setSize(50, 50);
        this.btnContainer.setInteractive({ useHandCursor: true });

        this.btnContainerPa = this.scene.add.container(menuWidth - 210, menuHeight / 2);

        this.btnBgPa = this.scene.add.rectangle(0, 0, 50, 50, 0xfa0202, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);

        this.btnContainerPa.add(this.btnBgPa);

        this.btnCavar = this.scene.add.image(0, 0, "pa")
            .setOrigin(0.5)
            .setDisplaySize(40, 40);

        this.btnContainerPa.add(this.btnCavar);

        this.btnContainerPa.setSize(50, 50);
        this.btnContainerPa.setInteractive({ useHandCursor: true });

        this.btnContainerGift = this.scene.add.container(menuWidth - 100, menuHeight / 2).setSize(50, 50)

        this.btnGift = this.scene.add.rectangle(0, 0, 50, 50, 0xf7e300, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000)

        this.imgGift = this.scene.add.image(0, 0, "gift")
            .setOrigin(0.5)
            .setDisplaySize(40, 40);

        this.btnContainerGift.add([this.btnGift, this.imgGift])

        this.btnContainerGift.setInteractive({ useHandCursor: true });

        this.btnContainerGift.on("pointerdown", () => {
            this.uiEvents.emit("ui:showPresents")
        })

        this.upperMenu.add([this.btnMatriz, this.btnZoomIn, this.btnZoomOut, this.btnCancelar, this.btnMode])
        this.bottomMenu.add([this.btnLoja, this.btnContainer, this.btnContainerPa, this.btnContainerGift]);

        this.buttons['arar'] = this.btnContainer;
        this.buttons['loja'] = this.btnLoja;
        this.buttons['vender'] = this.btnContainerPa;
        this.buttons['zoomIn'] = this.btnZoomIn;
        this.buttons['zoomOut'] = this.btnZoomOut;
        this.buttons['matriz'] = this.btnMatriz;
        this.buttons['cancelar'] = this.btnCancelar;

        const cheatUi = this.createCheatMenu();

        this.containerUI.add(cheatUi.upper);
        this.containerUI.add(cheatUi.bottom);

        this.btnMatriz.on('pointerup', () => {
            this.scene.gameVariables.freeClick = true;
            const visible = this.scene.gameVariables.matrixVisible
            this.scene.matrixGraphics.setVisible(!visible)
            this.scene.matrixLabel.setVisible(!visible)
            this.scene.gameVariables.matrixVisible = !visible;
        })

        this.btnContainer.on('pointerup', () => {

            if (this.scene.gameVariables.selectedSprite && this.scene.gameVariables.selectedSprite.isMoving) {
                //console.log(this.scene.gameVariables.selectedSprite)
                this.scene.gameVariables.freeClick = true;
                return;
            }

            const arando = this.scene.gameVariables.plowing;
            arando ? this.uiEvents.emit("action:StopPlowing") : this.uiEvents.emit("action:StartPlowing");
        });

        this.btnContainerPa.on('pointerdown', () => {
            if (!this.scene.gameVariables.selling) {
                this.scene.gameVariables.freeClick = true;
            }
        });

        this.btnContainerPa.on('pointerup', () => {

            if (this.scene.gameVariables.selectedSprite && this.scene.gameVariables.selectedSprite.isMoving) {
                this.scene.gameVariables.freeClick = true;
                return;
            }

            this.scene.gameVariables.selling ? this.uiEvents.emit("action:StopSelling") : this.uiEvents.emit("action:StartSelling");
        });

        this.btnLoja.on('pointerdown', () => {
            if (this.itemMenu) this.itemMenu.setVisible(false);
            if (this.shopMenu) this.shopMenu.open();
        });

        this.btnCancelar.on('pointerup', () => {
            this.uiEvents.emit("queue:cancelAll");
        });

        this.btnZoomIn.on('pointerup', () => {
            this.scene.gameVariables.freeClick = true;
            this.controllers.itemMenu.hide()
            const cam = this.scene.cameras.main;
            const zoomChange = 0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.5, 2);
            cam.setZoom(newZoom);
        });

        this.btnZoomOut.on('pointerup', () => {
            this.scene.gameVariables.freeClick = true;
            this.controllers.itemMenu.hide()
            const cam = this.scene.cameras.main;
            const zoomChange = -0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.7, 2);
            cam.setZoom(newZoom);
        });

        this.btnMode.on("pointerup", () => {
            this.uiEvents.emit("changeGrid");
        })
    }

    createCheatMenu() {
        const { width, height } = this.scene.scale;
        const menuWidth = 250;
        const menuHeight = 40;

        this.CheatMenu = this.scene.add.container(
            50,
            height - menuHeight - 20
        ).setVisible(this.variables.debugBarVisible);

        this.CheatMenuUpper = this.scene.add.container(
            50,
            height - menuHeight - 60
        ).setVisible(this.variables.debugBarVisible);

        const bg = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.85)
            .setOrigin(0);

        const bg2 = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.85)
            .setOrigin(0);

        this.CheatMenu.add(bg);
        this.CheatMenuUpper.add(bg2);

        this.btnMinusGold = this.createButton({
            text: "- Ouro",
            x: menuWidth - 70,
            y: menuHeight / 2,
        })

        this.btnMinusMoney = this.createButton({
            text: "- Grana",
            x: menuWidth - 150,
            y: menuHeight / 2,
        })

        this.btnMinusXp = this.createButton({
            text: "- Xp",
            x: menuWidth - 220,
            y: menuHeight / 2,
        })

        this.btnPlusGold = this.createButton({
            text: "+ Ouro",
            x: menuWidth - 70,
            y: menuHeight / 2,
        })

        this.btnPlusMoney = this.createButton({
            text: "+ Grana",
            x: menuWidth - 150,
            y: menuHeight / 2,
        })

        this.btnPlusXp = this.createButton({
            text: "+ Xp",
            x: menuWidth - 220,
            y: menuHeight / 2,
        })

        this.btnMinusGold.on("pointerup", () => {
            // this.uiEvents.emit("action:setGold", -10)
            this.uiEvents.emit("ui:notify", { type: "mission" });
        })

        this.btnMinusMoney.on("pointerup", () => {
            // this.uiEvents.emit("action:setMoney", -10)
            this.uiEvents.emit("action:reward", { type: "decoracao", id: "cabana_rosa" })
            this.scene.gameVariables.freeClick = true;
        })

        this.btnMinusXp.on("pointerup", () => {
            this.uiEvents.emit("ui:showPresents")
        });

        this.btnPlusGold.on("pointerup", () => {
            this.uiEvents.emit("debug:downloadSave")
        })

        this.btnPlusMoney.on("pointerup", () => {
            // this.uiEvents.emit("action:setMoney", 10)
            this.uiEvents.emit("listObjects")
        })

        this.btnPlusXp.on("pointerup", () => {
            this.uiEvents.emit("action:addXP", { amount: 100 });
        });

        this.CheatMenu.add([this.btnPlusGold, this.btnPlusMoney, this.btnPlusXp]);
        this.CheatMenuUpper.add([this.btnMinusGold, this.btnMinusMoney, this.btnMinusXp]);

        const ui = {
            upper: this.CheatMenu,
            bottom: this.CheatMenuUpper
        }

        return ui
    }

    setButtonState(buttonName, enabled) {

        const button = this.buttons[buttonName];

        if (!button) return;

        if (enabled) {
            button.setInteractive({ useHandCursor: true });
            // button.setAlpha(1);
        } else {
            button.disableInteractive();
            // button.setAlpha(0.5);
        }
    }

    setVisibleState(buttonName, enabled) {

        const button = this.buttons[buttonName];

        if (!button) return;

        if (enabled) {
            button.setVisible(true);
        } else {
            button.setVisible(false);
        }
    }

    desativarTodosBotoes() {
        Object.keys(this.buttons).forEach(name => {
            this.setButtonState(name, false);
        });
    }

    ativarTodosBotoes() {
        Object.keys(this.buttons).forEach(name => {
            this.setButtonState(name, true);
        });
    }

    registerEvents() {

        this.uiEvents.on('ui:setButtonState', (buttonName, enabled) => {
            this.setButtonState(buttonName, enabled);
        });

        this.uiEvents.on('ui:ativarBottomMenu', () => {
            this.ativarTodosBotoes();
        })

        this.uiEvents.on('ui:desativarBottonMenu', () => {
            this.desativarTodosBotoes();
        })

        this.uiEvents.on('queue:changed', (busy) => {

            if (busy) {
                this.setButtonState('arar', false);
                // this.setButtonState('loja', false);
                this.setButtonState('vender', false);
                this.setVisibleState('cancelar', true);
            } else {
                this.setButtonState('arar', true);
                // this.setButtonState('loja', true);
                this.setButtonState('vender', true);
                this.setVisibleState('cancelar', false);
            }

        });
    }


}
