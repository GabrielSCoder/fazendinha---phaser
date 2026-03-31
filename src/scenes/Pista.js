export class Scene1 extends Phaser.Scene {
    constructor() {
        super("Scene1");
    }

    preload() {
        this.load.image("building", "assets/outro/predio.png");

        this.load.image("window_ok", "assets/outro/janela1.png");
        this.load.image("window_broken", "assets/outro/janela2.png");

        this.load.image("door_ok", "assets/outro/porta2.png");
        this.load.image("door_broken", "assets/outro/porta1.png");

        this.load.image("player", "assets/outro/heroi.png");
    }

    create() {

        const size = 512;
        const gridSize = 3;
        this.cellSize = size / gridSize;

        const { width, height } = this.scale;

        this.startX = width / 2 - size / 2;
        this.startY = height / 2 - size / 2;

        // 🏢 fundo
        this.add.image(width / 2, height / 2, "building")
            .setDisplaySize(size, size);

        // 🧩 dados do grid
        this.grid = [
            [{ type: "window", state: "broken" }, { type: "window", state: "broken" }, { type: "window", state: "ok" }],
            [{ type: "window", state: "broken" }, { type: "window", state: "ok" }, { type: "window", state: "ok" }],
            [{ type: "window", state: "broken" }, { type: "door", state: "broken" }, { type: "window", state: "ok" }]
        ];

        // 🎨 sprites das células
        this.cellSprites = [];

        this.topRow = ["ok", "broken", "ok"]; // só 3 janelas

        this.topRowSprites = [];

        const offsetY = -this.cellSize * 1.2; // ajusta no olho

        for (let x = 0; x < 3; x++) {

            const state = this.topRow[x];

            const posX = this.startX + this.cellSize * x + this.cellSize / 2;
            const posY = this.startY + this.cellSize / 2 + offsetY;

            const key = state === "broken" ? "window_broken" : "window_ok";

            const sprite = this.add.image(posX, posY, key)
                .setDisplaySize(128, 128)
                .setAlpha(0.8); // opcional

            this.topRowSprites.push(sprite);
        }

        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {

                const cell = this.grid[y][x];

                const posX = this.startX + this.cellSize * x + this.cellSize / 2;
                const posY = this.startY + this.cellSize * y + this.cellSize / 2;

                let key = this.getSpriteKey(cell);

                const sprite = this.add.image(posX, posY, key);

                if (cell.type === "window") {
                    sprite.setDisplaySize(128, 128);
                } else if (cell.type === "door") {
                    sprite.setDisplaySize(200, 200);
                }

                this.cellSprites.push({ x, y, sprite });
            }
        }

        // 🧍 player
        this.playerPos = { x: 1, y: 1 };

        this.player = this.add.image(0, 0, "player").setScale(0.2);

        this.updatePlayerPosition();

        // 🎮 input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.canMove = true;
    }

    update() {

        if (this.canMove) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                this.move(-1, 0);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                this.move(1, 0);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                this.move(0, -1);
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
                this.move(0, 1);
            }
        }

        // 🔧 interação
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            const { x, y } = this.playerPos;
            const cell = this.grid[y][x];

            if (cell.state === "broken") {

                cell.state = "fixing";
                this.updateCellVisual(x, y);

                this.time.delayedCall(200, () => {
                    cell.state = "ok";
                    this.updateCellVisual(x, y);
                });
            }
        }
    }

    move(dx, dy) {
        this.canMove = false;

        let newX = this.playerPos.x + dx;
        let newY = this.playerPos.y + dy;

        if (newX < 0 || newX > 2 || newY < 0 || newY > 2) {
            this.canMove = true;
            return;
        }

        this.playerPos.x = newX;
        this.playerPos.y = newY;

        this.updatePlayerPosition();

        this.time.delayedCall(150, () => {
            this.canMove = true;
        });
    }

    updatePlayerPosition() {
        const x = this.startX + this.cellSize * this.playerPos.x + this.cellSize / 2;
        const y = this.startY + this.cellSize * this.playerPos.y + this.cellSize / 2;

        this.tweens.add({
            targets: this.player,
            x: x,
            y: y,
            duration: 120
        });
    }

    getSpriteKey(cell) {
        if (cell.type === "window") {
            return cell.state === "broken" ? "window_broken" : "window_ok";
        }

        if (cell.type === "door") {
            return cell.state === "broken" ? "door_broken" : "door_ok";
        }
    }

    updateCellVisual(x, y) {

        const obj = this.cellSprites.find(c => c.x === x && c.y === y);
        const cell = this.grid[y][x];

        if (!obj) return;

        if (cell.state === "fixing") {
            obj.sprite.setTint(0xffff00);
        } else {
            obj.sprite.clearTint();
            obj.sprite.setTexture(this.getSpriteKey(cell));
        }
    }
}