import ShopMenu from '../ShopMenu.js';
import TopUI from "../TopUI.js";
import CameraController from "../CameraController.js";
import BottomMenu from '../bottomMenu.js';
import ItemMenuUI from '../ItemMenuUI.js';
import gridUtils from "../GridUtils.js";

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
        this.gridUtils = new gridUtils(this);
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
        this.matrixOffsetX = this.offsetX + 300
        this.gridUtils.drawMatrix();

        this.gridGraphics = this.add.graphics();
        this.gridGraphics.lineStyle(1, 0x00ff00, 0.3);
        for (let x = 0; x < this.gridWidth; x++) {
            for (let y = 0; y < this.gridHeight; y++) {
                const p1 = this.gridUtils.isoToScreen(x, y, this.gridSize, this.offsetX, this.offsetY);
                const p2 = this.gridUtils.isoToScreen(x + 1, y, this.gridSize, this.offsetX, this.offsetY);
                const p3 = this.gridUtils.isoToScreen(x + 1, y + 1, this.gridSize, this.offsetX, this.offsetY);
                const p4 = this.gridUtils.isoToScreen(x, y + 1, this.gridSize, this.offsetX, this.offsetY);

                this.gridGraphics.beginPath();
                this.gridGraphics.moveTo(p1.x, p1.y);
                this.gridGraphics.lineTo(p2.x, p2.y);
                this.gridGraphics.lineTo(p3.x, p3.y);
                this.gridGraphics.lineTo(p4.x, p4.y);
                this.gridGraphics.closePath();
                this.gridGraphics.strokePath();
            }
        }


        this.footprintGraphics = this.add.graphics();

        this.sprites = [];
        this.spriteInitialPositions = new Map();
        this.middleButtonDown = false;
        this.freeClick = false; //Um clique a mais. Parece não necessário quando o input.on esta no mesmo arquivo que essa cena.
        this.ignoreNextPointerUp = false;

        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.itemMenuUI = new ItemMenuUI(this);
        this.cameraController = new CameraController(this);
        this.selectedSprite = null;
        // this.storedItemsContainer = this.add.container(50, 50).setDepth(500);

        // Itens de jogo (grid, sprites, footprint) → ignorados pela UI camera
        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.sprites,
            this.footprintGraphics
        ]);

        // Itens de UI (menus, labels, etc) → ignorados pela main camera
        this.cameraController.ignoreInMainCamera([
            this.topUI.containerUI,
            this.bottomMenu.containerUI,
            this.matrixGraphics,
            this.matrixLabel,
            this.shopMenu.container
        ]);

        this.uiBlocker = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0)
            .setOrigin(0)
            .setScrollFactor(0)     // não se move com a câmera
            .setDepth(9999)        // acima de tudo
            .setInteractive()      // captura todos os cliques
            .setVisible(false);

        this.gridUtils.drawFootprints();
        this.input.setDraggable(this.sprites);

        this.input.on('pointerup', (pointer, objs, event) => {
            if (this.shopMenu.isOpen() && this.selectedSprite && this.selectedSprite.isMoving) {
                const sprite = this.selectedSprite;

                let willDestroy = !sprite.originalPosition;

                if (!willDestroy) {
                    sprite.x = sprite.originalPosition.x;
                    sprite.y = sprite.originalPosition.y;
                    sprite.clearTint();
                } else {

                    sprite.destroy();

                    this.sprites = this.sprites.filter(s => s && s !== sprite && !s.destroyed);
                }

                this.selectedSprite = null;

                if (!willDestroy) sprite.isMoving = false;

                this.sprites.forEach(s => {
                    if (s && !s.destroyed) {
                        s.setInteractive({ useHandCursor: true });
                    }
                });

                this.gridUtils.drawFootprints();
            }
        });


        this.input.on('pointerup', (pointer, objs, event) => {

            // if (this.scene.ignoreNextPointerUp) return;

            if (this.freeClick) {
                this.freeClick = false;
                return;
            }

            if (this.middleButtonDown) return;

            if (this.itemMenuUI.itemMenu.visible) return;

            const sprite = this.selectedSprite;
            if (!sprite || !sprite.isMoving) return;

            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            const endX = startX + w - 1;
            const endY = startY + h - 1;

            const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, endX, endY, sprite);
            if (ocupado) {
                console.log("❌ Tile ocupado — revertendo sprite.");
                return;
            }

            const snapped = this.gridUtils.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
            sprite.x = snapped.x;
            sprite.y = snapped.y;
            this.gridUtils.clearOccupied(sprite);
            this.gridUtils.markOccupied(sprite, startX, startY, w, h);

            sprite.lastFreePos = { startX, startY };

            sprite.clearTint();
            sprite.isMoving = false;
            this.selectedSprite = null;
            sprite.setDepth(1000);
            for (let other of this.sprites) {
                other.setInteractive({ useHandCursor: true });
            }

            this.uiBlocker.setVisible(false);
            this.gridUtils.drawFootprints();
            console.log("moveu")
        });

        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 1) {
                this.middleButtonDown = true;
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (pointer.button === 1) {
                this.middleButtonDown = false;
                // this.freeClick = true;
            }
        });


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

            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y, this.gridSize, this.offsetX, this.offsetY);
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            sprite.lastFreePos = { startX, startY };

            // Remove qualquer ocupação prévia (caso de bug visual)
            this.gridUtils.clearOccupied(sprite);

            // Checa colisão imediatamente
            const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

            // Desabilita interação dos outros enquanto arrasta
            for (let other of this.sprites) {
                if (other !== sprite) other.disableInteractive();
            }

            if (!this.sprites) this.sprites = [];
            this.sprites.push(sprite);

            this.cameraController.ignoreInUICamera([...this.sprites])

            console.log("🛒 Novo item comprado, pronto pra posicionar.");
        });

        // this.uiBlocker.on('pointerup', () => {
        //     if (!this.selectedSprite) {
        //         this.uiBlocker.setVisible(false)
        //     }
        // });
    }

    update() {

        if (this.selectedSprite && this.selectedSprite.isMoving) {
            const sprite = this.selectedSprite;
            const pointer = this.input.activePointer;

            if (this.middleButtonDown) return;

            // converte para iso usando pointer
            let iso = this.gridUtils.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight - h) + (h / 2 - 0.5);

            const snapped = this.gridUtils.isoToScreen(iso.x, iso.y);
            sprite.x = snapped.x;
            sprite.y = snapped.y;

            // checa ocupação
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            const occupied = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            this.gridUtils.drawFootprints();
        }
    }

    addGameSprite(key, x, y, scale = 0.5) {
        const sprite = this.add.sprite(x, y, key).setScale(scale).setInteractive({ useHandCursor: true });

        sprite.isMoving = false;
        sprite.isDraggable = true;

        // guarda posição inicial
        this.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });

        this.sprites.push(sprite);

        this.input.setDraggable(sprite);

        // this.uiBlocker.setVisible(true);

        // evento para abrir o menu contextual (mesma lógica que usava)
        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (this.middleButtonDown) return;

            if (!sprite.isMoving) {
                this.selectedSprite = sprite;
                // this.camScrollX = this.cameraController.mainCamera.scrollX;
                // this.camScrollY = this.cameraController.mainCamera.scrollY;
                // console.log(this.camScrollX, this.camScrollY);
                this.itemMenuUI.show(this.selectedSprite.x, this.selectedSprite.y, this.selectedSprite);
                console.log(pointer)
                // this.itemMenu.setVisible(true);
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

}

