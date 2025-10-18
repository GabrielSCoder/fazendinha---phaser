export default class MenuUI {
    constructor(scene) {
        this.scene = scene;
        this.menuContainer = scene.add.container(0, 0).setDepth(1000).setVisible(false);
        this.selectedSprite = null;

        const bg = scene.add.rectangle(0, 0, 90, 80, 0x000000, 0.7).setOrigin(0);
        bg.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 45, 15);
        const btnSell = this.createButton('Vender', 45, 40);
        const btnStore = this.createButton('Guardar', 45, 65);

        this.menuContainer.add([bg, btnMove, btnSell, btnStore]);

        btnMove.on('pointerup', () => {
            this.hide();
            if (this.selectedSprite) this.scene.dragManager.enableDrag(this.selectedSprite);
        });

        btnSell.on('pointerup', () => {
            console.log("Vendeu", this.selectedSprite.texture.key);
            this.hide();
        });

        btnStore.on('pointerup', () => {
            console.log("Guardou", this.selectedSprite.texture.key);
            this.hide();
        });

        scene.input.on('pointerup', (pointer, objs) => {
            if (objs.length === 0) this.hide();
        });
    }

    createButton(text, x, y) {
        const btn = this.scene.add.text(x, y, text, {
            fontSize: '12px',
            color: '#fff',
            backgroundColor: '#222',
            padding: { left: 6, right: 6, top: 2, bottom: 2 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#444' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#222' }));
        return btn;
    }

    show(sprite) {
        this.selectedSprite = sprite;
        this.menuContainer.setPosition(sprite.x + 50, sprite.y - 40);
        this.menuContainer.setVisible(true);
    }

    hide() {
        this.menuContainer.setVisible(false);
        this.selectedSprite = null;
    }
}
