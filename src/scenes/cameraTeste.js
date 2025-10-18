import CameraController from '../CameraController.js';
import TopUI from '../TopUI.js';
import ShopMenu from '../ShopMenu.js';

export class CameraTeste extends Phaser.Scene {
    constructor() {
        super("CameraTeste");
    }

    create() {
        // === GRID CONFIG ===
        this.gridSize = 64;
        this.gridWidth = 10;
        this.gridHeight = 10;
        this.offsetX = 400;
        this.offsetY = 150;

        // exemplo: um sprite no mundo
        this.worldRect = this.add.rectangle(400, 300, 100, 100, 0x6666ff);

        // === GRID GRAPHICS ===
        this.gridGraphics = this.add.graphics();
        this.gridGraphics.lineStyle(1, 0x00ff00, 0.5);
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const p1 = this.isoToScreen(x, y);
                const p2 = this.isoToScreen(x + 1, y);
                const p3 = this.isoToScreen(x + 1, y + 1);
                const p4 = this.isoToScreen(x, y + 1);
                this.gridGraphics.beginPath();
                this.gridGraphics.moveTo(p1.x, p1.y);
                this.gridGraphics.lineTo(p2.x, p2.y);
                this.gridGraphics.lineTo(p3.x, p3.y);
                this.gridGraphics.lineTo(p4.x, p4.y);
                this.gridGraphics.closePath();
                this.gridGraphics.strokePath();
            }
        }

        // === TOP UI ===
        this.topUI = new TopUI(this);

        // === BOTTOM SHOP MENU ===
        this.shopMenu = new ShopMenu(this);

        // Exemplo: botão abrir loja fixo
        this.bottomMenu = this.add.container(0, this.scale.height - 80).setDepth(1000);
        const menuBg = this.add.rectangle(0, 0, 200, 80, 0x222222, 0.8).setOrigin(0);
        const btnLoja = this.add.text(150, 40, "LOJA", { 
            fontSize: '16px', color: '#fff', backgroundColor: '#444', 
            padding: { left: 8, right: 8, top: 4, bottom: 4 } 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        this.bottomMenu.add([menuBg, btnLoja]);

        btnLoja.on('pointerdown', () => {
            this.shopMenu.open();
        });

        // === UI CAMERA ===
        this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.uiCamera.ignore(this.worldRect);
        this.uiCamera.ignore(this.gridGraphics);
        this.uiCamera.ignore(this.gridGraphics);

        this.cameras.main.ignore(this.topUI.containerUI);
        this.cameras.main.ignore(this.bottomMenu);
        this.cameras.main.ignore(this.shopMenu.container);

        // === CAMERA CONTROLS ===
        this.dragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.camStart = { x: 0, y: 0 };

        this.input.on('pointerdown', (pointer) => {
            if (pointer.middleButtonDown()) {
                this.dragging = true;
                this.dragStart.x = pointer.x;
                this.dragStart.y = pointer.y;
                this.camStart.x = this.cameras.main.scrollX;
                this.camStart.y = this.cameras.main.scrollY;
            }
        });

        this.input.on('pointerup', () => this.dragging = false);
        this.input.on('pointermove', (pointer) => {
            if (!this.dragging) return;
            const dx = pointer.x - this.dragStart.x;
            const dy = pointer.y - this.dragStart.y;
            this.cameras.main.scrollX = this.camStart.x - dx;
            this.cameras.main.scrollY = this.camStart.y - dy;
        });

        // zoom
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const zoomChange = -deltaY * 0.0015;
            const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomChange, 0.5, 2);
            this.cameras.main.setZoom(newZoom);
        });
    }

    isoToScreen(x, y) {
        const w = this.gridSize;
        const h = this.gridSize / 2;
        return {
            x: this.offsetX + (x - y) * (w / 2),
            y: this.offsetY + (x + y) * (h / 2)
        };
    }
}