// this.sprites.push(this.addGameSprite('cow', 400, 300, 0.3));
// this.sprites.push(this.addGameSprite('chicken.png', 420, 300, 0.12));
// this.sprites.push(this.addGameSprite('macieira.png', 500, 500, 0.50).setOrigin(0.5, 0.8));
// this.sprites.push(this.addGameSprite('porco', 440, 300, 0.5));
// this.sprites.push(this.addGameSprite('trator.png', 500, 250, 0.5));
// this.sprites.push(this.addGameSprite('armazem.png', 700, 250, 0.5));

// 🔹 Cria o menu de item (Mover, Vender, Guardar)
// this.itemMenu = this.add.container(0, 0).setDepth(2000).setVisible(false);
// const bgx = this.add.rectangle(0, 0, 80, 80, 0x000000, 0.7).setOrigin(0);
// bgx.setStrokeStyle(1, 0xffffff, 0.5);

// const btnMove = this.createButton('Mover', 40, 15);
// // const btnSell = this.createButton('Vender', 40, 40);
// const btnRotate = this.createButton('Girar', 40, 65);
// // const btnStore = this.createButton('Guardar', 40, 65);

// this.itemMenu.add([bgx, btnMove, btnRotate]);


// btnMove.on('pointerup', () => {
//     this.itemMenu.setVisible(false);
//     if (this.selectedSprite) {
//         const sprite = this.selectedSprite;
//         sprite.isMoving = true;
//         sprite.setDepth(2000);

//         for (let other of this.sprites) {
//             if (other !== sprite) {
//                 other.disableInteractive();
//             }
//         }

//         sprite.clearTint();
//         this.finishMoveClick = true;
//         console.log("vai mover")
//     }
// });

