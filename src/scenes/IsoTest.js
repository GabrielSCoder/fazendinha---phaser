import ShopMenu from '../ShopMenu.js';
import TopUI from "../TopUI.js";
import CameraController from "../CameraController.js";
import BottomMenu from '../bottomMenu.js';
import ItemMenuUI from '../ItemMenuUI.js';
import gridUtils from "../GridUtils.js";
import BonecoController from '../BonecoController.js';

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

        this.load.image('cerca_branca.png', 'assets/cerca_branca.png');
        this.load.image('cerca_madeira_unico.png', 'assets/cerca_branca101.png');
        this.load.image('cerca_madeira_CD.png', 'assets/cerca_branca_102.png');
        this.load.image('cerca_madeira_CE.png', 'assets/cerca_branca_103.png');
        this.load.image('cerca_madeira_CE_canto_inferior.png', 'assets/cerca_madeira_CE_canto_inferior.png');
        this.load.image('toquinho.png', 'assets/toquinho.png');

        this.load.image('boneco_frente', 'assets/boneco_frente.png');
        this.load.image('boneco_costas', 'assets/boneco_tras.png');
        this.load.image('bangalo', 'assets/bangalo.png');

        this.load.image('frame1', 'assets/anim/frame_01.png');
        this.load.image('frame2', 'assets/anim/frame_02.png');
        this.load.image('frame3', 'assets/anim/frame_03.png');
        this.load.image('frame4', 'assets/anim/frame_04.png');

        this.load.image('back_frame0', 'assets/anim/back/frame_0.png');
        this.load.image('back_frame1', 'assets/anim/back/frame_1.png');
        this.load.image('back_frame2', 'assets/anim/back/frame_2.png');
        this.load.image('back_frame3', 'assets/anim/back/frame_3.png');

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

        this.gridSize = 32;
        this.gridWidth = 14;
        this.gridHeight = 14;
        this.offsetX = 550;
        this.offsetY = 200;
        this.logicFactor = 2;        // quantas células lógicas cabem em 1 tile visual

        this.gridMap = Array.from({ length: this.gridWidth * this.logicFactor },
            () => Array(this.gridHeight * this.logicFactor).fill(null));

        this.matrixGraphics = this.add.graphics();
        this.matrixOffsetX = this.offsetX - 500
        this.gridUtils.drawMatrix();

        this.gridGraphics = this.add.graphics();

        this.footprintGraphics = this.add.graphics();

        this.gridStart();

        this.sprites = [];
        this.spriteInitialPositions = new Map();
        this.middleButtonDown = false;
        this.freeClick = false; //Um clique a mais. Parece não necessário quando o input.on esta no mesmo arquivo que essa cena.
        this.ignoreNextPointerUp = false;
        this.changeCameraZoom = false;
        this.arando = false;
        this.previewTiles = [];
        this.previewOccupiedtiles = [];
        this.fenceSnapTarget = null;
        this.tileSize = this.gridSize;

        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.itemMenuUI = new ItemMenuUI(this);
        this.cameraController = new CameraController(this);
        this.selectedSprite = null;
        this.collisionDataTemp = null;
        // this.storedItemsContainer = this.add.container(50, 50).setDepth(500);

        this.bonecoController = new BonecoController(this);

        this.fpsText = this.add.text(10, 10, '', {
            font: '16px Arial',
            fill: '#00ff00'
        });

        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.sprites,
            this.footprintGraphics,
            this.bonecoController.boneco,
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

        // this.gridUtils.drawCharFootprints();
        this.input.setDraggable(this.sprites);

        this.input.on("pointerup", () => {

            if (this.selectedSprite?.tipo === "cerca" && this.fenceSnapTarget && this.collisionDataTemp) {

                const sprite = this.selectedSprite;

                const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

                const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
                const startX = Math.round(iso.x - (w / 2 - 0.5));
                const startY = Math.round(iso.y - (h / 2 - 0.5));

                sprite.gridX = Math.round(iso.x);
                sprite.gridY = Math.round(iso.y);

                this.gridUtils.clearOccupied(sprite);
                this.gridUtils.markOccupied(sprite, startX, startY, w, h);

                sprite.lastFreePos = { startX, startY };

                sprite.clearTint();
                sprite.isMoving = false;
                this.gridUtils.recalculateDepthAround(sprite);
                this.selectedSprite = null;
                this.gridUtils.drawFootprints();

                for (let other of this.sprites) {
                    other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
                }
            }
        });


        // this.input.on('pointerup', (pointer, objs, event) => {

        //     if (this.shopMenu.isOpen() && this.arando) {
        //         this.cancelArar();
        //     }

        //     if (this.shopMenu.isOpen() && this.selectedSprite && this.selectedSprite.isMoving) {
        //         const sprite = this.selectedSprite;

        //         let willDestroy = !sprite.originalPosition;

        //         if (!willDestroy) {
        //             sprite.x = sprite.originalPosition.x;
        //             sprite.y = sprite.originalPosition.y;
        //             sprite.clearTint();
        //         } else {

        //             sprite.destroy();

        //             this.sprites = this.sprites.filter(s => s && s !== sprite && !s.destroyed);
        //         }

        //         this.gridUtils.recalculateDepthAround(sprite);
        //         this.selectedSprite = null;

        //         if (!willDestroy) sprite.isMoving = false;

        //         this.sprites.forEach(s => {
        //             if (s && !s.destroyed) {
        //                 s.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        //             }
        //         });

        //         this.gridUtils.drawFootprints();
        //     }
        // });


        this.input.on('pointerup', (pointer, objs, event) => {

            if (this.fenceSnapTarget && this.collisionDataTemp) {
                this.fenceSnapTarget = null;
                this.collisionDataTemp = null;
                return;
            }

            const resp = this.breakConditions();

            if (!resp) return;

            const sprite = this.selectedSprite;

            // if (sprite.tipo === "cerca") return;

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

            sprite.gridX = Math.round(iso.x);
            sprite.gridY = Math.round(iso.y);

            this.gridUtils.clearOccupied(sprite);
            this.gridUtils.markOccupied(sprite, startX, startY, w, h);

            sprite.lastFreePos = { startX, startY };

            sprite.clearTint();
            sprite.isMoving = false;
            this.gridUtils.recalculateDepthAround(sprite);

            if (sprite.tipo === "cerca")
                this.gridUtils.ReOccupiedFences();
            
            this.selectedSprite = null;
            this.gridUtils.drawFootprints();

            for (let other of this.sprites) {
                other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
            }

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

            if (this.arando && this.previewOccupiedtiles?.length) {
                const startX = Math.min(...this.previewOccupiedtiles.map(t => t.x));
                const startY = Math.min(...this.previewOccupiedtiles.map(t => t.y));
                const endX = Math.max(...this.previewOccupiedtiles.map(t => t.x));
                const endY = Math.max(...this.previewOccupiedtiles.map(t => t.y));

                // 🧩 Corrigido — adiciona +1 ao tamanho
                const w = endX - startX;
                const h = endY - startY;

                console.log(`Tentando marcar área de ${w}x${h} a partir de (${startX}, ${startY})`);

                // Checa ocupação
                const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, w, h);

                if (ocupado) {
                    console.log("❌ Não é possível arar aqui, algum tile já está ocupado.");
                    return;
                }

                // Marca o chão
                this.gridUtils.markGround(startX, startY, w, h);

                console.log(`✅ Chão fixado em ${w}x${h} tiles a partir de (${startX}, ${startY})`);

                this.clearPreviewOccupiedTiles();
                this.gridUtils.drawFootprints();
            }
        });


        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            const scale = itemData.escala;
            let originX = 0.5;
            let originY = 0.5;
            let tipo = "normal";

            if (itemData.origem) {
                originX = itemData.origem[0];
                originY = itemData.origem[1];
            }

            if (!itemData.tipo) {
                itemData.tipo = tipo;
            }

            console.log(itemData.tipo)

            const sprite = this.addGameSprite(itemData.img, this.scale.width / 2, this.scale.height / 2, scale, originX, originY);
            if (itemData.area) {
                sprite.footprint = itemData.area;
                sprite.tipo = itemData.tipo;
            }

            sprite.isMoving = true;
            sprite.setDepth(2000);
            this.selectedSprite = sprite;

            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
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

        const fps = Math.floor(this.game.loop.actualFps);
        this.fpsText.setText(`FPS: ${fps}`);

        this.updateFence();

        // this.updateArando();

        // this.bonecoController.update();
        // this.getSpriteByPointerPosition();


        if (this.selectedSprite && this.selectedSprite.isMoving) {
            const sprite = this.selectedSprite;
            const pointer = this.input.activePointer;

            if (this.middleButtonDown) return;

            if (this.freeClick) return;

            // converte para iso usando pointer
            let iso = this.gridUtils.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);

            this.convert(iso, sprite)

            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            // this.gridUtils.recalculateDepthAround(sprite);

            const occupied = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            // sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            this.gridUtils.drawSpriteFootprint(sprite);
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

    cancelArar() {
        this.arando = false;
        this.clearPreviewTiles();
        this.previewOccupiedtiles = [];
        for (let other of this.sprites) {
            other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }

    updateFence() {
        const sprite = this.selectedSprite;
        if (!sprite || sprite.tipo !== "cerca") return;

        // if (sprite.collisions) {
        //     sprite.collisions.forEach(collision => {
        //         const { x, y } = collision.contactPoint;
        //         this.gridUtils.addOccupiedTile(x, y, collision.col);
        //     });
        //     sprite.collisions = [];
        // }

        sprite.setTint(0xffffff);

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        let foundSnap = false;
        let targetFence = null;

        let possibleSnaps = [];
        for (let gx = startX; gx < startX + w; gx++) {
            for (let gy = startY; gy < startY + h; gy++) {
                if (gx < 0 || gy < 0 || gx > this.gridWidth * this.logicFactor - 1 || gy > this.gridHeight * this.logicFactor - 1) continue;

                const cell = this.gridMap[gx]?.[gy];
                if (cell && cell.tipo === "cerca" && cell.lastFreePos !== sprite.lastFreePos) {
                    const canSnap = this.gridUtils.canSnapFence(sprite, cell);
                    if (canSnap) {
                        possibleSnaps.push({ cell, data: canSnap });
                    }
                }
            }
        }

        if (possibleSnaps.length === 1) {
            console.log("1")
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.fenceSnapTarget = possibleSnaps[0].cell;
            this.collisionDataTemp = possibleSnaps[0].data;
        } else if (possibleSnaps.length === 2) {
            console.log("2");
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.fenceSnapTarget = possibleSnaps.map(s => s.cell);
            this.collisionDataTemp = possibleSnaps.map(s => s.data);
        } else {
            console.log("nenhum encontrado")
            sprite.setTint(0xffaaaa);
            this.fenceSnapTarget = null;
        }
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

        // Novo tamanho do campo arado (4x4)
        const fieldSize = 4;

        // Verifica se algum tile dentro da área 4x4 está ocupado
        const occupied = this.gridUtils.checkOccupiedGrid(
            startX,
            startY,
            startX + fieldSize - 1,
            startY + fieldSize - 1,
            null
        );

        // Calcula os 4 cantos externos do bloco 4x4 no espaço isométrico
        const cornersIso = [
            { x: startX, y: startY },                     // topo esquerdo
            { x: startX + fieldSize, y: startY },         // topo direito
            { x: startX + fieldSize, y: startY + fieldSize }, // baixo direito
            { x: startX, y: startY + fieldSize }          // baixo esquerdo
        ];

        // Converte os cantos de isométrico para tela
        const cornersScreen = cornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));

        // Cria o polígono do preview
        const points = [];
        for (const c of cornersScreen) {
            points.push(c.x, c.y);
        }

        const tile = this.add
            .polygon(0, 0, points, occupied ? 0xff0000 : 0x00ff00, 0.5)
            .setOrigin(0, 0);

        this.previewOccupiedtiles = cornersIso;
        this.previewTiles.push(tile);
        this.cameraController.ignoreInUICamera([tile]);
    }


    getSpriteByPointerPosition() {

        if (!this.gridMap || !this.gridMap.length) return;

        const pointer = this.input.activePointer;

        const cam = this.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        // Converter coordenadas de tela -> grid
        const iso = this.gridUtils.screenToIso(
            worldPoint.x,
            worldPoint.y
        );

        const tileX = Math.floor(iso.x);
        const tileY = Math.floor(iso.y);

        if (tileX < 1 || tileX > this.gridWidth * this.logicFactor - 1 || tileY < 1 || tileY > this.gridHeight * this.logicFactor - 1) return;

        const cell = this.gridMap[tileX][tileY];

        console.log(cell);

        if (cell != null && cell.tipo == "cerca") return cell;

        return null;
    }

    gridStart() {
        const g = this.gridGraphics;
        g.clear();

        // Define cor e opacidade de preenchimento (verde translúcido, por ex.)
        const fillColor = 0x00ff00;
        const fillAlpha = 0.15;

        for (let x = 0; x < this.gridWidth * 2; x++) {
            for (let y = 0; y < this.gridHeight * 2; y++) {
                const p1 = this.gridUtils.isoToScreen(x, y, this.gridSize, this.offsetX, this.offsetY);
                const p2 = this.gridUtils.isoToScreen(x + 1, y, this.gridSize, this.offsetX, this.offsetY);
                const p3 = this.gridUtils.isoToScreen(x + 1, y + 1, this.gridSize, this.offsetX, this.offsetY);
                const p4 = this.gridUtils.isoToScreen(x, y + 1, this.gridSize, this.offsetX, this.offsetY);

                g.beginPath();
                g.moveTo(p1.x, p1.y);
                g.lineTo(p2.x, p2.y);
                g.lineTo(p3.x, p3.y);
                g.lineTo(p4.x, p4.y);
                g.closePath();

                // Preenche a célula
                // g.fillStyle(fillColor, fillAlpha);
                // g.fillPath();

                // (Opcional) desenha contorno leve
                g.lineStyle(1, 0x00ff00, 0.3);
                g.strokePath();
            }
        }
    }

    convertToPlace(sprite) {
        const offsetX = (w % 2 === 0) ? 0.5 : 0;
        const offsetY = (h % 2 === 0) ? 0.5 : 0;
        let snapped = null;
        let multiFactor = 0;

        if (sprite.tipo === "cerca") {
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + 0.5, Math.floor(iso.y) + 0.5);
            multiFactor = this.gridSize * 0.20;
        } else {
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + offsetX, Math.floor(iso.y) + offsetY);
            multiFactor = this.gridSize * 0.12;
        }

        sprite.x = snapped.x;
        sprite.y = snapped.y + multiFactor;

        sprite.gridX = Math.round(iso.x);
        sprite.gridY = Math.round(iso.y);
    }

    convert(iso, sprite) {
        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
        const offsetX = (w % 2 === 0) ? 0.5 : 0;
        const offsetY = (h % 2 === 0) ? 0.5 : 0;
        let snapped = null;
        let multiFactor = 0;

        if (sprite.tipo === "cerca") {
            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x), Math.floor(iso.y));
            multiFactor = this.gridSize * 0.20

            sprite.x = snapped.x;
            sprite.y = snapped.y - multiFactor;

        } else if (sprite.tipo === "solo") {
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + offsetX, Math.floor(iso.y) + offsetY);
            sprite.x = snapped.x;
            sprite.y = snapped.y + this.gridSize * 0.12;
        } else {
            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);
            snapped = this.gridUtils.isoToScreen(Math.floor(iso.x) + offsetX, Math.floor(iso.y) + offsetY);
            sprite.x = snapped.x;
            sprite.y = snapped.y + multiFactor;
        }
    }

    breakConditions() {
        if (this.arando) return false;

        if (this.scene.ignoreNextPointerUp) return false;

        if (this.freeClick) {
            console.log("free click")
            this.freeClick = false;
            return false;
        }

        if (this.changeCameraZoom) return false;

        if (this.middleButtonDown) return false;

        if (this.itemMenuUI.itemMenu.visible) return false;

        if (!this.selectedSprite || !this.selectedSprite.isMoving) return false;

        return true;
    }
}