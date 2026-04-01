export default class GameVariablesController {
    constructor(scene) {
        this.scene = scene;

        this.gridSize = 32;
        this.gridWidth = 12;
        this.gridHeight = 12;
        this.offsetX = 0;
        this.offsetY = -this.gridHeight * (this.gridSize / 4);
        this.matrixOffsetX = 20;
        this.matrixOffsetY = 120;
        this.logicFactor = 2;

        this.gridMap = Array.from({ length: this.gridWidth * this.logicFactor },
            () => Array(this.gridHeight * this.logicFactor).fill(null));

        this.gridReserved = Array.from({ length: this.gridWidth * this.logicFactor },
            () => Array(this.gridHeight * this.logicFactor).fill(null));

        this.sprites = [];
        this.spriteInitialPositions = new Map();
        this.middleButtonDown = false;
        this.freeClick = false;
        this.ignoreNextPointerUp = false;
        this.changeCameraZoom = false;
        this.previewTiles = [];
        this.previewOccupiedtiles = [];
        this.growingSprites = [];
        this.fenceSnapTarget = null;
        this.tileSize = this.gridSize;
        this.hoveredSprite = null;
        this.canInteract = true;
        this.activeBar = false;
        this.creativeMode = false;
        this.staticMode = false;
        this.noExperienceMode = false;
        this.noFootprints = true;
        this.actionTileX = 1;
        this.actionTileY = 1;
        this.plowing = false;
        this.buyItemTmp = null;
        this.planting = false;
        this.selling = false;
        this.hoverEnabled = true;
        this.matrixVisible = false;
        this.debugBarVisible = false;
        this.fastHarvestMode = false;
        this.debugHaverstTime = 0.2;
        this.debugShowFps = false;

        this.selectedSprite = null;
        this.selectedSpriteDelete = null;
        this.selectedSeed = null;

        this.collisionDataTemp = null;
        this.toolSprite = null;

        this.plowingCost = 30;
        this.prepareSoilCost = 10;
        this.plowingExperience = 1;
        this.prepareSoilExperience = 1;

        this.actionQueue = [];
        this.isProcessingAction = false;
        this.eventsCenter = new Phaser.Events.EventEmitter();
    }
}