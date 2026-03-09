import ShopMenu from '../ui/ShopMenu.js';
import TopUI from "../ui/TopUI.js";
import CameraController from "../controllers/CameraController.js";
import BottomMenu from '../ui/BottomMenu.js';
import ItemMenuUI from '../ui/ItemMenuUI.js';
import GridUtils from "../utils/GridUtils.js";
import BonecoController from '../controllers/BonecoController.js';
import SpriteUtils from '../ui/SpriteUtils.js';
import AcoesUtils from "../utils/AcoesUtils.js";
import GameVariablesController from '../controllers/GameVariablesController.js';
import GameEventsController from '../controllers/GameEventsController.js';
import ActionQueue from '../controllers/ActionQueueController.js';
import PlantaController from '../controllers/PlantaController.js';
import VendaController from '../controllers/Vendacontroller.js';
import SoloController from '../controllers/SoloController.js';
import InteractController from '../controllers/InteractController.js';
import SpriteController from '../controllers/SpriteController.js';
import ControlBar from '../ui/ControlBar.js';
import GrowthController from '../controllers/GrowthController.js';
import { colher, plantar_solo } from '../msgs.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');

        this.load.image('semente_abacaxi', 'assets/semente/icone_abacaxi.png');
        this.load.image('semente_abobora', 'assets/semente/icone_abobora.png');
        this.load.image('semente_abobora_moranga', 'assets/semente/icone_abobora_moranga.png');
        this.load.image('semente_algodao', 'assets/semente/icone_algodao.png');
        this.load.image('semente_alho', 'assets/semente/icone_alho.png');
        this.load.image('semente_amora', 'assets/semente/icone_amora.png');
        this.load.image('semente_arroz', 'assets/semente/icone_arroz.png');
        this.load.image('semente_uva', 'assets/semente/icone_uva.png');
        this.load.image('semente_framboesa', 'assets/semente/icone_framboesa.png');
        this.load.image('semente_batata_inglesa', 'assets/semente/icone_batata_inglesa.png');
        this.load.image('semente_batata_doce', 'assets/semente/icone_batata_doce.png');
        this.load.image('semente_cebola', 'assets/semente/icone_cebola.png');
        this.load.image('semente_berinjela', 'assets/semente/icone_berinjela.png');
        this.load.image('semente_beterraba', 'assets/semente/icone_beterraba.png');
        this.load.image('semente_cafe', 'assets/semente/icone_cafe.png');
        this.load.image('semente_couve_flor', 'assets/semente/icone_couve_flor.png');
        this.load.image('semente_girassol', 'assets/semente/icone_girassol.png');
        this.load.image('semente_melancia', 'assets/semente/icone_melancia.png');
        this.load.image('semente_milho', 'assets/semente/icone_milho.png');
        this.load.image('semente_mirtilo', 'assets/semente/icone_mirtilo.png');
        this.load.image('semente_morango', 'assets/semente/icone_morango.png');
        this.load.image('semente_nabo', 'assets/semente/icone_nabo.png');
        this.load.image('semente_pimenta', 'assets/semente/icone_pimenta.png');
        this.load.image('semente_pimentao', 'assets/semente/icone_pimentao.png');
        this.load.image('semente_rabanete', 'assets/semente/icone_rabanete.png');
        this.load.image('semente_trigo', 'assets/semente/icone_trigo.png');
        this.load.image('semente_cenoura', 'assets/semente/icone_cenoura.png');
        this.load.image('semente_soja', 'assets/semente/icone_soja.png');
        this.load.image('semente_tomate', 'assets/semente/icone_tomate.png');
        this.load.image('semente_alcachofra', 'assets/semente/icone_alcachofra.png');
        this.load.image('semente_espinafre', 'assets/semente/icone_espinafre.png');
        this.load.image('semente_aloe_vera', 'assets/semente/icone_aloe_vera.png');

        this.load.image('pronto_abacaxi', 'assets/solo/solo_pronto/solo_pronto_abacaxi.png');
        this.load.image('pronto_abobora', 'assets/solo/solo_pronto/solo_pronto_abobora.png');
        this.load.image('pronto_abobora_moranga', 'assets/solo/solo_pronto/solo_pronto_abobora_moranga.png');
        this.load.image('pronto_algodao', 'assets/solo/solo_pronto/solo_pronto_algodao.png');
        this.load.image('pronto_alho', 'assets/solo/solo_pronto/solo_pronto_alho.png');
        // this.load.image('pronto_amora', 'assets/solo/solo_pronto/solo_pronto_amora.png');
        this.load.image('pronto_arroz', 'assets/solo/solo_pronto/solo_pronto_arroz.png');
        // this.load.image('pronto_uva', 'assets/solo/solo_pronto/solo_pronto_uva.png');
        this.load.image('pronto_framboesa', 'assets/solo/solo_pronto/solo_pronto_framboesa.png');
        this.load.image('pronto_batata_inglesa', 'assets/solo/solo_pronto/solo_pronto_batata.png');
        this.load.image('pronto_batata_doce', 'assets/solo/solo_pronto/solo_pronto_batata_doce.png');
        this.load.image('pronto_cebola', 'assets/solo/solo_pronto/solo_pronto_cebola.png');
        // this.load.image('pronto_berinjela', 'assets/solo/solo_pronto/solo_pronto_berinjela.png');
        // this.load.image('pronto_beterraba', 'assets/solo/solo_pronto/solo_pronto_beterraba.png');
        this.load.image('pronto_cafe', 'assets/solo/solo_pronto/solo_pronto_cafe.png');
        this.load.image('pronto_couve_flor', 'assets/solo/solo_pronto/solo_pronto_couve_flor.png');
        this.load.image('pronto_girassol', 'assets/solo/solo_pronto/solo_pronto_girassol.png');
        this.load.image('pronto_melancia', 'assets/solo/solo_pronto/solo_pronto_melancia.png');
        this.load.image('pronto_milho', 'assets/solo/solo_pronto/solo_pronto_milho.png');
        this.load.image('pronto_mirtilo', 'assets/solo/solo_pronto/solo_pronto_mirtilo.png');
        this.load.image('pronto_morango', 'assets/solo/solo_pronto/solo_pronto_morango.png');
        this.load.image('pronto_nabo', 'assets/solo/solo_pronto/solo_pronto_nabo.png');
        this.load.image('pronto_pimenta', 'assets/solo/solo_pronto/solo_pronto_pimenta.png');
        this.load.image('pronto_pimentao', 'assets/solo/solo_pronto/solo_pronto_pimenta.png');
        this.load.image('pronto_rabanete', 'assets/solo/solo_pronto/solo_pronto_rabanete.png');
        this.load.image('pronto_trigo', 'assets/solo/solo_pronto/solo_pronto_trigo.png');
        this.load.image('pronto_cenoura', 'assets/solo/solo_pronto/solo_pronto_cenoura.png');
        this.load.image('pronto_soja', 'assets/solo/solo_pronto/solo_pronto_soja.png');
        this.load.image('pronto_tomate', 'assets/solo/solo_pronto/solo_pronto_tomate.png');
        this.load.image('pronto_alcachofra', 'assets/solo/solo_pronto/solo_pronto_alcachofra.png');
        this.load.image('pronto_espinafre', 'assets/solo/solo_pronto/solo_pronto_espinafre.png');
        this.load.image('pronto_aloe_vera', 'assets/solo/solo_pronto/solo_pronto_aloe_vera.png');

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

        this.load.image('macieira', 'assets/arvore/macieira.png');
        this.load.image('pereira', 'assets/arvore/pereira.png');
        this.load.image('abrico', 'assets/arvore/abrico.png');
        this.load.image('cerejeira', 'assets/arvore/cerejeira.png');
        this.load.image('coqueiro', 'assets/arvore/coqueiro.png');
        this.load.image('nectarina', 'assets/arvore/nectarina.png');
        this.load.image('pessegueiro', 'assets/arvore/pessegueiro.png');
        this.load.image('laranjeira', 'assets/arvore/laranjeira.png');

        this.load.image('cerca_branca', 'assets/decoracao/cerca_branca.png');
        this.load.image('carro', 'assets/decoracao/carro.png');
        this.load.image('cerca_verde', 'assets/decoracao/cerca_verde.png');
        this.load.image('galinheiro', 'assets/decoracao/galinheiro.png');
        this.load.image('estufa', 'assets/decoracao/estufa.png');
        this.load.image('moinho', 'assets/decoracao/moinho.png');
        this.load.image('armazem', 'assets/decoracao/super_armazem.png');
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

        this.load.image('trator', 'assets/veiculo/trator.png');
        this.load.image('trator2', 'assets/veiculo/trator2.png');
        this.load.image('trator3', 'assets/veiculo/trator3.png');

        this.load.image('solo.png', 'assets/solo/solo_preparado.png');
        this.load.image('solo_plantado_simples.png', 'assets/solo/solo_plantado_simples.png');
        this.load.image('solo_seco', 'assets/solo/solo_seco.png');
        this.load.image('solo_alagado', 'assets/solo/solo_alagado.png');
        this.load.image('solo_alagado_2', 'assets/solo/solo_alagado_2.png');

        this.load.image('vaca', 'assets/animal/vaca.png');
        this.load.image('galo', 'assets/animal/galo.png');
        this.load.image('ovelha', 'assets/animal/ovelha.png');
        this.load.image('porco', 'assets/animal/porco.png');

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
        this.growthController = new GrowthController(this);
        this.barController = new ControlBar(this);
        this.acoesUtils = new AcoesUtils(this, { uiEvents: this.gameVariables.eventsCenter });
        this.spriteController = new SpriteController(this, { uiEvents: this.gameVariables.eventsCenter });
        this.queue = new ActionQueue(this, { uiEvents: this.gameVariables.eventsCenter });
        this.gameEvents = new GameEventsController(this, { uiEvents: this.gameVariables.eventsCenter });
        this.interactController = new InteractController(this, { uiEvents: this.gameVariables.eventsCenter });

        this.soilControl = new SoloController(this, { uiEvents: this.gameVariables.eventsCenter });
        this.plantControl = new PlantaController(this, { uiEvents: this.gameVariables.eventsCenter });
        this.sellControl = new VendaController(this, { uiEvents: this.gameVariables.eventsCenter });

        this.shopMenu = new ShopMenu(this);
        this.bottomMenu = new BottomMenu(this, { shopMenu: this.shopMenu, uiEvents: this.gameVariables.eventsCenter });
        this.topUI = new TopUI(this);
        this.cameraController = new CameraController(this);
        this.itemMenuUI = new ItemMenuUI(this, { uiEvents: this.gameVariables.eventsCenter });

        this.selectedSprite = this.gameVariables.selectedSprite;
        this.selectedSeed = this.gameVariables.selectedSeed;
        this.collisionDataTemp = this.gameVariables.collisionDataTemp;
        this.toolSprite = this.gameVariables.toolSprite;
        this.spriteUtils = new SpriteUtils(this);


        //this.bonecoController = new BonecoController(this);

        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.updateHoverPlantPercent,
            callbackScope: this
        });

        this.fpsText = this.add.text(10, 10, '', {
            font: '16px Arial',
            fill: '#00ff00'
        });

        this.hoverText = this.add.text(0, 0, "", {
            fontSize: "14px",
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 4
        });

        this.hoverText
            .setBackgroundColor("rgba(0,0,0,0.6)")
            .setPadding(1, 1)
            .setDepth(9999)
            .setVisible(false);

        this.cameraController.ignoreInUICamera([
            this.itemMenuUI.itemMenu,
            this.gridGraphics,
            this.gameVariables.sprites,
            this.footprintGraphics,
            //this.bonecoController.boneco,
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
                if (this.gameVariables.plowing) this.gameVariables.freeClick = true;
            }
        });


        this.input.on('pointerup', () => {
            this.gameEvents.controleSolo();
        });


        this.input.on('pointerup', (pointer) => {
            this.gameEvents.controlePlantar();
        })

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            this.acoesUtils.comprarItem(itemData)
        });

    }

    update() {

        const fps = Math.floor(this.game.loop.actualFps);
        this.fpsText.setText(`FPS: ${fps}`);

        this.sellControl.updateSelling();

        this.spriteController.updateFence();

        this.soilControl.updatePlowing(1, 1);

        //this.bonecoController.update();
        //this.getSpriteByPointerPosition();

        this.spriteController.updateSprite();

        this.plantControl.updateSeeding();

    }

    updateHoverText(sprite) {

        if (!sprite) return;

        let text = "";

        if (sprite.tipo == "decoracao") {
            text = sprite.nome;
        }

        else if (sprite.tipo == "solo_preparado") {
            text = plantar_solo;
        }

        else if (sprite.tipo == "solo_plantado_simples" || sprite.tipo == "animal" || sprite.tipo == "arvore"  ) {

            let percent = this.growthController.getGrowthPercent(sprite);
            percent = Math.floor(percent * 100);

            text = sprite.nome + " " + percent + "%";

            if (sprite.harvestReady) {
                text = sprite.nome + "\n" + colher;
            }
        }

        if (this.gameVariables.selling) {
            text = vender;
        }

        this.hoverText.setText(text);

    }

    updateHoverPlantPercent() {

        const sprite = this.gameVariables.hoveredSprite;

        if (!sprite) return;

        console.log(sprite)

        this.updateHoverText(sprite);

    }

}