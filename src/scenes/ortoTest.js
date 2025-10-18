export class OrtoTest extends Phaser.Scene {
    constructor() {
        super('OrtoTest');
    }

    create() {
        this.gridW = 16;
        this.gridH = 16;
        this.tileW = 64;  // largura do losango
        this.tileH = 32;  // altura do losango
        this.offsetX = 400;
        this.offsetY = 100;
        this.matrixOffsetX = 900;

        // matriz de ocupação
        this.occ = Array.from({ length: this.gridH }, () => Array(this.gridW).fill(0));

        // desenhar grid
        this.drawIsoGrid();

        this.matrixGraphics = this.add.graphics();
        this.blocks = [];

        const startBlocks = [
            { gx: 0, gy: 0, color: 0xf39c12 },
            { gx: 2, gy: 2, color: 0x3498db },
            { gx: 6, gy: 4, color: 0x9b59b6 },
            { gx: 10, gy: 8, color: 0xe74c3c },
        ];

        for (let b of startBlocks) {
            const screen = this.isoToScreen(b.gx, b.gy);
            const diamond = this.add.graphics();
            diamond.fillStyle(b.color, 1);
            this.drawDiamond(diamond, 0, 0, this.tileW, this.tileH);
            diamond.x = screen.x;
            diamond.y = screen.y;
            diamond.gx = b.gx;
            diamond.gy = b.gy;
            diamond.w = 1;
            diamond.h = 1;
            diamond.color = b.color;
            diamond.setInteractive(new Phaser.Geom.Polygon(this.getDiamondPoints(0, 0, this.tileW, this.tileH)), Phaser.Geom.Polygon.Contains);
            this.input.setDraggable(diamond);
            this.blocks.push(diamond);
            this.markOccupied(diamond, b.gx, b.gy, 1, 1);
        }

        this.input.on('dragstart', (pointer, obj) => {
            this.children.bringToTop(obj);
        });

        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.x = dragX;
            obj.y = dragY;
        });

        this.input.on('dragend', (pointer, obj) => {
            const iso = this.screenToIso(obj.x, obj.y);
            const snap = this.snapToGrid(iso.x, iso.y);
            this.clearOccupied(obj);

            if (this.isInside(snap.gx, snap.gy, 1, 1) && !this.isOccupied(snap.gx, snap.gy, 1, 1)) {
                const scr = this.isoToScreen(snap.gx, snap.gy);
                obj.x = scr.x;
                obj.y = scr.y;
                obj.gx = snap.gx;
                obj.gy = snap.gy;
                this.markOccupied(obj, snap.gx, snap.gy, 1, 1);
                obj.setAlpha(1);
            } else {
                // volta
                const scr = this.isoToScreen(obj.gx, obj.gy);
                obj.x = scr.x;
                obj.y = scr.y;
                this.markOccupied(obj, obj.gx, obj.gy, 1, 1);
                obj.setAlpha(0.5);
                this.time.delayedCall(200, () => obj.setAlpha(1));
            }

            this.drawMatrix();
        });

        this.drawMatrix();
    }

    // === Conversões ===
    isoToScreen(ix, iy) {
        return {
            x: this.offsetX + (ix - iy) * (this.tileW / 2),
            y: this.offsetY + (ix + iy) * (this.tileH / 2)
        };
    }

    screenToIso(sx, sy) {
        const ix = ((sx - this.offsetX) / (this.tileW / 2) + (sy - this.offsetY) / (this.tileH / 2)) / 2;
        const iy = ((sy - this.offsetY) / (this.tileH / 2) - (sx - this.offsetX) / (this.tileW / 2)) / 2;
        return { x: ix, y: iy };
    }

    snapToGrid(ix, iy) {
        return { gx: Math.round(ix), gy: Math.round(iy) };
    }

    // === Grid Visual ===
    drawIsoGrid() {
        const g = this.add.graphics();
        g.lineStyle(1, 0xffffff, 0.25);

        for (let y = 0; y < this.gridH; y++) {
            for (let x = 0; x < this.gridW; x++) {
                const p = this.isoToScreen(x, y);
                this.drawDiamond(g, p.x, p.y, this.tileW, this.tileH, false);
            }
        }
    }

    drawDiamond(g, cx, cy, w, h, fill = true) {
        const halfW = w / 2;
        const halfH = h / 2;
        const points = [
            { x: cx, y: cy - halfH },
            { x: cx + halfW, y: cy },
            { x: cx, y: cy + halfH },
            { x: cx - halfW, y: cy },
        ];
        g.beginPath();
        g.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) g.lineTo(points[i].x, points[i].y);
        g.closePath();
        if (fill) g.fillPath();
        else g.strokePath();
    }

    getDiamondPoints(cx, cy, w, h) {
        const halfW = w / 2;
        const halfH = h / 2;
        return [
            new Phaser.Geom.Point(cx, cy - halfH),
            new Phaser.Geom.Point(cx + halfW, cy),
            new Phaser.Geom.Point(cx, cy + halfH),
            new Phaser.Geom.Point(cx - halfW, cy),
        ];
    }

    // === Matriz de ocupação ===
    isInside(gx, gy, w, h) {
        return gx >= 0 && gy >= 0 && gx + w <= this.gridW && gy + h <= this.gridH;
    }

    isOccupied(gx, gy, w, h) {
        for (let y = gy; y < gy + h; y++)
            for (let x = gx; x < gx + w; x++)
                if (this.occ[y]?.[x]) return true;
        return false;
    }

    markOccupied(obj, gx, gy, w, h) {
        for (let y = gy; y < gy + h; y++)
            for (let x = gx; x < gx + w; x++)
                this.occ[y][x] = 1;
    }

    clearOccupied(obj) {
        for (let y = 0; y < this.gridH; y++)
            for (let x = 0; x < this.gridW; x++)
                if (x === obj.gx && y === obj.gy) this.occ[y][x] = 0;
    }

    drawMatrix() {
        this.matrixGraphics.clear();
        for (let y = 0; y < this.gridH; y++) {
            for (let x = 0; x < this.gridW; x++) {
                const color = this.occ[y][x] ? 0xe74c3c : 0x2ecc71;
                this.matrixGraphics.fillStyle(color);
                this.matrixGraphics.fillRect(
                    this.matrixOffsetX + x * 10,
                    this.offsetY + y * 10,
                    10, 10
                );
            }
        }
        this.matrixGraphics.lineStyle(1, 0xffffff, 0.5);
        this.matrixGraphics.strokeRect(
            this.matrixOffsetX,
            this.offsetY,
            this.gridW * 10,
            this.gridH * 10
        );

        this.add.text(this.matrixOffsetX, this.offsetY - 25, 'Matriz de ocupação', {
            fontSize: '14px',
            color: '#ffffff'
        });
    }
}
