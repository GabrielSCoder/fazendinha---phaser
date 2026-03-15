export default class AcoesUtils {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.input = scene.input;
        this.itemMenuUI = scene.itemMenuUI;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;
    }

    setHoverEnabled(enabled) {
        this.scene.gameVariables.hoverEnabled = enabled;

        if (!enabled) {
            this.controllers.sprite.hoverText.setVisible(false);
            this.scene.input.manager.canvas.style.cursor = "default";
        }
    }


    clearPreviewOccupiedTiles() {
        this.scene.gameVariables.previewOccupiedtiles = [];
    }

    clearPreviewTiles() {
        for (let tile of this.scene.gameVariables.previewTiles) {
            tile.destroy();
        }
        this.scene.gameVariables.previewTiles = [];
    }


    getSpriteByPointerPosition() {

        if (!this.scene.gameVariables.gridMap || !this.scene.gameVariables.gridMap.length) return;

        const pointer = this.scene.input.activePointer;

        const cam = this.scene.cameras.main;
        const worldPoint = cam.getWorldPoint(pointer.x, pointer.y);

        const iso = this.gridUtils.screenToIso(
            worldPoint.x,
            worldPoint.y
        );

        const tileX = Math.floor(iso.x);
        const tileY = Math.floor(iso.y);

        if (tileX < 1 || tileX > this.gridWidth * this.logicFactor - 1 || tileY < 1 || tileY > this.gridHeight * this.logicFactor - 1) return;

        const cell = this.scene.gameVariables.gridMap[tileX][tileY];

        console.log(cell);

        if (cell != null && cell.tipo == "cerca") return cell;

        return null;
    }

    gridStart() {
        const g = this.scene.gridGraphics;
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

        if (this.scene.gameVariables.planting) return false;

        if (this.scene.gameVariables.plowing) return false;

        if (this.scene.gameVariables.ignoreNextPointerUp) return false;

        if (this.scene.gameVariables.freeClick) {
            console.log("free click")
            this.scene.gameVariables.freeClick = false;
            return false;
        }

        if (this.scene.gameVariables.changeCameraZoom) return false;

        if (this.scene.gameVariables.middleButtonDown) return false;

        if (this.controllers.itemMenu.itemMenu.visible) return false;

        if (!this.scene.gameVariables.scene.gameVariables.selectedSprite || !this.scene.gameVariables.scene.gameVariables.selectedSprite.isMoving) return false;

        return true;
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

        // if (itemData.noStopBuy) this.scene.gameVariables.buyItemTmp = itemData;

        const sprite = this.controllers.spriteUtils.addGameSprite(itemData, this.scale / 2, this.scale / 2, scale, originX, originY);

        if (itemData.gift)
            sprite.gift = true;

        if (itemData.tipo !== "semente" && !sprite.gift)
            this.scene.gameVariables.buyItemTmp = itemData;

        if (itemData.area) {
            sprite.footprint = itemData.area;
        }

        sprite.setAlpha(0.7);
        sprite.isMoving = true;
        sprite.setDepth(2000);

        if (sprite.tipo === "semente") {
            sprite.tipo_plantacao = itemData.tipo_plantacao
            this.scene.gameVariables.selectedSeed = sprite
            sprite.setAlpha(1);
        }
        else
            this.scene.gameVariables.scene.gameVariables.selectedSprite = sprite;

        const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

        const iso = this.gridUtils.screenToIso(sprite.x, sprite.y);
        const startX = Math.round(iso.x - (w / 2 - 0.5));
        const startY = Math.round(iso.y - (h / 2 - 0.5));

        sprite.lastFreePos = { startX, startY };

        this.gridUtils.clearOccupied(sprite);

        const ocupado = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
        sprite.setTint(ocupado ? 0xff8888 : 0x88ff88);

        if (sprite.tipo !== "semente") {
            for (let other of this.scene.gameVariables.sprites) {
                if (other !== sprite) other.disableInteractive();
            }
        }
        else {
            for (let other of this.scene.gameVariables.sprites) {
                if (other !== sprite && other.nome !== "solo_preparado") other.disableInteractive();
            }
        }


        if (!this.scene.gameVariables.sprites) this.scene.gameVariables.sprites = [];
        this.scene.gameVariables.sprites.push(sprite);

        this.controllers.camera.ignoreInUICamera([...this.scene.gameVariables.sprites])

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