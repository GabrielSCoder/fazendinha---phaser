import ShopMenu from '../ui/ShopMenu.js';
import TopUI from "../ui/TopUI.js";
import CameraController from "../controllers/CameraController.js";
import BottomMenu from '../ui/BottomMenu.js';
import ItemMenuUI from '../ui/ItemMenuUI.js';
import GridUtils from "../utils/GridUtils.js";
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
import HarvestController from '../controllers/HarvestController.js';
import ProfileController from '../controllers/ProfileController.js';
import XPController from '../controllers/XpController.js';
import FloatingTextController from '../controllers/FloatingTextController.js';
import UINotificationController from '../controllers/UIController.js';
import CatalogUtils from '../utils/CatalogUtils.js';
import { AssetLoader } from '../utils/AssetLoader.js';
import { MissionController } from '../controllers/MissionController.js';
import { intro_missions } from '../static/missionsDB.js';
import SidesUi from '../ui/SidesUi.js';
import PresentsControler from '../controllers/PresentsController.js';
import PresentsMenuUI from '../ui/PresentsMenuUI.js';
import PaginationUtils from '../utils/PaginationUtils.js';

export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');

        this.load.text('xpTable', 'assets/data/xp_levels.csv');


        this.load.image('menu_bg', 'assets/ui/fundo_madeira.jpg');
        this.load.image('item_bg', 'assets/ui/fundo_item_loja.png');
        this.load.image('item_bloqueado', 'assets/ui/bloqueado_ui.png');
        this.load.image('categoria_bg', 'assets/ui/categoria_fundo.png');
        this.load.image('gold_icon', 'assets/ui/gold.png');
        this.load.image('cash_icon', 'assets/ui/cash.png');
        this.load.image('clock_icon', 'assets/ui/clock2.png');
        this.load.image('close_button', 'assets/ui/close.png');
        this.load.image('confirm_button', 'assets/ui/confirm.png');
        this.load.image('proximo_button', 'assets/ui/proximo.png');
        this.load.image('anterior_button', 'assets/ui/anterior.png');
        this.load.image('enxada', 'assets/ui/enxada.png');
        this.load.image('pa', 'assets/ui/pazinha.png');
        this.load.image('star', 'assets/ui/star.png');
        this.load.image('energy', 'assets/ui/energy.png');
        this.load.image('gift', 'assets/ui/gift2.png');
        this.load.image('grama', 'assets/fundo/grama_tile.png');

        this.load.image('fundo_madeira', 'assets/ui/fundo_madeira_escuro_2.png');
        this.load.image('fundo_madeira_medio', 'assets/ui/banner_medio.png');
        this.load.image('fundo_madeira_branco', 'assets/ui/fundo_madeira_escuro_medio_fundo_branco.png');

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

        this.load.image('solo.png', 'assets/solo/solo_preparado.png');
        this.load.image('solo_plantado_simples.png', 'assets/solo/solo_plantado_simples.png');
        this.load.image('solo_seco', 'assets/solo/solo_seco.png');
        this.load.image('solo_alagado', 'assets/solo/solo_alagado.png');
        this.load.image('solo_alagado_2', 'assets/solo/solo_alagado_2.png');

        this.load.json('saveData', 'src/static/player_mission_progress.json')

        AssetLoader.load(this)
        this.gameVariables = new GameVariablesController(this);
    }

    create() {

        this.gridSize = this.gameVariables.gridSize;
        this.gridWidth = this.gameVariables.gridWidth;
        this.gridHeight = this.gameVariables.gridHeight;
        this.offsetX = this.gameVariables.offsetX;
        this.offsetY = this.gameVariables.offsetY;
        this.logicFactor = this.gameVariables.logicFactor;

        this.gridMap = this.gameVariables.gridMap;

        this.controllers = {}
        const saveData = this.cache.json.get('saveData');

        this.createControllers(saveData)
        this.initControllers()

        this.controllers.sprite.initialGraphics();
        this.controllers.gridUtils.drawMatrix();
        this.controllers.gridUtils.gridStart();

        //this.bonecoController = new BonecoController(this);

        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: this.controllers.sprite.updateHoverPlantPercent,
            callbackScope: this.controllers.sprite
        });

        // this.time.addEvent({
        //     delay: 200,
        //     loop: true,
        //     callback: () => console.log(this.gameVariables.selectedSpriteDelete),
        //     callbackScope: this
        // });

        this.controllers.camera.ignoreInUICamera([
            this.controllers.itemMenu.itemMenu,
            this.gameVariables.sprites,
            //this.bonecoController.boneco,
            this.gameVariables.previewTiles,
        ]);

        this.controllers.camera.ignoreInMainCamera([
            this.controllers.topUI.containerUI,
            this.controllers.bottomMenu.containerUI,
            this.controllers.shopMenu.container,
            this.controllers.banner.container,
        ]);

        this.input.setDraggable(this.gameVariables.sprites);

        this.input.on("pointerup", () => {
            if (this.controllers.banner.isOpen()) return;
            this.controllers.gameEvents.colocarCercasCheck();
        });

        this.input.on('pointerup', () => {
            this.controllers.gameEvents.abrirLojaCheck();
        });

        this.input.on('pointerup', () => {
            if (this.controllers.banner.isOpen()) return;
            this.controllers.gameEvents.fixarObjetoCheck();
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
            this.controllers.gameEvents.controleSolo();
        });


        this.input.on('pointerup', (pointer) => {
            this.controllers.gameEvents.controlePlantar();
        })

        this.events.on('itemPurchased', (itemData) => {
            if (!itemData || !itemData.img) return;

            this.controllers.acoesUtils.comprarItem(itemData)
        });

    }

    update() {

        const fps = Math.floor(this.game.loop.actualFps);
        this.controllers.sprite.fpsText.setText(`FPS: ${fps}`);

        this.controllers.sell.updateSelling();

        this.controllers.sprite.updateFence();

        this.controllers.soil.updatePlowing(this.gameVariables.actionTileX, this.gameVariables.actionTileY);

        //this.bonecoController.update();
        //this.getSpriteByPointerPosition();

        this.controllers.sprite.updateSprite();

        this.controllers.plant.updateSeeding();

    }

    createControllers(saveData) {

        const events = this.gameVariables.eventsCenter

        const raw = this.cache.text.get("xpTable");

        const xpTable = this.parseCSV(raw)

        this.controllers.presents = new PresentsControler(this,  {uiEvents : events});

        this.controllers.gridUtils = new GridUtils(this, { uiEvents: events });
        this.controllers.catalog = new CatalogUtils(this, { uiEvents: events })
        this.controllers.banner = new UINotificationController(this, { uiEvents: events })

        this.controllers.missions = new MissionController(this, intro_missions, saveData.missions, events)
        this.controllers.camera = new CameraController(this)
        this.controllers.growth = new GrowthController(this)

        this.controllers.sideUi = new SidesUi(this, { uiEvents: events });
        this.controllers.spriteUtils = new SpriteUtils(this, { uiEvents: events })
        this.controllers.acoesUtils = new AcoesUtils(this, { uiEvents: events })

        this.controllers.xp = new XPController(this, xpTable, events, saveData.player)

        this.controllers.bar = new ControlBar(this)
        this.controllers.profile = new ProfileController(this, { uiEvents: events }, saveData.player)

        this.controllers.sprite = new SpriteController(this, { uiEvents: events })
        this.controllers.queue = new ActionQueue(this, { uiEvents: events })

        this.controllers.gameEvents = new GameEventsController(this, { uiEvents: events })
        this.controllers.interact = new InteractController(this, { uiEvents: events })

        this.controllers.presentsUI = new PresentsMenuUI(this, {uiEvents : events})

        this.controllers.soil = new SoloController(this, { uiEvents: events })
        this.controllers.plant = new PlantaController(this, { uiEvents: events })
        this.controllers.sell = new VendaController(this, { uiEvents: events })

        this.controllers.shopMenu = new ShopMenu(this, { uiEvents: events })

        this.controllers.bottomMenu = new BottomMenu(this, {
            shopMenu: this.controllers.shopMenu,
            uiEvents: events
        })

        this.controllers.topUI = new TopUI(this, { uiEvents: events })

        this.controllers.floating = new FloatingTextController(this, { uiEvents: events })
        this.controllers.itemMenu = new ItemMenuUI(this, { uiEvents: events })

        this.controllers.harvest = new HarvestController(this, { uiEvents: events })

    }

    initControllers() {

        Object.values(this.controllers).forEach(controller => {

            if (controller.init) {
                controller.init()
            }

        })

    }

    parseCSV(csv) {

        const lines = csv.trim().split("\n");
        const headers = lines.shift().split(",");

        return lines.map(line => {

            const values = line.split(",");

            const obj = {};

            headers.forEach((h, i) => {
                obj[h.trim()] = Number(values[i]);
            });

            return obj;

        });

    }
}