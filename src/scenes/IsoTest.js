import ShopMenu from '../ShopMenu.js';
import TopUI from "../TopUI.js";
import CameraController from "../CameraController.js";
import BottomMenu from '../bottomMenu.js';
import ItemMenuUI from '../ItemMenuUI.js';
import gridUtils from "../GridUtils.js";
import BonecoController from '../BonecoController.js';
import { sementes, solos } from '../objects.js';
import SpriteUtils from '../spriteUtils.js';

export class IsoTest extends Phaser.Scene {
    constructor() {
        super('IsoTest');
    }

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');

        this.load.image('abacaxi.png', 'assets/semente/icone_abacaxi.png');
        this.load.image('abobora.png', 'assets/semente/icone_abobora.png');
        this.load.image('abobora_moranga.png', 'assets/semente/icone_abobora_moranga.png');
        this.load.image('algodao.png', 'assets/semente/icone_algodao.png');
        this.load.image('alho.png', 'assets/semente/icone_alho.png');
        this.load.image('amora.png', 'assets/semente/icone_amora.png');
        this.load.image('arroz.png', 'assets/semente/icone_arroz.png');
        this.load.image('uva.png', 'assets/semente/icone_uva.png');
        this.load.image('framboesa.png', 'assets/semente/icone_framboesa.png');
        this.load.image('batata_inglesa.png', 'assets/semente/icone_batata_inglesa.png');
        this.load.image('batata_doce.png', 'assets/semente/icone_batata_doce.png');
        this.load.image('cebola.png', 'assets/semente/icone_cebola.png');
        this.load.image('berinjela.png', 'assets/semente/icone_berinjela.png');
        this.load.image('beterraba.png', 'assets/semente/icone_beterraba.png');
        this.load.image('cafe.png', 'assets/semente/icone_cafe.png');
        this.load.image('couve_flor.png', 'assets/semente/icone_couve_flor.png');
        this.load.image('girassol.png', 'assets/semente/icone_girassol.png');
        this.load.image('melancia.png', 'assets/semente/icone_melancia.png');
        this.load.image('milho.png', 'assets/semente/icone_milho.png');
        this.load.image('mirtilo.png', 'assets/semente/icone_mirtilo.png');
        this.load.image('morango.png', 'assets/semente/icone_morango.png');
        this.load.image('nabo.png', 'assets/semente/icone_nabo.png');
        this.load.image('pimenta.png', 'assets/semente/icone_pimenta.png');
        this.load.image('pimentao.png', 'assets/semente/icone_pimentao.png');
        this.load.image('rabanete.png', 'assets/semente/icone_rabanete.png');
        this.load.image('trigo.png', 'assets/semente/icone_trigo.png');
        this.load.image('cenoura.png', 'assets/semente/icone_cenoura.png');
        this.load.image('soja.png', 'assets/semente/icone_soja.png');
        this.load.image('tomate.png', 'assets/semente/icone_tomate.png');
        this.load.image('alcachofra.png', 'assets/semente/icone_alcachofra.png');
        this.load.image('espinafre.png', 'assets/semente/icone_espinafre.png');
        this.load.image('aloe_vera.png', 'assets/semente/icone_aloe_vera.png');


        this.load.image('menu_bg', 'assets/ui/fundo_madeira.jpg');
        this.load.image('item_bg', 'assets/ui/fundo_item_loja.png');
        this.load.image('item_bloqueado', 'assets/ui/bloqueado_ui.png');
        this.load.image('categoria_bg', 'assets/ui/categoria_fundo.png');
        this.load.image('gold_icon', 'assets/ui/gold.png');
        this.load.image('cash_icon', 'assets/ui/cash.png');
        this.load.image('clock_icon', 'assets/ui/clock2.png');
        this.load.image('close_button', 'assets/ui/close.png');
        this.load.image('proximo_button', 'assets/ui/proximo.png');
        this.load.image('anterior_button', 'assets/ui/anterior.png');
        this.load.image('enxada', 'assets/ui/enxada.png');
        this.load.image('pa', 'assets/ui/pazinha.png');

