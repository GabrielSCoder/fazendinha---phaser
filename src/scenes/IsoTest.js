import ShopMenu from '../ShopMenu.js';
import TopUI from "../TopUI.js";
import CameraController from "../CameraController.js";
import BottomMenu from '../bottomMenu.js';
import ItemMenuUI from '../ItemMenuUI.js';
import GridUtils from "../GridUtils.js";
import BonecoController from '../BonecoController.js';
import SpriteUtils from '../spriteUtils.js';
import AcoesUtils from "../AcoesUtils.js";
import GameVariablesController from '../GameVariablesController.js';
import GameEventsController from '../GameEventsController.js';
import ActionQueue from '../ActionQueueController.js';

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

        this.load.image('boneco_frente', 'assets/boneco/boneco_frente.png');
        this.load.image('boneco_costas', 'assets/boneco/boneco_tras.png');

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

        this.gameVariables = new GameVariablesController(this);
        this.gridUtils = new GridUtils(this);
    }

    create() {

        this.gridSize = this.gameVariables.gridSize;
        this.gridWidth = this.gameVariables.gridWidth;
        this.gridHeight = this.gameVariables.gridHeight;
        this.offsetX = this.gameVariables.offsetX;
        this.offsetY = this.gameVariables.offsetY;
        this.logicFactor = this.gameVariables.logicFactor;

        this.gridMap = this.gameVariables.gridMap;
        this.matrixGraphics = this.add.graphics();
        this.matrixGraphics.setVisible(false);
        this.matrixOffsetX = this.offsetX - 500
        this.gridUtils.drawMatrix();

        this.gridGraphics = this.add.graphics();

        this.footprintGraphics = this.add.graphics();

        this.matrixLabel = this.add.text(
            this.matrixOffsetX,
            this.offsetY - 20,
            'Matriz de ocupação',
            { fontSize: '14px', color: '#ffffff' }
        ).setVisible(false);

        this.gridUtils.gridStart();

        this.queue = new ActionQueue();
        this.topUI = new TopUI(this);
        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu });
        this.cameraController = new CameraController(this);
        this.itemMenuUI = new ItemMenuUI(this);

        this.selectedSprite = this.gameVariables.selectedSprite;
        this.selectedSeed = this.gameVariables.selectedSeed;
        this.collisionDataTemp = this.gameVariables.collisionDataTemp;
        this.toolSprite = this.gameVariables.toolSprite;

        this.spriteUtils = new SpriteUtils(this);
        this.acoesUtils = new AcoesUtils(this);
        this.gameEvents = new GameEventsController(this);


        this.bonecoController = new BonecoController(this);

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
            this.gameVariables.sprites,
            this.footprintGraphics,
            this.bonecoController.boneco,
            this.gameVariables.previewTiles,
            this.hoverText
        ]);

        this.cameraController.ignoreInMainCamera([
            this.topUI.containerUI,
            this.bottomMenu.containerUI,
            this.matrixGraphics,
            this.matrixLabel,
            this.shopMenu.container,
            this.fpsText
        ]);


        this.input.setDraggable(this.gameVariables.sprites);

        this.input.on("pointerup", () => {
            this.gameEvents.colocarCercasCheck();
        });

        this.input.on('pointerup', () => {
            this.gameEvents.abrirLojaCheck();
        });

        this.input.on('pointerup', (pointer, objs, event) => {
            this.gameEvents.fixarObjetoCheck();
        });

        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 1) {
                this.gameVariables.middleButtonDown = true;
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (pointer.button === 1) {
                this.gameVariables.middleButtonDown = false;
                if (this.gameVariables.arando) this.gameVariables.freeClick = true;
            }
        });

        this.input.on('pointerup', (pointer) => {
            this.gameEvents.ararSoloCheck()
        });

        this.input.on('pointerup', () => {
            this.queue.add((done) => {
                this.gameEvents.plantarSementeCheck()
                done();
            })
        })

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            this.acoesUtils.comprarItem(itemData)
        });

    }

    update() {

        const fps = Math.floor(this.game.loop.actualFps);
        this.fpsText.setText(`FPS: ${fps}`);

        this.acoesUtils.updateSelling();

        this.acoesUtils.updateFence();

        this.acoesUtils.updateArando();

        this.bonecoController.update();
        // this.getSpriteByPointerPosition();

        this.acoesUtils.updateSprite();

        this.acoesUtils.updateSeed();

    }


}