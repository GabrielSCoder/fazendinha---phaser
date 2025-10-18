import ShopMenu from '../ShopMenu.js';
import TopUI from "../TopUI.js";
import IsoGrid from "../IsoGrid.js";
import CameraController from "../CameraController.js";
import BottomMenu from '../bottomMenu.js';

export class IsoTest extends Phaser.Scene {
    constructor() {
        super('IsoTest');
    }

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');
        this.load.image('abacaxi.png', 'assets/abacaxi.png');
        this.load.image('armazem.png', 'assets/super_armazem.png');
        this.load.image('menu_bg', 'assets/fundo_madeira.jpg');
        this.load.image('item_bg', 'assets/fundo_item_loja.png');
        this.load.image('categoria_bg', 'assets/categoria_fundo.png');
        this.load.image('vaca.png', 'assets/vaca.png');
        this.load.image('gold_icon', 'assets/gold.png');
        this.load.image('cash_icon', 'assets/cash.png');
        this.load.image('clock_icon', 'assets/clock2.png');
        this.load.image('close_button', 'assets/close.png');
        this.load.image('proximo_button', 'assets/proximo.png');
        this.load.image('anterior_button', 'assets/anterior.png');
        this.load.image('macieira.png', 'assets/macieira.png');
        this.load.image('planta1.png', 'assets/plantas1.png');
        this.load.image('cerca_madeira_lado.png', 'assets/cerca_madeira_lado.png');

