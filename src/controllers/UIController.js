export default class UINotificationController {

    constructor(scene, configs = {}) {

        this.scene = scene;
        this.uiEvents = configs.uiEvents;

        const cam = scene.cameras.main;

        this.bgWidth = 500;
        this.bgHeight = 500;

        this.overlay = scene.add.rectangle(
            cam.centerX,
            cam.centerY,
            cam.width,
            cam.height,
            0x000000,
            0.5
        )
            .setDepth(9000)
            .setVisible(false);

        this.container = scene.add.container(cam.centerX, cam.centerY)
            .setDepth(9001)
            .setVisible(false)
            .setScrollFactor(0);

        this.levelContainer = scene.add.container(0, 0).setVisible(false);
        this.missionContainer = scene.add.container(0, 0).setVisible(false);
        this.genericContainer = scene.add.container(0, 0).setVisible(false);

        this.container.add([
            this.levelContainer,
            this.missionContainer,
            this.genericContainer
        ]);

        this.uiEvents.on("ui:notify", this.notify, this);
    }

    notify(data) {

        this.levelContainer.setVisible(false);
        this.missionContainer.setVisible(false);
        this.genericContainer.setVisible(false);

        switch (data.type) {

            case "levelUp":
                this.createLevelPopup(data);
                this.levelContainer.setVisible(true);
                break;

            case "mission":
                this.createMissionPopup(data);
                this.missionContainer.setVisible(true);
                break;

            default:
                this.createGenericPopup(data);
                this.genericContainer.setVisible(true);
        }

        this.open();
    }

    createLevelPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira").setDisplaySize(500, 400);

        let resume = [];
        
        this.uiEvents.emit("catalog:getLevelResume", data.level, res => {
            resume = res.join(", ");
        });

        const title = this.scene.add.text(
            0,
            -this.bgHeight / 2 + 80,
            "Parabéns", {
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#fff',
            fontFamily: 'LuckiestGuy-Regular'
        }).setStroke('#000', 4).setOrigin(0.5);

        const body = this.scene.add.text(
            0,
            -50,
            `Nível: ${data.level}`,
            { fontSize: "28px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2 }
        ).setOrigin(0.5).setStroke('#000', 4);

        const footer = this.scene.add.text(
            0,
            40,
            "Itens desbloqueados: ",
            { fontSize: "20px", color: "#fbff00", fontFamily: 'LuckiestGuy-Regular' }
        ).setOrigin(0.5).setStroke('#000', 4);

        const sub = this.scene.add.text(
            0,
            80,
            resume,
            {
                fontSize: "18px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2,
                wordWrap: {
                    width: this.bgWidth * 0.8
                }
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        const confirm = this.createConfirmButton();

        // const close = this.createCloseButton();

        this.levelContainer.add([bg, title, body, footer, sub, confirm]);
    }

    createMissionPopup() {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_medio");

        const text = this.scene.add.text(
            0,
            0,
            "Nova Missão!",
            { fontSize: "26px", color: "#ffffff" }
        ).setOrigin(0.5);

        const confirm = this.createConfirmButton();
        const close = this.createCloseButton();

        this.missionContainer.add([bg, text, confirm, close]);
    }

    createGenericPopup() {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_branco");

        const text = this.scene.add.text(
            0,
            0,
            "Mensagem",
            { fontSize: "24px", color: "#000" }
        ).setOrigin(0.5);

        const confirm = this.createConfirmButton();
        const close = this.createCloseButton();

        this.genericContainer.add([bg, text, confirm, close]);
    }

    createCloseButton() {

        const close = this.scene.add.image(
            this.bgWidth / 2 - 40,
            -this.bgHeight / 2 + 40,
            "close_button"
        ).setScale(0.2)
            .setInteractive({ useHandCursor: true });

        close.on("pointerup", () => this.close());

        return close;
    }

    createConfirmButton() {

        const btn = this.scene.add.image(0, 170, "confirm_button")
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });

        btn.on("pointerup", () => this.close());
        btn.on("pointerover", () => btn.setScale(0.8))
        btn.on("pointerout", () => btn.setScale(0.7))

        return btn;
    }

    open() {

        if (this.container.visible) return;

        this.overlay.setVisible(true);

        this.container
            .setVisible(true)
            .setAlpha(0)
            .setScale(0.8);

        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: "Back.Out"
        });

    }

    close() {

        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.8,
            duration: 200,
            ease: "Back.In",
            onComplete: () => {

                this.container.setVisible(false);
                this.overlay.setVisible(false);

            }
        });

    }

}