        this.load.image('macieira.png', 'assets/arvore/macieira.png');
        this.load.image('pereira.png', 'assets/arvore/pereira.png');
        this.load.image('abrico.png', 'assets/arvore/abrico.png');
        this.load.image('cerejeira.png', 'assets/arvore/cerejeira.png');
        this.load.image('coqueiro.png', 'assets/arvore/coqueiro.png');
        this.load.image('nectarina.png', 'assets/arvore/nectarina.png');
        this.load.image('pessegueiro.png', 'assets/arvore/pessegueiro.png');
        this.load.image('laranjeira.png', 'assets/arvore/laranjeira.png');

        this.load.image('cerca_branca.png', 'assets/decoracao/cerca_branca.png');
        this.load.image('carro.png', 'assets/decoracao/carro.png');
        this.load.image('cerca_verde.png', 'assets/decoracao/cerca_verde.png');
        this.load.image('galinheiro.png', 'assets/decoracao/galinheiro.png');
        this.load.image('estufa.png', 'assets/decoracao/estufa.png');
        this.load.image('moinho.png', 'assets/decoracao/moinho.png');
        this.load.image('armazem.png', 'assets/decoracao/super_armazem.png');
        this.load.image('estabulo', 'assets/decoracao/estabulo.png');
        this.load.image('bangalo', 'assets/decoracao/bangalo.png');

        this.load.image('boneco_frente', 'assets/boneco_frente.png');
        this.load.image('boneco_costas', 'assets/boneco_tras.png');

        this.load.image('frame1', 'assets/anim/frame_01.png');
        this.load.image('frame2', 'assets/anim/frame_02.png');
        this.load.image('frame3', 'assets/anim/frame_03.png');
        this.load.image('frame4', 'assets/anim/frame_04.png');

        this.load.image('back_frame0', 'assets/anim/back/frame_0.png');
        this.load.image('back_frame1', 'assets/anim/back/frame_1.png');
        this.load.image('back_frame2', 'assets/anim/back/frame_2.png');
        this.load.image('back_frame3', 'assets/anim/back/frame_3.png');

        this.load.image('trator.png', 'assets/veiculo/trator.png');
        this.load.image('trator2.png', 'assets/veiculo/trator2.png');
        this.load.image('trator3.png', 'assets/veiculo/trator3.png');

        this.load.image('solo.png', 'assets/solo/solo_preparado.png');
        this.load.image('solo_plantado_simples.png', 'assets/solo/solo_plantado_simples.png');
        this.load.image('solo_seco', 'assets/solo/solo_seco.png');
        this.load.image('solo_alagado', 'assets/solo/solo_alagado.png');
        this.load.image('solo_alagado_2', 'assets/solo/solo_alagado_2.png');

        this.load.image('vaca.png', 'assets/animal/vaca.png');
        this.load.image('galo.png', 'assets/animal/galo.png');
        this.load.image('ovelha.png', 'assets/animal/ovelha.png');
        this.load.image('porco.png', 'assets/animal/porco.png');