// Botão Vender
// btnSell.on('pointerup', () => {
//     console.log("Vendeu", this.selectedSprite.texture.key);
//     this.selectedSprite.destroy();
//     this.itemMenu.setVisible(false);
// });


// btnRotate.on('pointerup', () => {
//     const sprite = this.selectedSprite;
//     if (!sprite || !sprite.footprint) return;
//     this.itemMenu.setVisible(false);

//     // Armazena footprint original na primeira rotação
//     if (!sprite.originalFootprint) {
//         if (Array.isArray(sprite.footprint)) {
//             sprite.originalFootprint = [...sprite.footprint];
//         } else {
//             const { w, h } = sprite.footprint;
//             sprite.originalFootprint = [w, h];
//         }
//     }

//     // Alterna entre girado e original
//     if (sprite.isRotated) {
//         sprite.flipX = false;
//         sprite.isRotated = false;
//         sprite.footprint = [...sprite.originalFootprint];
//     } else {
//         sprite.flipX = true;
//         sprite.isRotated = true;
//         const [origW, origH] = sprite.originalFootprint;
//         sprite.footprint = [origH, origW];
//     }

//     // Recalcula posição no grid com footprint atualizado
//     const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
//     const [w, h] = sprite.footprint;
//     const startX = Math.round(iso.x - (w / 2 - 0.5));
//     const startY = Math.round(iso.y - (h / 2 - 0.5));

//     sprite.lastFreePos = { startX, startY };


//     const ocupado = this.this.gridUtils.checkOccupiedGrid(
//         startX,
//         startY,
//         startX + w - 1,
//         startY + h - 1,
//         sprite
//     );
//     if (ocupado) {

//         console.log("❌ Tile ocupado — revertendo sprite.");
//         this.selectedSprite.isMoving = true
//         return;

//     } else {
//         // Faz snap pro centro do tile válido
//         const snapped = this.gridUtils.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
//         sprite.x = snapped.x;
//         sprite.y = snapped.y;

//         // Atualiza ocupação
//         this.clearOccupied(sprite);
//         this.markOccupied(sprite, startX, startY, w, h);

//         sprite.lastFreePos = { startX, startY };
//         console.log("✅ Nova posição salva:", startX, startY);
//     }

//     // Reseta estado
//     sprite.clearTint();
//     this.selectedSprite = null;

//     sprite.setDepth(1000);

//     this.drawFootprints();
// });




// Botão Guardar
// btnStore.on('pointerup', () => {
//     if (!this.selectedSprite) return;
//     console.log("Guardou", this.selectedSprite.texture.key);
// });

// this.input.on('pointerup', (pointer, objs) => {
//     if (!objs.length) this.itemMenu.setVisible(false);
// });

// btnMove.on('pointerup', (pointer, localX, localY, event) => {
//     // Evita que o clique passe pra cena
//     event.stopPropagation();

//     this.itemMenu.setVisible(false);
//     if (this.selectedSprite) {
//         const sprite = this.selectedSprite;
//         sprite.isMoving = true;
//         sprite.setDepth(2000);

//         for (let other of this.sprites) {
//             if (other !== sprite) other.disableInteractive();
//         }

//         console.log("🟢 Modo mover ativado");
//     }
// });

// this.input.on('pointerup', (pointer, objs, event) => {
//     // Evita conflito com cliques de menu
//     if (this.itemMenuUI.isVisibile()) return;

//     const sprite = this.selectedSprite;
//     if (!sprite || !sprite.isMoving) return;

//     const { w, h } = this.this.gridUtils.getSpriteFootprint(sprite);

//     // Converte a posição atual do sprite para coordenadas ISO
//     const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);

//     // Calcula o tile inicial (canto superior esquerdo da footprint)
//     const startX = Math.round(iso.x - (w / 2 - 0.5));
//     const startY = Math.round(iso.y - (h / 2 - 0.5));
//     const endX = startX + w - 1;
//     const endY = startY + h - 1;

//     // Checa se há sobreposição com outros objetos
//     const ocupado = this.this.gridUtils.checkOccupiedGrid(startX, startY, endX, endY, sprite);
//     if (ocupado) {
//         console.log("❌ Tile ocupado — revertendo sprite.");
//         // if (sprite.lastFreePos) {
//         //     const snapped = this.gridUtils.isoToScreen(sprite.lastFreePos.startX + (w / 2 - 0.5), sprite.lastFreePos.startY + (h / 2 - 0.5));
//         //     sprite.x = snapped.x;
//         //     sprite.y = snapped.y;
//         // }
//         return;
//     } else {
//         // Faz snap pro centro do tile válido
//         const snapped = this.gridUtils.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
//         sprite.x = snapped.x;
//         sprite.y = snapped.y;

