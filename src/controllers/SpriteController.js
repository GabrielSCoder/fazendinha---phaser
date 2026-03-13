import { arar_solo, colher, plantar_solo, vender } from "../msgs.js";

export default class SpriteController {

    constructor(scene, config = {}) {
        this.scene = scene;
        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.gameVariables = scene.gameVariables;
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;
        this.classEvents();
        this.growingSprites = ["semente", "arvore", "solo_plantado_simples", "animal"];

        this.hoverText = this.scene.add.text(0, 0, "", {
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

        this.scene.cameraController.ignoreInUICamera(this.hoverText)
    }

    classEvents() {

    }

    updateSprite() {

        if (this.scene.gameVariables.planting) return;

        if (this.scene.gameVariables.selectedSprite && this.scene.gameVariables.selectedSprite.isMoving) {
            const sprite = this.scene.gameVariables.selectedSprite;
            const pointer = this.scene.input.activePointer;
            // this.uiEvents.emit('ui:desativarBottonMenu');

            if (this.scene.bannerController.isOpen()) return;

            if (this.scene.gameVariables.middleButtonDown) return;

            if (this.scene.gameVariables.freeClick) return;

            // converte para iso usando pointer
            let iso = this.gridUtils.screenToIso(pointer.worldX, pointer.worldY);
            const { w, h } = this.gridUtils.getSpriteFootprint(sprite);

            iso.x = Phaser.Math.Clamp(iso.x - (w / 2 - 0.5), 0, this.gridWidth * this.logicFactor - w) + (w / 2 - 0.5);
            iso.y = Phaser.Math.Clamp(iso.y - (h / 2 - 0.5), 0, this.gridHeight * this.logicFactor - h) + (h / 2 - 0.5);

            this.scene.acoesUtils.convert(iso, sprite)

            const startX = Math.round(iso.x - (w / 2 - 0.5));
            const startY = Math.round(iso.y - (h / 2 - 0.5));
            // this.gridUtils.recalculateDepthAround(sprite);


            const occupied = this.gridUtils.checkOccupiedGrid(startX, startY, startX + w - 1, startY + h - 1, sprite);
            // sprite.setTint(occupied ? 0xff8888 : 0x88ff88);

            this.gridUtils.drawSpriteFootprint(sprite);
        }
    }

    updateFence() {
        const sprite = this.scene.gameVariables.selectedSprite;
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
                const cell = this.scene.gameVariables.gridMap[gx]?.[gy];
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
            this.scene.gameVariables.fenceSnapTarget = possibleSnaps[0].cell;
            this.scene.gameVariables.collisionDataTemp = possibleSnaps[0].data;
        } else if (possibleSnaps.length === 2) {
            foundSnap = true;
            sprite.setTint(0x00ff00);
            this.scene.gameVariables.fenceSnapTarget = possibleSnaps.map(s => s.cell);
            this.scene.gameVariables.collisionDataTemp = possibleSnaps.map(s => s.data);
        } else {
            //console.log("nenhum encontrado")
            sprite.setTint(0xffaaaa);
            this.scene.gameVariables.fenceSnapTarget = null;
        }
    }


    updateHoverText(sprite) {

        if (!sprite) return;

        let text = "";

        if (sprite.tipo == "decoracao" || sprite.tipo == "cerca") {
            text = sprite.nome;
        }

        else if (sprite.tipo == "solo_preparado") {
            text = plantar_solo;
        } else if (sprite.tipo == "solo_seco") {
            text = arar_solo
        }

        else if (sprite.tipo == "solo_plantado_simples" || sprite.tipo == "animal" || sprite.tipo == "arvore") {

            let percent = this.scene.growthController.getGrowthPercent(sprite);
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

        this.updateHoverText(sprite);

    }
}
