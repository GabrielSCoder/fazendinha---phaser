export default class DragMenuManager {
    constructor(scene, sprites, isoGrid) {
        this.scene = scene;
        this.sprites = sprites;
        this.isoGrid = isoGrid;

        this.spriteInitialPositions = new Map();
        this.selectedSprite = null;

        // Cria container do menu
        this.menuContainer = scene.add.container(0, 0).setDepth(1000).setVisible(false);
        const bg = scene.add.rectangle(0, 0, 90, 80, 0x000000, 0.7).setOrigin(0);
        bg.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 45, 15);
        const btnSell = this.createButton('Vender', 45, 40);
        const btnStore = this.createButton('Guardar', 45, 65);
        this.menuContainer.add([bg, btnMove, btnSell, btnStore]);

        // Eventos dos botões
        btnMove.on('pointerup', () => {
            this.hideMenu();
            if (this.selectedSprite) this.enableDrag(this.selectedSprite);
        });
        btnSell.on('pointerup', () => {
            console.log("Vendeu", this.selectedSprite.texture.key);
            this.hideMenu();
        });
        btnStore.on('pointerup', () => {
            console.log("Guardou", this.selectedSprite.texture.key);
            this.hideMenu();
        });

        // Inicializa posições e eventos de clique nos sprites
        this.sprites.forEach(s => {
            this.spriteInitialPositions.set(s, { x: s.x, y: s.y });
            s.setInteractive({ useHandCursor: true });
            s.on('pointerup', (pointer) => {
                pointer.event.stopPropagation();
                this.showMenu(s);
            });
        });

        // Fecha menu ao clicar fora
        scene.input.on('pointerup', (pointer, objs) => {
            if (!objs.length) this.hideMenu();
        });

        // Configura drag
        scene.input.on('dragstart', (pointer, sprite) => {
            if (!sprite.isDraggable) return;
            this.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });
        });

        scene.input.on('drag', (pointer, sprite, dragX, dragY) => {
            if (!sprite.isDraggable) return;
            sprite.x = dragX;
            sprite.y = dragY;
        });

        scene.input.on('dragend', (pointer, sprite) => {
            if (!sprite.isDraggable) return;
            this.handleDrop(sprite);
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

    showMenu(sprite) {
        this.selectedSprite = sprite;
        this.menuContainer.setPosition(sprite.x + 50, sprite.y - 40);
        this.menuContainer.setVisible(true);
    }

    hideMenu() {
        this.menuContainer.setVisible(false);
        this.selectedSprite = null;
    }

    enableDrag(sprite) {
        sprite.isDraggable = true;
        // opcional: fechar menu ao começar a arrastar
        this.hideMenu();
    }

    handleDrop(sprite) {
        const iso = this.isoGrid.screenToIso(sprite.x, sprite.y);
        const w = 1, h = 1;
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));
        const clampedX = Phaser.Math.Clamp(startX, 0, this.isoGrid.gridWidth - w);
        const clampedY = Phaser.Math.Clamp(startY, 0, this.isoGrid.gridHeight - h);
        const snapped = this.isoGrid.isoToScreen(clampedX + (w / 2 - 0.5), clampedY + (h / 2 - 0.5));
        sprite.x = snapped.x;
        sprite.y = snapped.y;
        sprite.isDraggable = false; // só permite arrastar uma vez por clique em mover
    }
}
