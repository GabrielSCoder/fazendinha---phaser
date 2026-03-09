export default class GameVariablesController {
    constructor(scene) {
        this.scene = scene;

        this.gridSize = 32;
        this.gridWidth = 10;
        this.gridHeight = 10;
        this.offsetX = 550;
        this.offsetY = 200;
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
        this.fenceSnapTarget = null;
        this.tileSize = this.gridSize;
        this.hoveredSprite = null;
        this.canInteract = true;

        this.plowing = false;
        this.buyItemTmp = null;
        this.planting = false;
        this.selling = false;
        this.hoverEnabled = true;
        this.matrixVisible = false;

        this.selectedSprite = null;
        this.selectedSeed = null;

        this.collisionDataTemp = null;
        this.toolSprite = null;

        this.actionQueue = [];
        this.isProcessingAction = false;
        this.eventsCenter = new Phaser.Events.EventEmitter();
    }
}