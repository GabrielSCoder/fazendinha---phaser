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
         this.load.image('cerejeira.png', 'assets/cerejeira.png');
        this.load.image('abacaxi.png', 'assets/abacaxi.png');
        this.load.image('armazem.png', 'assets/super_armazem.png');
        this.load.image('estabulo', 'assets/estabulo.png');
        this.load.image('menu_bg', 'assets/fundo_madeira.jpg');
        this.load.image('item_bg', 'assets/fundo_item_loja.png');
        this.load.image('item_bloqueado', 'assets/bloqueado_ui.png');
        this.load.image('categoria_bg', 'assets/categoria_fundo.png');
        this.load.image('vaca.png', 'assets/vaca.png');
        this.load.image('gold_icon', 'assets/gold.png');
        this.load.image('cash_icon', 'assets/cash.png');
        this.load.image('clock_icon', 'assets/clock2.png');
        this.load.image('close_button', 'assets/close.png');
        this.load.image('proximo_button', 'assets/proximo.png');
        this.load.image('anterior_button', 'assets/anterior.png');
        this.load.image('macieira.png', 'assets/tree.png');
        this.load.image('planta1.png', 'assets/plantas1.png');
        this.load.image('cerca_madeira_lado.png', 'assets/cerca_madeira_lado.png');
        this.load.image('boneco_frente', 'assets/boneco_frente.png');
        this.load.image('bangalo', 'assets/bangalo.png');

        this.load.image('enxada', 'assets/enxada.png');

        this.load.image('solo', 'assets/solo_original2.png');
        this.load.image('solo2', 'assets/solo.png');
        this.load.image('cow', 'assets/vaca.png');
        this.load.image('trator.png', 'assets/trator.png');
        this.load.image('trator2.png', 'assets/trator2.png');
        this.load.image('trator3.png', 'assets/trator3.png');
        this.load.image('super_armazem', 'assets/super_armazem.png');
        this.load.image('chicken.png', 'assets/galo.png');
        this.load.image('ovelha.png', 'assets/ovelha.png');
        this.load.image('porco.png', 'assets/porco.png');
        this.gridUtils = new gridUtils(this);
    }

    create() {

        this.gridSize = 64;
        this.gridWidth = 14;
        this.gridHeight = 14;
        this.offsetX = 550;
        this.offsetY = 200;

        this.gridMap = Array.from({ length: this.gridWidth }, () =>
            Array(this.gridHeight).fill(null)
        );

        this.matrixGraphics = this.add.graphics();
        this.matrixOffsetX = this.offsetX - 500
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

        const bonecoData = {
            img: 'boneco_frente',
            escala: 0.5,
            area: [1, 1],
            origem: [0.5, 0.7]
        };

        // Posição central do grid
        const centerX = Math.floor(this.gridWidth / 2);
        const centerY = Math.floor(this.gridHeight / 2);

        // Converte para coordenadas de tela
        const screenPos = this.gridUtils.isoToScreen(centerX, centerY, this.gridSize, this.offsetX, this.offsetY);

        // Cria o sprite
        this.boneco = this.add.sprite(screenPos.x, screenPos.y, bonecoData.img)
            .setScale(bonecoData.escala)
            .setOrigin(bonecoData.origem[0], bonecoData.origem[1])
            .setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });

        // Marca que pode se mover
        this.boneco.isMoving = false;
        this.boneco.path = [];
        this.boneco.currentStep = 0;

        // Guarda footprint
        this.boneco.footprint = bonecoData.area;

        // Se quiser já marcar o centro como ocupado
        this.gridUtils.markOccupied(this.boneco, centerX, centerY, bonecoData.area[0], bonecoData.area[1]);

        this.footprintGraphics = this.add.graphics();

        this.sprites = [];
        this.spriteInitialPositions = new Map();
        this.middleButtonDown = false;
        this.freeClick = false; //Um clique a mais. Parece não necessário quando o input.on esta no mesmo arquivo que essa cena.
        this.ignoreNextPointerUp = false;
        this.changeCameraZoom = false;
        this.arando = false;
        this.previewTiles = [];
        this.previewOccupiedtiles = [];
        this.tileSize = this.gridSize;

        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.itemMenuUI = new ItemMenuUI(this);
        this.cameraController = new CameraController(this);
        this.selectedSprite = null;
        // this.storedItemsContainer = this.add.container(50, 50).setDepth(500);

        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.sprites,
            this.footprintGraphics,
            this.boneco,
            this.previewTiles
        ]);

        this.cameraController.ignoreInMainCamera([
            this.topUI.containerUI,
            this.bottomMenu.containerUI,
            this.matrixGraphics,
            this.matrixLabel,
            this.shopMenu.container
        ]);

        this.uiBlocker = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0)
            .setOrigin(0)
            .setScrollFactor(0)     
            .setDepth(9999)        
            .setInteractive()      
            .setVisible(false);

        this.gridUtils.drawCharFootprints();
        this.input.setDraggable(this.sprites);

        // this.input.on('pointerdown', (pointer) => {

        //     if (this.middleButtonDown) return;

        //     if (this.shopMenu.isOpen() && this.boneco.isMoving) {
        //         this.boneco.path = []
        //         this.boneco.isMoving = false;
        //         this.boneco.currentStep = 0
        //         return;
        //     }

        //     if (this.shopMenu.isOpen() && this.boneco.path.length > 0 && this.boneco.isMoving) return;

        //     if (!this.boneco) return;
        //         const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        //         const targetIso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y, this.gridSize, this.offsetX, this.offsetY);
        //         const target = { x: Math.round(targetIso.x), y: Math.round(targetIso.y) };

        //         const startIso = this.gridUtils.screenToIso(this.boneco.x, this.boneco.y, this.gridSize, this.offsetX, this.offsetY);
        //         const start = { x: Math.round(startIso.x), y: Math.round(startIso.y) };

        //         const path = this.gridUtils.findPath(start, target, {
        //             width: this.gridWidth,
        //             height: this.gridHeight,
        //             isOccupied: (x, y) => this.gridUtils.checkOccupiedGrid(x, y, x, y, this.boneco)
        //         });

        //         if (path.length > 0) {
        //             this.boneco.path = path;
        //             this.boneco.currentStep = 0;
        //             this.boneco.isMoving = true;
        //             console.log("Path do boneco:", path);
        //         }
        //         this.gridUtils.drawPathDebug(path);
        // });




        this.input.on('pointerup', (pointer, objs, event) => {

            if (this.shopMenu.isOpen() && this.arando) {
                this.cancelArar();
            }

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

                this.gridUtils.recalculateDepthAround(sprite);
                this.selectedSprite = null;

                if (!willDestroy) sprite.isMoving = false;

                this.sprites.forEach(s => {
                    if (s && !s.destroyed) {
                        s.setInteractive({ pixelPerfect: true, alphaTolerance: 1,  useHandCursor: true});
                    }
                });

                this.gridUtils.drawFootprints();
            }
        });


        this.input.on('pointerup', (pointer, objs, event) => {

            if (this.arando) return;

            if (this.scene.ignoreNextPointerUp) return;

            if (this.freeClick) {
                console.log("free click")
                this.freeClick = false;
                return;
            }

            if (this.changeCameraZoom) return;

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
            this.gridUtils.recalculateDepthAround(sprite);
            this.selectedSprite = null;
            // sprite.setDepth(1000);

            for (let other of this.sprites) {
                other.setInteractive({ pixelPerfect: true, alphaTolerance: 1,  useHandCursor: true});
            }

            // this.uiBlocker.setVisible(false);
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
                if (this.arando) this.freeClick = true;
            }
        });

        this.input.on('pointerup', (pointer) => {

            if (!this.arando) return;

            if (this.freeClick) {
                console.log("clique de segurança!");
                this.freeClick = false;
                return;
            }

            if (this.changeCameraZoom) return;
            if (this.middleButtonDown) return;

            if (this.arando && this.previewOccupiedtiles) {
                console.log(this.previewOccupiedtiles)
                const startX = Math.min(...this.previewOccupiedtiles.map(t => t.x));
                const startY = Math.min(...this.previewOccupiedtiles.map(t => t.y));
                const endX   = Math.max(...this.previewOccupiedtiles.map(t => t.x));
                const endY   = Math.max(...this.previewOccupiedtiles.map(t => t.y));
                const w = endX - startX;
                const h = endY - startY;

                // Checa ocupação
                const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, w, h);
                if (ocupado) {
                    console.log("❌ Não é possível arar aqui, algum tile já está ocupado.");
                    return;
                }

                // Marca o chão
                this.gridUtils.markGround(startX, startY, w, h);

                console.log(`✅ Chão fixado em ${w}x${h} tiles a partir de (${startX},${startY})`);

                this.clearPreviewOccupiedTiles();
                this.gridUtils.drawFootprints();
            }
        });

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            const scale = itemData.escala;
            let originX = 0.5;
            let originY = 0.5;

            if (itemData.origem) {
                originX = itemData.origem[0];
                originY = itemData.origem[1];
            }

            const sprite = this.addGameSprite(itemData.img, this.scale.width / 2, this.scale.height / 2, scale, originX, originY);
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

    }

    update() {

        this.updateArando();

        this.updateBoneco();

        if (this.selectedSprite && this.selectedSprite.isMoving) {
            const sprite = this.selectedSprite;
            const pointer = this.input.activePointer;

            if (this.middleButtonDown) return;

            if (this.freeClick) return;

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

    addGameSprite(key, x, y, scale = 0.5, originX, originY) {
        const sprite = this.add.sprite(x, y, key).setScale(scale).setInteractive({
            pixelPerfect: true,
            alphaTolerance: 1,
            useHandCursor: true
        }).setOrigin(originX, originY);

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
                this.itemMenuUI.show(this.selectedSprite.x, this.selectedSprite.y, this.selectedSprite);
                console.log(pointer)
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

    startArando() {
        this.arando = true;
    }

    stopArando() {
        this.arando = false;
        this.clearPreviewTiles();
    }

    // Limpa previews antigos
    clearPreviewTiles() {
        for (let tile of this.previewTiles) {
            tile.destroy();
        }
        this.previewTiles = [];
    }

    clearPreviewOccupiedTiles() {
        this.previewOccupiedtiles = [];
    }

    cancelArar()
    {
        this.arando = false;
        this.clearPreviewTiles();
        this.previewOccupiedtiles = [];
    }

    updateArando() {

        if (this.middleButtonDown) return;
        if (!this.arando) return;

        const pointer = this.input.activePointer;
        const cam = this.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const startX = Math.floor(iso.x);
        const startY = Math.floor(iso.y);

        this.clearPreviewTiles();

        const ts = this.gridSize;

        // Checa se algum dos 4 tiles está ocupado
        const occupied = this.gridUtils.checkOccupiedGrid(startX, startY, startX + 1, startY + 1, null);

        // Calcula os 4 cantos externos do bloco 2x2 no espaço isométrico
        const cornersIso = [
            { x: startX,     y: startY },     // topo esquerdo
            { x: startX + 2, y: startY },     // topo direito
            { x: startX + 2, y: startY + 2 }, // baixo direito
            { x: startX,     y: startY + 2 }, // baixo esquerdo
        ];

        const cornersScreen = cornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));

        const points = [];
        for (const c of cornersScreen) {
            points.push(c.x, c.y);
        }

        const tile = this.add.polygon(0, 0, points, occupied ? 0xff0000 : 0x00ff00, 0.5)
            .setOrigin(0, 0);

        this.previewOccupiedtiles = cornersIso;
        this.previewTiles.push(tile);
        this.cameraController.ignoreInUICamera([tile]);
    }

    updateBoneco() {
        if (this.boneco && this.boneco.path && this.boneco.path.length > 0) {
            const step = this.boneco.path[this.boneco.currentStep];

            if (step) {
                const screenPos = this.gridUtils.isoToScreen(step.x, step.y, this.gridSize, this.offsetX, this.offsetY);
                const dx = screenPos.x - this.boneco.x;
                const dy = screenPos.y - this.boneco.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const speed = 3;

                if (dist < 2) {
                    this.boneco.currentStep++;
                    if (this.boneco.currentStep >= this.boneco.path.length) {
                        this.boneco.path = [];
                        this.boneco.isMoving = false;
                    }
                } else {
                    this.boneco.x += (dx / dist) * speed;
                    this.boneco.y += (dy / dist) * speed;
                }
            }
            // this.gridUtils.drawCharFootprints();
        }
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