//         // Atualiza ocupação
//         this.clearOccupied(sprite);
//         this.markOccupied(sprite, startX, startY, w, h);

//         sprite.lastFreePos = { startX, startY };
//         console.log("✅ Nova posição salva:", startX, startY);
//     }

//     // Reseta estado
//     sprite.clearTint();
//     sprite.isMoving = false;
//     this.selectedSprite = null;
//     sprite.setDepth(1000);
//     for (let other of this.sprites) {
//         other.setInteractive({ useHandCursor: true });
//     }

//     this.drawFootprints();
// });





// createButton(text, x, y) {
//     const btn = this.add.text(x, y, text, {
//         fontSize: '12px',
//         color: '#fff',
//         backgroundColor: '#222',
//         padding: { left: 6, right: 6, top: 2, bottom: 2 },
//     }).setOrigin(0.5).setInteractive({ useHandCursor: true });

//     btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#444' }));
//     btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#222' }));
//     return btn;
// }

 // drawFootprints() {
    //     this.footprintGraphics.clear();
    //     for (let sprite of this.sprites) {
    //         const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
    //         const iso = this.gridUtils.screenToIso(sprite.x, sprite.y, this.gridSize, this.offsetX, this.offsetY);
    //         const startX = Math.round(iso.x - (w / 2 - 0.5));
    //         const startY = Math.round(iso.y - (h / 2 - 0.5));

    //         for (let i = 0; i < w; i++) {
    //             for (let j = 0; j < h; j++) {
    //                 const p1 = this.gridUtils.isoToScreen(startX + i, startY + j, this.gridSize, this.offsetX, this.offsetY);
    //                 const p2 = this.gridUtils.isoToScreen(startX + i + 1, startY + j, this.gridSize, this.offsetX, this.offsetY);
    //                 const p3 = this.gridUtils.isoToScreen(startX + i + 1, startY + j + 1, this.gridSize, this.offsetX, this.offsetY);
    //                 const p4 = this.gridUtils.isoToScreen(startX + i, startY + j + 1, this.gridSize, this.offsetX, this.offsetY);

    //                 this.footprintGraphics.fillStyle(0xff0000, 0.25);
    //                 this.footprintGraphics.beginPath();
    //                 this.footprintGraphics.moveTo(p1.x, p1.y);
    //                 this.footprintGraphics.lineTo(p2.x, p2.y);
    //                 this.footprintGraphics.lineTo(p3.x, p3.y);
    //                 this.footprintGraphics.lineTo(p4.x, p4.y);
    //                 this.footprintGraphics.closePath();
    //                 this.footprintGraphics.fillPath();
    //             }
    //         }
    //     }
    // }

    
    // drawMatrix() {
    //     this.matrixGraphics.clear();

    //     for (let y = 0; y < this.gridHeight; y++) {
    //         for (let x = 0; x < this.gridWidth; x++) {
    //             const occupied = this.gridMap[x][y] ? true : false;
    //             const color = occupied ? 0xe74c3c : 0x2ecc71;
    //             this.matrixGraphics.fillStyle(color, 1);
    //             this.matrixGraphics.fillRect(
    //                 this.matrixOffsetX + x * 10,
    //                 this.offsetY + y * 10,
    //                 10, 10
    //             );
    //         }
    //     }

    //     this.matrixGraphics.lineStyle(1, 0xffffff, 0.5);
    //     this.matrixGraphics.strokeRect(
    //         this.matrixOffsetX,
    //         this.offsetY,
    //         this.gridWidth * 10,
    //         this.gridHeight * 10
    //     );

    //     if (!this.matrixLabel) {
    //         this.matrixLabel = this.add.text(
    //             this.matrixOffsetX,
    //             this.offsetY - 20,
    //             'Matriz de ocupação',
    //             { fontSize: '14px', color: '#ffffff' }
    //         );
    //     }
    // }

    // markOccupied(sprite, startX, startY, w, h) {
    //     for (let x = startX; x < startX + w; x++) {
    //         for (let y = startY; y < startY + h; y++) {
    //             this.gridMap[x][y] = sprite;
    //         }
    //     }
    //     this.drawMatrix();
    // }

    // clearOccupied(sprite) {
    //     for (let x = 0; x < this.gridWidth; x++) {
    //         for (let y = 0; y < this.gridHeight; y++) {
    //             if (this.gridMap[x][y] === sprite) {
    //                 this.gridMap[x][y] = null;
    //             }
    //         }
    //     }
    //     this.drawMatrix();
    // }