        this.gridUtils = new gridUtils(this);
        this.spriteUtils = new SpriteUtils(this);
    }

    create() {

        this.gridSize = 32;
        this.gridWidth = 14;
        this.gridHeight = 14;
        this.offsetX = 550;
        this.offsetY = 200;
        this.logicFactor = 2;

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
        this.freeClick = false;
        this.ignoreNextPointerUp = false;
        this.changeCameraZoom = false;
        this.arando = false;
        this.previewTiles = [];
        this.previewOccupiedtiles = [];
        this.fenceSnapTarget = null;
        this.tileSize = this.gridSize;
        this.buyItemTmp = null
        this.planting = false;
        this.plantingBar = false;
        this.hoverEnabled = true;

        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.itemMenuUI = new ItemMenuUI(this);
        this.cameraController = new CameraController(this);
        this.selectedSprite = null;
        this.selectedSeed = null;
        this.collisionDataTemp = null;
        // this.storedItemsContainer = this.add.container(50, 50).setDepth(500);

        // this.bonecoController = new BonecoController(this);

        this.fpsText = this.add.text(10, 10, '', {
            font: '16px Arial',
            fill: '#00ff00'
        });

        this.hoverText = this.add.text(0, 0, "", {
            fontSize: "12px",
            fontFamily: "Arial",
            color: "#ffffff",
            padding: { x: 6, y: 3 }
        })
            .setDepth(10000)
            .setVisible(false);

        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.sprites,
            this.footprintGraphics,
            // this.bonecoController.boneco,
            this.previewTiles,
            this.hoverText
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
                sprite.setAlpha(1);

                sprite.lastFreePos = { startX, startY };

                sprite.clearTint();
                sprite.isMoving = false;
                this.gridUtils.recalculateDepthAround(sprite);
                this.selectedSprite = null;
                this.gridUtils.drawFootprints();

                this.ativarInteratividadeItens();

                if (this.buyItemTmp) {
                    console.log(this.buyItemTmp)
                    this.events.emit("itemPurchased", this.buyItemTmp)
                }
            }
        });


        this.input.on('pointerup', () => {

            if (this.shopMenu.isOpen() && this.planting) {
                const sprite = this.selectedSeed;
                sprite.destroy();
                this.sprites = this.sprites.filter(s => s && s !== sprite && !s.destroyed);
                this.planting = false;
                this.sprites.forEach(s => {
                    if (s && !s.destroyed) {
                        s.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
                    }
                });

            }

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

                    this.buyItemTmp = null;
                    sprite.destroy();

                    this.sprites = this.sprites.filter(s => s && s !== sprite && !s.destroyed);
                }

                this.gridUtils.recalculateDepthAround(sprite);
                this.selectedSprite = null;

                if (!willDestroy) sprite.isMoving = false;

                this.sprites.forEach(s => {
                    if (s && !s.destroyed) {
                        s.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
                    }
                });

                this.gridUtils.drawFootprints();
            }
        });


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
            sprite.setAlpha(1);
            sprite.isMoving = false;
            this.gridUtils.recalculateDepthAround(sprite);

            if (sprite.tipo === "cerca")
                this.gridUtils.ReOccupiedFences();

            this.selectedSprite = null;
            this.gridUtils.drawFootprints();

            this.ativarInteratividadeItens();

            if (this.buyItemTmp) {
                console.log(this.buyItemTmp)
                this.events.emit("itemPurchased", this.buyItemTmp)
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


            this.ararSolo();

        });

        this.input.on('pointerup', () => {
            if (!this.planting) return;
            if (!this.selectedSprite) return;
            if (this.selectedSprite.nome != "solo_preparado") return;
            if (!this.selectedSeed) return;

            console.log(this.selectedSprite.nome)

            const solo = this.selectedSprite;

            const startX = solo.x - 100 / 2
            const startY = solo.y - solo.displayHeight / 2

            solo.setAlpha(0.7);
            solo.disableInteractive();
            this.setHoverEnabled(false);

            if (!this.plantingBar)
                this.criarBarraProgresso(startX, startY, 50, 10, 1.8, () => {
                    this.plantarSemente();
                    this.setHoverEnabled(true);
                });
        })

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            this.comprarItem(itemData)
        });

    }

    update() {

        const fps = Math.floor(this.game.loop.actualFps);
        this.fpsText.setText(`FPS: ${fps}`);

        this.updateFence();

        this.updateArando();

        // this.bonecoController.update();
        // this.getSpriteByPointerPosition();

        this.updateSprite();

        this.updateSeed();

    }

    setHoverEnabled(enabled) {
        this.hoverEnabled = enabled;

        if (!enabled) {
            this.hoverText.setVisible(false);
            this.input.manager.canvas.style.cursor = "default";
        }
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
        this.ativarInteratividadeItens();
    }

    updateSeed() {
        if (!this.planting) return;
        if (!this.selectedSeed) return;

        const sprite = this.selectedSeed;

        const pointer = this.input.activePointer;

        sprite.x = pointer.worldX + 20
        sprite.y = pointer.worldY
    }

    stopSeed() {
        if (!this.planting) return;
        if (!this.selectedSeed) return;
        this.selectedSeed.setDepth(2000);
        // const sprite_del = this.selectedSeed;
        // sprite_del.destroy();
        // this.sprites = this.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        this.selectedSprite = null;

        this.ativarInteratividadeItensPorNome("solo_prepadado");

        // this.planting = false;
    }

    updateFence() {
        const sprite = this.selectedSprite;
        if (!sprite || sprite.tipo !== "cerca") return;

        sprite.setTint(0xffffff);

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        let foundSnap = false;
        let possibleSnaps = [];
        let cols = []
        for (let gx = startX; gx < startX + w; gx++) {
            for (let gy = startY; gy < startY + h; gy++) {
                if (gx < 0 || gy < 0 || gx > this.gridWidth * this.logicFactor - 1 || gy > this.gridHeight * this.logicFactor - 1) continue;
                const cell = this.gridMap[gx]?.[gy];
                if (cell && cell.tipo === "cerca" && cell.lastFreePos !== sprite.lastFreePos) {
                    cols.push(cell);
                }
            }
        }

        if (cols.length && cols.length === 1) {
            const cell = cols[0];
            const canSnap = this.gridUtils.canSnapFence(sprite, cell);
            if (canSnap) {
                possibleSnaps.push({ cell, data: canSnap });
            }
        } else if (cols.length && cols.length === 2) {
            const [f1, f2] = cols;
            const canLink = this.gridUtils.canConnectBetweenFences(sprite, f1, f2);
            if (canLink) {
                possibleSnaps.push({ cell: f1, data: canLink });
            }
        }

        if (possibleSnaps.length === 1) {
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.fenceSnapTarget = possibleSnaps[0].cell;
            this.collisionDataTemp = possibleSnaps[0].data;
        } else if (possibleSnaps.length === 2) {
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

    updateSprite() {

        if (this.planting) return;

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


    updateArando(blocksWide = 1, blocksHigh = 1) {
        if (this.middleButtonDown) return;
        if (!this.arando) return;

        const pointer = this.input.activePointer;
        const cam = this.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const startX = Math.floor(iso.x);
        const startY = Math.floor(iso.y);

        this.clearPreviewTiles();

        const blockSize = 4; // tamanho fixo de um "solo"
        const totalWidth = blockSize * blocksWide;
        const totalHeight = blockSize * blocksHigh;

        const outerCornersIso = [
            { x: startX, y: startY },
            { x: startX + totalWidth, y: startY },
            { x: startX + totalWidth, y: startY + totalHeight },
            { x: startX, y: startY + totalHeight }
        ];
        const outerCornersScreen = outerCornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));
        const outerPoints = [];
        for (const c of outerCornersScreen) outerPoints.push(c.x, c.y);

        // === Desenhar os sub-blocos individualmente ===
        this.previewOccupiedtiles = []; // limpa antes de preencher
        for (let bx = 0; bx < blocksWide; bx++) {
            for (let by = 0; by < blocksHigh; by++) {

                const sx = startX + bx * blockSize;
                const sy = startY + by * blockSize;

                const isOccupied = this.gridUtils.checkOccupiedGrid(
                    sx, sy,
                    sx + blockSize - 1,
                    sy + blockSize - 1,
                    null
                );

                const fillColor = isOccupied ? 0xaa0000 : 0x00aa00; // escuro
                const borderColor = isOccupied ? 0xff6666 : 0x66ff66; // claro

                const cornersIso = [
                    { x: sx, y: sy },
                    { x: sx + blockSize, y: sy },
                    { x: sx + blockSize, y: sy + blockSize },
                    { x: sx, y: sy + blockSize }
                ];
                const cornersScreen = cornersIso.map(c => this.gridUtils.isoToScreen(c.x, c.y));
                const points = [];
                for (const c of cornersScreen) points.push(c.x, c.y);

                const tile = this.add
                    .polygon(0, 0, points, fillColor, 0.35)
                    .setStrokeStyle(1, borderColor, 0.9)
                    .setOrigin(0, 0);

                this.previewTiles.push(tile);
                this.cameraController.ignoreInUICamera([tile]);

                this.previewOccupiedtiles.push({ x: sx, y: sy, w: blockSize, h: blockSize, occupied: isOccupied });
            }
        }

        const outerBorder = this.add
            .polygon(0, 0, outerPoints, 0x000000, 0)
            .setStrokeStyle(2, 0xffffff, 0.7)
            .setOrigin(0, 0);

        this.previewTiles.push(outerBorder);
        this.cameraController.ignoreInUICamera([outerBorder]);
    }


    getSpriteByPointerPosition() {

        if (!this.gridMap || !this.gridMap.length) return;

        const pointer = this.input.activePointer;

        const cam = this.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

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
                g.fillStyle(fillColor, fillAlpha);
                g.fillPath();

                // (Opcional) desenha contorno leve
                g.lineStyle(1, 0x00ff00, 0.3);
                g.strokePath();
            }
        }
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

        if (this.planting) return false;

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

    criarBarraProgresso(x, y, largura, altura, duracaoSegundos, funcao) {
        if (this.plantingBar) return;

        this.plantingBar = true;

        // === Cria gráficos ===
        const barra = this.add.graphics();
        barra.fillStyle(0x000000, 0.5);
        barra.fillRect(x, y, largura, altura);
        barra.setAlpha(0);

        const progresso = this.add.graphics();
        progresso.setAlpha(0);

        barra.setDepth(1999)
        progresso.setDepth(1999)

        this.cameraController.ignoreInUICamera([progresso, barra]);

        this.tweens.add({
            targets: [barra, progresso],
            alpha: 1,
            duration: 300,
            ease: "Sine.easeOut"
        });

        // === Controle de progresso ===
        let elapsed = 0;
        const timer = this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                elapsed += 0.1;
                const ratio = Phaser.Math.Clamp(elapsed / duracaoSegundos, 0, 1);

                progresso.clear();
                progresso.fillStyle(0xeb4034);
                progresso.fillRect(x + 1, y + 1, (largura - 2) * ratio, altura - 2);

                if (ratio >= 1) {
                    // Finaliza barra quando completa
                    timer.remove();

                    // Faz um fade-out suave
                    this.tweens.add({
                        targets: [barra, progresso],
                        alpha: 0,
                        duration: 500,
                        ease: "Sine.easeIn",
                        onComplete: () => {
                            barra.destroy();
                            progresso.destroy();
                            this.plantingBar = false;
                            if (typeof funcao === "function") {
                                funcao.call(this);
                            }
                        }
                    });
                }
            }
        });

        return { barra, progresso };
    }

    plantarSemente() {
        if (!this.selectedSeed || !this.selectedSprite || this.selectedSprite.nome != "solo_preparado") return;
        const semente = this.selectedSeed;
        const tipo_plantacao = semente.tipo_plantacao;

        if (!tipo_plantacao) return;

        const itemData = solos.find(solo => solo.nome === tipo_plantacao);

        if (!itemData) return;

        const sprite_del = this.selectedSprite;
        sprite_del.destroy();
        this.sprites = this.sprites.filter(s => s && s !== sprite_del && !s.destroyed);

        const scale = itemData.escala || 1;
        const originX = itemData.origem?.[0] ?? 0.5;
        const originY = itemData.origem?.[1] ?? 0.5;
        const tipo = itemData.tipo || "solo";

        const { w, h } = this.gridUtils.getSpriteFootprint(itemData);

        const iso = this.gridUtils.screenToIso(sprite_del.x, sprite_del.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        const screenPos = this.gridUtils.isoToScreen(iso.x, iso.y);

        const sprite = this.spriteUtils.addGameSprite(itemData, screenPos.x, screenPos.y, scale, originX, originY);

        sprite.footprint = itemData.area || [w, h];
        sprite.tipo = tipo;
        sprite.gridX = Math.round(startX + w * 0.5 - 0.5);
        sprite.gridY = Math.round(startY + h * 0.5 - 0.5);
        sprite.lastFreePos = { startX, startY };
        sprite.isMoving = false;
        sprite.nome = itemData.nome
        sprite.plantado = true
        sprite.plata_cultivada = semente.nome;

        if (!this.sprites) this.sprites = [];
        this.sprites.push(sprite);
        this.cameraController.ignoreInUICamera([...this.sprites])

        this.gridUtils.clearOccupied(sprite);
        this.gridUtils.markOccupied(sprite, startX, startY, w, h);
        this.gridUtils.recalculateDepthAround(sprite);

        this.stopSeed();
    }

    ararSolo() {

        if (this.arando && this.previewOccupiedtiles?.length) {

            const itemData = solos.find(c => c.nome == "solo_preparado");
            if (!itemData) return;

            const scale = itemData.escala || 1;
            const originX = itemData.origem?.[0] ?? 0.5;
            const originY = itemData.origem?.[1] ?? 0.5;
            const tipo = itemData.tipo || "solo";

            const blockSize = 4;

            // Guarda os blocos efetivamente ocupados
            const placedTiles = [];

            for (const tile of this.previewOccupiedtiles) {
                const startX = tile.startX ?? tile.x;
                const startY = tile.startY ?? tile.y;

                // Evita processar a mesma posição duas vezes
                if (placedTiles.some(t => t.startX === startX && t.startY === startY)) continue;

                const endX = startX + blockSize - 1;
                const endY = startY + blockSize - 1;

                const ocupado = this.gridUtils.checkOccupiedBlock(startX, startY, blockSize, blockSize);
                if (ocupado) {
                    console.log(`❌ Bloco em (${startX}, ${startY}) já ocupado — ignorando.`);
                    continue;
                }

                // Marca o solo como arado
                this.gridUtils.markGround(startX, startY, blockSize, blockSize);

                const w = blockSize;
                const h = blockSize;

                const centerX = startX + (w / 2) - (1 - originX - 0.25);
                const centerY = startY + (h / 2) - (1 - originY - 0.18);

                const screenPos = this.gridUtils.isoToScreen(centerX, centerY);

                const sprite = this.spriteUtils.addGameSprite(itemData, screenPos.x, screenPos.y, scale, originX, originY);

                sprite.footprint = itemData.area || [w, h];
                sprite.tipo = tipo;
                sprite.gridX = Math.round(startX + w * 0.5 - 0.5);
                sprite.gridY = Math.round(startY + h * 0.5 - 0.5);
                sprite.lastFreePos = { startX, startY };
                sprite.isMoving = false;
                sprite.nome = itemData.nome || "solo_preparado";

                if (!this.sprites) this.sprites = [];
                this.sprites.push(sprite);

                // Atualiza ocupação e profundidade
                this.gridUtils.clearOccupied(sprite);
                this.gridUtils.markOccupied(sprite, startX, startY, w, h);
                this.gridUtils.recalculateDepthAround(sprite);

                // Guarda os tiles efetivamente ocupados para referência futura
                placedTiles.push({ startX, startY, endX, endY });
            }

            // Substitui o previewOccupiedtiles pelos blocos que realmente foram colocados
            this.previewOccupiedtiles = placedTiles;

            if (placedTiles.length > 0) {
                this.cameraController.ignoreInUICamera([...this.sprites]);
                console.log(`✅ ${placedTiles.length} blocos de solo colocados corretamente no grid.`);
            } else {
                console.log("⚠ Nenhum bloco válido para arar.");
            }
        }
    }

    comprarItem(itemData) {

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

        if (itemData.noStopBuy) this.buyItemTmp = itemData;

        const sprite = this.spriteUtils.addGameSprite(itemData, this.scale.width / 2, this.scale.height / 2, scale, originX, originY);

        if (itemData.area) {
            sprite.footprint = itemData.area;
            sprite.tipo = itemData.tipo;
        }

        sprite.setAlpha(0.7);
        sprite.nome = itemData.nome;
        sprite.isMoving = true;
        sprite.setDepth(2000);

        if (sprite.tipo === "semente") {
            sprite.tipo_plantacao = itemData.tipo_plantacao
            this.selectedSeed = sprite
            sprite.setAlpha(1);
        }
        else
            this.selectedSprite = sprite;

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        sprite.lastFreePos = { startX, startY };

        this.gridUtils.clearOccupied(sprite);

        const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
        sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

        if (sprite.tipo !== "semente") {
            for (let other of this.sprites) {
                if (other !== sprite) other.disableInteractive();
            }
        }
        else {
            for (let other of this.sprites) {
                if (other !== sprite && other.nome !== "solo_preparado") other.disableInteractive();
            }
        }


        if (!this.sprites) this.sprites = [];
        this.sprites.push(sprite);

        this.cameraController.ignoreInUICamera([...this.sprites])

        console.log("🛒 Novo item comprado, pronto pra posicionar.");
    }

    desativarInteratividadeItens() {
        for (let other of this.sprites) {
            if (other !== this.selectedSprite) other.disableInteractive();
        }
    }


    desativarInteratividadeItensExceto(nome) {
        for (let other of this.sprites) {
            if (other !== this.selectedSprite && other.nome !== nome) other.disableInteractive();
        }
    }

    ativarInteratividadeItens() {
        for (let other of this.sprites) {
            other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }

    ativarInteratividadeItensPorNome(nome) {
        for (let other of this.sprites) {
            if (other.nome === nome) other.setInteractive({ pixelPerfect: true, alphaTolerance: 1, useHandCursor: true });
        }
    }
}