        this.load.image('cow', 'assets/vaca.png');
        this.load.image('trator.png', 'assets/trator.png');
        this.load.image('super_armazem', 'assets/super_armazem.png');
        this.load.image('chicken.png', 'assets/galo.png');
        this.load.image('ovelha.png', 'assets/ovelha.png');
        this.load.image('porco.png', 'assets/porco.png');
    }

    create() {

        this.gridSize = 64;
        this.gridWidth = 12;
        this.gridHeight = 12;
        this.offsetX = 550;
        this.offsetY = 200;

        this.gridMap = Array.from({ length: this.gridWidth }, () =>
            Array(this.gridHeight).fill(null)
        );

        this.matrixGraphics = this.add.graphics();
        this.matrixOffsetX = this.offsetX + 300 // posição lateral da matriz
        this.drawMatrix();

        this.gridGraphics = this.add.graphics();
        this.gridGraphics.lineStyle(1, 0x00ff00, 0.3);
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

        // === FOOTPRINT GRAPHICS ===
        this.footprintGraphics = this.add.graphics();

        this.sprites = [];
        this.spriteInitialPositions = new Map();

        // this.sprites.push(this.addGameSprite('cow', 400, 300, 0.3));
        // this.sprites.push(this.addGameSprite('chicken.png', 420, 300, 0.12));
        // this.sprites.push(this.addGameSprite('macieira.png', 500, 500, 0.50).setOrigin(0.5, 0.8));
        // this.sprites.push(this.addGameSprite('porco', 440, 300, 0.5));
        // this.sprites.push(this.addGameSprite('trator.png', 500, 250, 0.5));
        // this.sprites.push(this.addGameSprite('armazem.png', 700, 250, 0.5));

        // === MENU FIXO ===
        const menuHeight = 80;
        const menuWidth = 200;
        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this);
        this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);

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
            console.log(newZoom)
        });

        // 🔹 Menu inferior com botão "LOJA"
        // this.bottomMenu = this.add.container(
        //     this.scale.width - menuHeight - 150,
        //     this.scale.height - menuHeight - 20
        // );

        // const bg = this.add.rectangle(0, 0, menuWidth, menuHeight, 0x222222, 0.8).setOrigin(0);
        // const btnLoja = this.add.text(menuWidth - 50, menuHeight / 2, "LOJA", {
        //     fontSize: '16px',
        //     fontFamily: 'LuckiestGuy-Regular',
        //     color: '#fff',
        //     backgroundColor: '#444',
        //     padding: { left: 8, right: 8, top: 4, bottom: 4 }
        // })
        //     .setOrigin(0.5)
        //     .setInteractive({ useHandCursor: true });

        // const btnZoomIn = this.add.text(menuWidth - 100, menuHeight / 2, "+", {
        //     fontSize: '16px',
        //     fontFamily: 'LuckiestGuy-Regular',
        //     color: '#fff',
        //     backgroundColor: '#444',
        //     padding: { left: 8, right: 8, top: 4, bottom: 4 }
        // })
        //     .setOrigin(0.5)
        //     .setInteractive({ useHandCursor: true });

        // const btnZoomOut = this.add.text(menuWidth - 130, menuHeight / 2, "-", {
        //     fontSize: '16px',
        //     fontFamily: 'LuckiestGuy-Regular',
        //     color: '#fff',
        //     backgroundColor: '#444',
        //     padding: { left: 8, right: 8, top: 4, bottom: 4 }
        // })
        //     .setOrigin(0.5)
        //     .setInteractive({ useHandCursor: true });

        // this.bottomMenu.add([bg, btnLoja, btnZoomIn, btnZoomOut]);

        // btnLoja.on('pointerdown', () => {
        //     this.itemMenu.setVisible(false);
        //     this.shopMenu.open();
        // });

        // btnZoomIn.on('pointerup', () => {
        //     const zoomChange = 0.15;
        //     const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomChange, 0.5, 2);
        //     this.cameras.main.setZoom(newZoom);
        // });

        // btnZoomOut.on('pointerup', () => {
        //     const zoomChange = - 0.15;
        //     const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomChange, 0.5, 2);
        //     this.cameras.main.setZoom(newZoom);
        // });

        
        // 🔹 Cria o menu de item (Mover, Vender, Guardar)
        this.itemMenu = this.add.container(0, 0).setDepth(2000).setVisible(false);
        const bgx = this.add.rectangle(0, 0, 80, 80, 0x000000, 0.7).setOrigin(0);
        bgx.setStrokeStyle(1, 0xffffff, 0.5);

        const btnMove = this.createButton('Mover', 40, 15);
        // const btnSell = this.createButton('Vender', 40, 40);
        const btnRotate = this.createButton('Girar', 40, 65);
        // const btnStore = this.createButton('Guardar', 40, 65);

        this.itemMenu.add([bgx, btnMove, btnRotate]);


        this.selectedSprite = null;

        this.storedItemsContainer = this.add.container(50, 50).setDepth(500);


        btnMove.on('pointerup', () => {
            this.itemMenu.setVisible(false);
            if (this.selectedSprite) {
                const sprite = this.selectedSprite;
                sprite.isMoving = true;
                sprite.setDepth(2000);

                for (let other of this.sprites) {
                    if (other !== sprite) {
                        other.disableInteractive();
                    }
                }

                sprite.clearTint();
                this.finishMoveClick = true;
                console.log("vai mover")
            }
        });



        // Botão Vender
        // btnSell.on('pointerup', () => {
        //     console.log("Vendeu", this.selectedSprite.texture.key);
        //     this.selectedSprite.destroy();
        //     this.itemMenu.setVisible(false);
        // });


        btnRotate.on('pointerup', () => {
            const sprite = this.selectedSprite;
            if (!sprite || !sprite.footprint) return;
            this.itemMenu.setVisible(false);

            // Armazena footprint original na primeira rotação
            if (!sprite.originalFootprint) {
                if (Array.isArray(sprite.footprint)) {
                    sprite.originalFootprint = [...sprite.footprint];
                } else {
                    const { w, h } = sprite.footprint;
                    sprite.originalFootprint = [w, h];
                }
            }

            // Alterna entre girado e original
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

            // Recalcula posição no grid com footprint atualizado
            const iso = this.screenToIso(sprite.x, sprite.y);
            const [w, h] = sprite.footprint;
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            sprite.lastFreePos = { startX, startY };


            const ocupado = this.checkOccupiedGrid(
                startX,
                startY,
                startX + w - 1,
                startY + h - 1,
                sprite
            );
            if (ocupado) {

                console.log("❌ Tile ocupado — revertendo sprite.");
                this.selectedSprite.isMoving = true
                return;

            } else {
                // Faz snap pro centro do tile válido
                const snapped = this.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
                sprite.x = snapped.x;
                sprite.y = snapped.y;

                // Atualiza ocupação
                this.clearOccupied(sprite);
                this.markOccupied(sprite, startX, startY, w, h);

                sprite.lastFreePos = { startX, startY };
                console.log("✅ Nova posição salva:", startX, startY);
            }

            // Reseta estado
            sprite.clearTint();
            this.selectedSprite = null;

            sprite.setDepth(1000);

            this.drawFootprints();
        });




        // Botão Guardar
        // btnStore.on('pointerup', () => {
        //     if (!this.selectedSprite) return;
        //     console.log("Guardou", this.selectedSprite.texture.key);
        // });

        this.input.on('pointerup', (pointer, objs) => {
            if (!objs.length) this.itemMenu.setVisible(false);
        });

        btnMove.on('pointerup', (pointer, localX, localY, event) => {
            // Evita que o clique passe pra cena
            event.stopPropagation();

            this.itemMenu.setVisible(false);
            if (this.selectedSprite) {
                const sprite = this.selectedSprite;
                sprite.isMoving = true;
                sprite.setDepth(2000);

                for (let other of this.sprites) {
                    if (other !== sprite) other.disableInteractive();
                }

                console.log("🟢 Modo mover ativado");
            }
        });

        this.uiCamera.ignore(this.gridGraphics);
        this.uiCamera.ignore(this.sprites);
        this.uiCamera.ignore(this.footprintGraphics);
        this.uiCamera.ignore(this.itemMenu);

        this.cameras.main.ignore(this.topUI.containerUI);
        this.cameras.main.ignore(this.bottomMenu.containerUI);
        this.cameras.main.ignore(this.matrixGraphics);
        this.cameras.main.ignore(this.matrixLabel);
        this.cameras.main.ignore(this.shopMenu.container);


        this.input.on('pointerup', (pointer, objs, event) => {
            // Evita conflito com cliques de menu
            if (this.itemMenu.visible) return;

            const sprite = this.selectedSprite;
            if (!sprite || !sprite.isMoving) return;

            const { w, h } = this.getSpriteFootprint(sprite);

            // Converte a posição atual do sprite para coordenadas ISO
            const iso = this.screenToIso(sprite.x, sprite.y);

            // Calcula o tile inicial (canto superior esquerdo da footprint)
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            const endX = startX + w - 1;
            const endY = startY + h - 1;

            // Checa se há sobreposição com outros objetos
            const ocupado = this.checkOccupiedGrid(startX, startY, endX, endY, sprite);
            if (ocupado) {
                console.log("❌ Tile ocupado — revertendo sprite.");
                // if (sprite.lastFreePos) {
                //     const snapped = this.isoToScreen(sprite.lastFreePos.startX + (w / 2 - 0.5), sprite.lastFreePos.startY + (h / 2 - 0.5));
                //     sprite.x = snapped.x;
                //     sprite.y = snapped.y;
                // }
                return;
            } else {
                // Faz snap pro centro do tile válido
                const snapped = this.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
                sprite.x = snapped.x;
                sprite.y = snapped.y;

                // Atualiza ocupação
                this.clearOccupied(sprite);
                this.markOccupied(sprite, startX, startY, w, h);

                sprite.lastFreePos = { startX, startY };
                console.log("✅ Nova posição salva:", startX, startY);
            }

            // Reseta estado
            sprite.clearTint();
            sprite.isMoving = false;
            this.selectedSprite = null;
            sprite.setDepth(1000);
            for (let other of this.sprites) {
                other.setInteractive({ useHandCursor: true });
            }

            this.drawFootprints();
        });


        this.input.setDraggable(this.sprites);


        this.drawFootprints();

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            // Cria o sprite no centro da tela
            const scale = itemData.escala;
            const sprite = this.addGameSprite(itemData.img, this.scale.width / 2, this.scale.height / 2, scale);
            if (itemData.area) {
                sprite.footprint = itemData.area;
            }

            sprite.isMoving = true;
            sprite.setDepth(2000);
            this.selectedSprite = sprite;

            // Define footprint e posição inicial provisória
            const { w, h } = this.getSpriteFootprint(sprite);
            const iso = this.screenToIso(sprite.x, sprite.y);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            sprite.lastFreePos = { startX, startY };

            // Remove qualquer ocupação prévia (caso de bug visual)
            this.clearOccupied(sprite);

            // Checa colisão imediatamente
            const ocupado = this.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

            // Desabilita interação dos outros enquanto arrasta
            for (let other of this.sprites) {
                if (other !== sprite) other.disableInteractive();
            }

            if (!this.sprites) this.sprites = [];
            this.sprites.push(sprite);

            if (this.uiCamera) {
                this.uiCamera.ignore(this.sprites);
            }

            console.log("🛒 Novo item comprado, pronto pra posicionar.");
        });


    }

    // Salva última posição livre válida durante o movimento
    update() {

        if (this.selectedSprite && this.selectedSprite.isMoving) {
            const sprite = this.selectedSprite;
            const pointer = this.input.activePointer;

            // converte para iso usando pointer
            let iso = this.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.getSpriteFootprint(sprite);

            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight - h) + (h / 2 - 0.5);

            const snapped = this.isoToScreen(iso.x, iso.y);
            sprite.x = snapped.x;
            sprite.y = snapped.y;

            // checa ocupação
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            const endX = startX + w - 1;
            const endY = startY + h - 1;

            const occupied = this.checkOccupiedGrid(startX, startY, endX, endY, sprite);

            sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            this.drawFootprints();
        }
    }

    drawMatrix() {
        this.matrixGraphics.clear();

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const occupied = this.gridMap[x][y] ? true : false;
                const color = occupied ? 0xe74c3c : 0x2ecc71;
                this.matrixGraphics.fillStyle(color, 1);
                this.matrixGraphics.fillRect(
                    this.matrixOffsetX + x * 10,
                    this.offsetY + y * 10,
                    10, 10
                );
            }
        }

        this.matrixGraphics.lineStyle(1, 0xffffff, 0.5);
        this.matrixGraphics.strokeRect(
            this.matrixOffsetX,
            this.offsetY,
            this.gridWidth * 10,
            this.gridHeight * 10
        );

        if (!this.matrixLabel) {
            this.matrixLabel = this.add.text(
                this.matrixOffsetX,
                this.offsetY - 20,
                'Matriz de ocupação',
                { fontSize: '14px', color: '#ffffff' }
            );
        }
    }

    // Em todos os lugares onde você marca ou limpa ocupação, chame drawMatrix()
    markOccupied(sprite, startX, startY, w, h) {
        for (let x = startX; x < startX + w; x++) {
            for (let y = startY; y < startY + h; y++) {
                this.gridMap[x][y] = sprite;
            }
        }
        this.drawMatrix();
    }

    clearOccupied(sprite) {
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                if (this.gridMap[x][y] === sprite) {
                    this.gridMap[x][y] = null;
                }
            }
        }
        this.drawMatrix();
    }

    addGameSprite(key, x, y, scale = 0.5) {
        const sprite = this.add.sprite(x, y, key).setScale(scale).setInteractive({ useHandCursor: true });

        sprite.isMoving = false;
        sprite.isDraggable = true;

        // guarda posição inicial
        this.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });

        this.sprites.push(sprite);

        this.input.setDraggable(sprite);

        // evento para abrir o menu contextual (mesma lógica que usava)
        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (this.finishMoveClick) {
                this.finishMoveClick = false;
                return;
            }

            if (!sprite.isMoving) {
                this.selectedSprite = sprite;
                this.itemMenu.setPosition(sprite.x + 30, sprite.y - 40);
                this.itemMenu.setVisible(true);
            }
        });

        sprite.on("pointerover", () => {
            sprite.setTint(0xffff00);
        })

        sprite.on("pointerout", () => {
            sprite.clearTint()
        })

        return sprite;
    }


    createButton(text, x, y) {
        const btn = this.add.text(x, y, text, {
            fontSize: '12px',
            color: '#fff',
            backgroundColor: '#222',
            padding: { left: 6, right: 6, top: 2, bottom: 2 },
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#444' }));
        btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#222' }));
        return btn;
    }

    drawFootprints() {
        this.footprintGraphics.clear();
        for (let sprite of this.sprites) {
            const { w, h } = this.getSpriteFootprint(sprite);
            const iso = this.screenToIso(sprite.x, sprite.y);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    const p1 = this.isoToScreen(startX + i, startY + j);
                    const p2 = this.isoToScreen(startX + i + 1, startY + j);
                    const p3 = this.isoToScreen(startX + i + 1, startY + j + 1);
                    const p4 = this.isoToScreen(startX + i, startY + j + 1);

                    this.footprintGraphics.fillStyle(0xff0000, 0.25);
                    this.footprintGraphics.beginPath();
                    this.footprintGraphics.moveTo(p1.x, p1.y);
                    this.footprintGraphics.lineTo(p2.x, p2.y);
                    this.footprintGraphics.lineTo(p3.x, p3.y);
                    this.footprintGraphics.lineTo(p4.x, p4.y);
                    this.footprintGraphics.closePath();
                    this.footprintGraphics.fillPath();
                }
            }
        }
    }

    snapToGrid(sprite) {
        const { w, h } = this.getSpriteFootprint(sprite);
        const iso = this.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const clampedX = Phaser.Math.Clamp(startX, 0, this.gridWidth - w);
        const clampedY = Phaser.Math.Clamp(startY, 0, this.gridHeight - h);

        const snapped = this.isoToScreen(clampedX + (w / 2 - 0.5), clampedY + (h / 2 - 0.5));
        sprite.x = snapped.x;
        sprite.y = snapped.y;
    }

    getSpriteFootprint(sprite) {
        if (sprite.footprint) {
            return { w: sprite.footprint[0], h: sprite.footprint[1] };
        }

        return { w: 1, h: 1 };
    }

    isoToScreen(x, y) {
        const w = this.gridSize;
        const h = this.gridSize / 2;
        return { x: this.offsetX + (x - y) * (w / 2), y: this.offsetY + (x + y) * (h / 2) };
    }

    screenToIso(x, y) {
        const w = this.gridSize;
        const h = this.gridSize / 2;
        const isoX = ((x - this.offsetX) / (w / 2) + (y - this.offsetY) / (h / 2)) / 2;
        const isoY = ((y - this.offsetY) / (h / 2) - (x - this.offsetX) / (w / 2)) / 2;
        return { x: isoX, y: isoY };
    }

    checkOccupiedGrid(startX, startY, endX, endY, sprite) {
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                if (x < 0 || y < 0 || x >= this.gridWidth || y >= this.gridHeight) return true;
                const cell = this.gridMap[x][y];
                if (cell && cell !== sprite) return true;
            }
        }
        return false;
    }

    debounce(func, delay) {
        let timeout; // This variable will hold the timeout ID

        return function (...args) {
            const context = this; // Store the 'this' context for later use

            // Clear any existing timeout to prevent the previous function call from executing
            clearTimeout(timeout);

            // Set a new timeout
            timeout = setTimeout(() => {
                // Execute the original function after the delay, preserving 'this' context and arguments
                func.apply(context, args);
            }, delay);
        };
    }
}
