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
        const menuWidth = 200;
        const menuHeight = 60;

        this.containerUI = this.scene.add.container(0, 0).setDepth(1000);
        this.containerUI.setScrollFactor(0);

        this.bottomMenu = this.scene.add.container(
            width - menuHeight - 150,
            height - menuHeight - 20
        );
        this.containerUI.add(this.bottomMenu);

        // Fundo do menu
        const bg = this.scene.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.85).setOrigin(0);
        this.bottomMenu.add(bg);

        // =========================
        // Botão de Loja
        // =========================
        const btnLoja = this.scene.add.text(menuWidth - 50, menuHeight / 2, "LOJA", {
            fontSize: '16px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnZoomIn = this.scene.add.text(menuWidth - 100, menuHeight / 2, "+", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const btnZoomOut = this.scene.add.text(menuWidth - 130, menuHeight / 2, "-", {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: '#fff',
            backgroundColor: '#444',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        this.bottomMenu.add([btnLoja, btnZoomIn, btnZoomOut]);

        // =========================
        // Lógica dos botões
        // =========================
        btnLoja.on('pointerdown', () => {
            if (this.itemMenu) this.itemMenu.setVisible(false);
            if (this.shopMenu) this.shopMenu.open();
        });

        btnZoomIn.on('pointerup', () => {
            const cam = this.scene.cameras.main;
            const zoomChange = 0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.5, 2);
            cam.setZoom(newZoom);
        });

        btnZoomOut.on('pointerup', () => {
            const cam = this.scene.cameras.main;
            const zoomChange = -0.15;
            const newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, 0.5, 2);
            cam.setZoom(newZoom);
        });
    }
}
