// BottomMenu.js
export default class BottomMenu {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.shopMenu = config.shopMenu || null;
        this.itemMenu = config.itemMenu || null;

        this.createUI();
    }

    createUI() {
        const { width, height } = this.scene.scale;
        const menuWidth = 185;
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
            width - menuWidth - 90,
            height - menuHeight - 20
        );

        this.containerUI.add(this.bottomMenu);
        this.containerUI.add(this.upperMenu);

        const bg = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.85)
            .setOrigin(0);

        this.bottomMenu.add(bg);

        const btnLoja = this.scene.add.text(menuWidth - 40, menuHeight / 2, "LOJA", {
            fontSize: '16px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnMatriz = this.scene.add.text(menuWidth - 100, menuHeight / 2, "Matriz", {
            fontSize: '14px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnZoomIn = this.scene.add.text(menuWidth - 50, menuHeight / 2, "+", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnZoomOut = this.scene.add.text(menuWidth - 20, menuHeight / 2, "-", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: '#3675bc',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnContainer = this.scene.add.container(menuWidth - 100, menuHeight / 2);

        const btnBg = this.scene.add.rectangle(0, 0, 50, 50, 0x54c848, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);
        btnContainer.add(btnBg);

        const btnArar = this.scene.add.image(0, 0, "enxada")
            .setOrigin(0.5)
            .setDisplaySize(40, 40);

        btnContainer.add(btnArar);

        btnContainer.setSize(50, 50);
        btnContainer.setInteractive({ useHandCursor: true });

        const btnContainerPa = this.scene.add.container(menuWidth - 155, menuHeight / 2);

        const btnBgPa = this.scene.add.rectangle(0, 0, 50, 50, 0xfa0202, 1)
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);
        btnContainerPa.add(btnBgPa);

        const btnCavar = this.scene.add.image(0, 0, "pa")
            .setOrigin(0.5)
            .setDisplaySize(40, 40);

        btnContainerPa.add(btnCavar);

        btnContainerPa.setSize(50, 50);
        btnContainerPa.setInteractive({ useHandCursor: true });

        this.upperMenu.add([btnMatriz, btnZoomIn, btnZoomOut])
        this.bottomMenu.add([btnLoja, btnContainer, btnContainerPa]);

        btnMatriz.on('pointerup', () => {
            const visible = this.scene.matrixVisible
            this.scene.matrixGraphics.setVisible(!visible)
            this.scene.matrixLabel.setVisible(!visible)
            this.scene.matrixVisible = !visible;
        })

        btnContainer.on('pointerdown', () => {
            if (!this.scene.arando) {
                this.scene.freeClick = true;
                for (let sprite of this.scene.sprites) {
                    sprite.disableInteractive();
                }
            }
        });

        btnContainer.on('pointerup', () => {
            this.scene.arando = !this.scene.arando;
            if (!this.scene.arando) {
                this.scene.clearPreviewTiles();
                for (let other of this.scene.sprites) {
                    other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
                }
            }
        });

        btnContainerPa.on('pointerdown', () => {
            if (!this.scene.selling) {
                this.scene.freeClick = true;
            }
        });

        btnContainerPa.on('pointerup', () => {
            this.scene.selling ? this.scene.stopSell() : this.scene.startSell();
        });

        btnLoja.on('pointerdown', () => {
            if (this.itemMenu) this.itemMenu.setVisible(false);
            if (this.shopMenu) this.shopMenu.open();
        });

        btnZoomIn.on('pointerup', () => {
            this.scene.freeClick = true;
            this.scene.itemMenuUI.hide()
            const cam = this.scene.cameras.main;
            const zoomChange = 0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.5, 2);
            cam.setZoom(newZoom);
        });

        btnZoomOut.on('pointerup', () => {
            this.scene.freeClick = true;
            this.scene.itemMenuUI.hide()
            const cam = this.scene.cameras.main;
            const zoomChange = -0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.5, 2);
            cam.setZoom(newZoom);
        });
    }

}
