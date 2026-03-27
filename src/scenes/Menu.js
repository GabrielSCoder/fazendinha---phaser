export class Menu extends Phaser.Scene {

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');
        this.load.image("bg", "assets/ui/wallpaper.png");
    }

    constructor() {
        super('Menu');
    }

    create() {

        const { width, height } = this.scale;

        const bg = this.add.image(0, 0, "bg")
            .setOrigin(0);

        bg.setDisplaySize(width, height);
        
        this.add.rectangle(0, 0, width, height, 0x000000, 0.3)
            .setOrigin(0);

        const container = this.add.container(width / 2, height / 2);

        const panel = this.add.rectangle(0, 0, 300, 200, 0x222222, 0.9)
            .setStrokeStyle(2, 0xffffff);

        container.add(panel);

        const title = this.add.text(0, -70, "FreeFarm", {
            fontSize: "24px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        container.add(title);

        const btnStart = this.createButton("Iniciar Jogo", 0, -10, () => {
            console.log("Novo jogo");
            this.scene.start("Start");
        });

        const btnLoad = this.createButton("Carregar Jogo", 0, 50, () => {
            console.log("Carregar jogo");
            this.scene.start("Game");
        });

        container.add([btnStart, btnLoad]);
    }

    createButton(text, x, y, callback) {

        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, 200, 40, 0x444444)
            .setStrokeStyle(2, 0xffffff);

        const label = this.add.text(0, 0, text, {
            fontSize: "16px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        container.add([bg, label]);

        container.setSize(200, 40);
        container.setInteractive({ useHandCursor: true });

        // 🖱️ hover
        container.on("pointerover", () => {
            bg.setFillStyle(0x666666);
        });

        container.on("pointerout", () => {
            bg.setFillStyle(0x444444);
        });

        container.on("pointerup", callback);

        return container;
    }
}