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
        this.load.image('cerca_madeira_lado.png', 'assets/cerca_madeira_frente.png');
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
        this.gridLogicalSize = 16;
        this.gridWidth = 14;
        this.gridHeight = 14;
        this.offsetX = 550;
        this.offsetY = 200;

        this.gridLogicalWidth = this.gridWidth * this.logicFactor;
        this.gridLogicalHeight = this.gridHeight * this.logicFactor;

        this.gridMap = Array.from({ length: this.gridLogicalWidth }, () =>
            Array(this.gridLogicalHeight).fill(null)
        );

        console.log(this.gridMap);

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
        this.tileSize = this.gridSize;

        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.itemMenuUI = new ItemMenuUI(this);
        this.cameraController = new CameraController(this);
        this.selectedSprite = null;
        // this.storedItemsContainer = this.add.container(50, 50).setDepth(500);

        // this.bonecoController = new BonecoController(this);

        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.sprites,
            this.footprintGraphics,
            // this.bonecoController.boneco,
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
            if (this.arando || this.scene.ignoreNextPointerUp) return;
            if (this.freeClick || this.changeCameraZoom || this.middleButtonDown) return;
            if (this.itemMenuUI.itemMenu.visible) return;

            const sprite = this.selectedSprite;
            if (!sprite || !sprite.isMoving) return;

            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
            const logicFactor = this.gridSize / this.gridLogicalSize;

            // Coordenadas base do sprite
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));

            // Coordenadas no grid lógico
            const startLX = Math.round(startX * logicFactor);
            const startLY = Math.round(startY * logicFactor);
            const wL = Math.round(w * logicFactor);
            const hL = Math.round(h * logicFactor);

            // Checa se área está ocupada
            const ocupado = this.gridUtils.checkOccupiedGrid(startLX, startLY, wL, hL, sprite);
            console.log(ocupado);
            if (ocupado) {
                console.log("❌ Tile ocupado — revertendo sprite.");
                sprite.setTint(0xff8888);
                return;
            }

            // Snap visual
            const snapped = this.gridUtils.isoToScreen(startX + (w / 2 - 0.5), startY + (h / 2 - 0.5));
            sprite.x = snapped.x;
            sprite.y = snapped.y;

            // Atualiza ocupação lógica
            this.gridUtils.clearOccupied(sprite);
            this.gridUtils.markOccupied(sprite, startLX, startLY, wL, hL);

            sprite.lastFreePos = { startLX, startLY };
            sprite.clearTint();
            sprite.isMoving = false;

            this.gridUtils.recalculateDepthAround(sprite);
            this.selectedSprite = null;

            // Reativa interação de outros sprites
            for (let other of this.sprites) {
                other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
            }

            this.gridUtils.drawFootprints();
            console.log("✅ Sprite posicionado e marcado no grid lógico.");
        });



        // this.input.on('pointerdown', (pointer) => {
        //     if (pointer.button === 1) {
        //         this.middleButtonDown = true;
        //     }
        // });

        // this.input.on('pointerup', (pointer) => {
        //     if (pointer.button === 1) {
        //         this.middleButtonDown = false;
        //         if (this.arando) this.freeClick = true;
        //     }
        // });

        // this.input.on('pointerup', (pointer) => {

        //     if (!this.arando) return;

        //     if (this.freeClick) {
        //         console.log("clique de segurança!");
        //         this.freeClick = false;
        //         return;
        //     }

        //     if (this.changeCameraZoom) return;
        //     if (this.middleButtonDown) return;

        //     if (this.arando && this.previewOccupiedtiles) {
        //         console.log(this.previewOccupiedtiles)
        //         const startX = Math.min(...this.previewOccupiedtiles.map(t => t.x));
        //         const startY = Math.min(...this.previewOccupiedtiles.map(t => t.y));
        //         const endX = Math.max(...this.previewOccupiedtiles.map(t => t.x));
        //         const endY = Math.max(...this.previewOccupiedtiles.map(t => t.y));
        //         const w = endX - startX;
        //         const h = endY - startY;

        //         // Checa ocupação
        //         const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, w, h);
        //         if (ocupado) {
        //             console.log("❌ Não é possível arar aqui, algum tile já está ocupado.");
        //             return;
        //         }

        //         // Marca o chão
        //         this.gridUtils.markGround(startX, startY, w, h);

        //         console.log(`✅ Chão fixado em ${w}x${h} tiles a partir de (${startX},${startY})`);

        //         this.clearPreviewOccupiedTiles();
        //         this.gridUtils.drawFootprints();
        //     }
        // });

        // this.input.on("pointerup", (pointer) => {

        //     const data = {
        //         "id": "cerca_de_madeira",
        //         "nome": "Cerca de madeira",
        //         "preco_compra": 0,
        //         "preco_compra_grana": 0,
        //         "preco_venda": 0,
        //         "tempo_colheita_horas": 0,
        //         "xp": 0,
        //         "nivel_requerido": 4,
        //         "img": "cerca_madeira_lado.png",
        //         "escala": 0.4,
        //         "area": [2, 1]

        //     }

        //     this.events.emit('itemPurchased', data);
        // })

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            const scale = itemData.escala ?? 0.5;
            const originX = itemData.origem?.[0] ?? 0.5;
            const originY = itemData.origem?.[1] ?? 0.5;

            // Cria sprite no centro da tela
            const sprite = this.addGameSprite(itemData.img, this.scale.width / 2, this.scale.height / 2, scale, originX, originY);

            // Associa dados do item diretamente no sprite
            sprite.itemData = itemData;

            // Define footprint visual (para render/posição)
            sprite.footprint = [itemData.wV ?? 1, itemData.hV ?? 1];

            // Define footprint lógico (para checkOccupied e grid lógico)
            sprite.footprintLogical = [itemData.wL ?? 1, itemData.hL ?? 1];

            sprite.isMoving = true;
            sprite.setDepth(2000);
            this.selectedSprite = sprite;

            // Marca posição inicial (lógica)
            const iso = this.gridUtils.screenToIso(sprite.x, sprite.y, this.gridSize, this.offsetX, this.offsetY);
            const startX = Math.round(iso.x - (sprite.footprint[0] / 2 - 0.5));
            const startY = Math.round(iso.y - (sprite.footprint[1] / 2 - 0.5));
            sprite.lastFreePos = { startX, startY };

            // Remove ocupação prévia para evitar bug visual
            this.gridUtils.clearOccupied(sprite);

            // Checa se área está ocupada
            const logicFactor = this.gridSize / this.gridLogicalSize;
            const startLX = Math.round(startX * logicFactor);
            const startLY = Math.round(startY * logicFactor);
            const wL = sprite.footprintLogical[0];
            const hL = sprite.footprintLogical[1];

            const ocupado = this.gridUtils.checkOccupiedGrid(startLX, startLY, wL, hL, sprite);
            sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

            // Desabilita interação dos outros enquanto arrasta
            for (let other of this.sprites) {
                if (other !== sprite) other.disableInteractive();
            }

            if (!this.sprites) this.sprites = [];
            this.sprites.push(sprite);

            this.cameraController.ignoreInUICamera([...this.sprites]);

            console.log("🛒 Novo item comprado, pronto pra posicionar.");
        });

    }

    update() {
        this.updateArando();

        if (this.selectedSprite && this.selectedSprite.isMoving) {
            const sprite = this.selectedSprite;
            const pointer = this.input.activePointer;

            if (this.middleButtonDown || this.freeClick) return;

            // Conversão de coordenadas para o grid isométrico
            let iso = this.gridUtils.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);
            const logicFactor = this.gridSize / this.gridLogicalSize;

            // Mantém dentro dos limites do grid
            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight - h) + (h / 2 - 0.5);

            // Converte de volta para tela
            const snapped = this.gridUtils.isoToScreen(iso.x, iso.y);
            sprite.x = snapped.x;
            sprite.y = snapped.y;

            // Calcula posição lógica
            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            const startLX = Math.round(startX * logicFactor);
            const startLY = Math.round(startY * logicFactor);
            const wL = Math.round(w * logicFactor);
            const hL = Math.round(h * logicFactor);

            // Verifica se o espaço está livre
            const occupied = this.gridUtils.checkOccupiedGrid(startLX, startLY, wL, hL, sprite);
            sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            // Atualiza preview dos footprints
            this.gridUtils.drawFootprints();
        }
    }



    addGameSprite(key, x, y, scale = 0.5, originX = 0.5, originY = 0.5) {
        const sprite = this.add.sprite(x, y, key)
            .setScale(scale)
            .setInteractive({
                pixelPerfect: true,
                alphaTolerance: 1,
                useHandCursor: true
            })
            .setOrigin(originX, originY);

        sprite.isMoving = false;
        sprite.isDraggable = true;

        // guarda posição inicial
        this.spriteInitialPositions.set(sprite, { x: sprite.x, y: sprite.y });

        if (!this.sprites) this.sprites = [];
        this.sprites.push(sprite);

        this.input.setDraggable(sprite);

        // evento para abrir o menu contextual
        sprite.on('pointerup', (pointer) => {
            pointer.event.stopPropagation();

            if (this.middleButtonDown) return;

            // só seleciona se não estiver em movimento
            if (!sprite.isMoving) {
                this.selectedSprite = sprite;
                this.itemMenuUI.show(this.selectedSprite.x, this.selectedSprite.y, this.selectedSprite);
            }
        });

        // highlight visual
        sprite.on("pointerover", () => {
            if (!sprite.isMoving) sprite.setTint(0xffff00);
        });

        sprite.on("pointerout", () => {
            if (!sprite.isMoving) sprite.clearTint();
        });

        // opcional: inicializa footprint padrão se não tiver
        if (!sprite.footprint) sprite.footprint = [1, 1];

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
            { x: startX, y: startY },     // topo esquerdo
            { x: startX + 2, y: startY },     // topo direito
            { x: startX + 2, y: startY + 2 }, // baixo direito
            { x: startX, y: startY + 2 }, // baixo esquerdo
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

    gridStart() {
        this.gridGraphics.lineStyle(1, 0x00ff00, 0.3);
        for (let x = 0; x < this.gridWidth * 2; x++) {
            for (let y = 0; y < this.gridHeight * 2; y++) {
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
    }

}
