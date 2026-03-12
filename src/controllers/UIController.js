export default class UINotificationController {

    constructor(scene, configs = {}) {

        this.scene = scene;
        this.uiEvents = configs.uiEvents;

        const cam = scene.cameras.main;

        this.bgFullWidth = 500;
        this.bgFullHeight = 500;
        this.bgMediumHeight = 200;

        this.queue = [];
        this.isShowing = false;


        this.overlay = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.4)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(9998)
            .setVisible(false)
            .setInteractive();

        this.container = scene.add.container(cam.centerX, cam.centerY)
            .setDepth(9999)
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

        this.queue.push(data);
        this.processQueue();

    }

    processQueue() {

        if (this.isShowing) return;
        if (this.queue.length === 0) return;

        const data = this.queue.shift();

        this.isShowing = true;

        this.showPopup(data);

    }

    showPopup(data) {

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
            -this.bgFullHeight / 2 + 80,
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
                    width: this.bgFullWidth * 0.8
                }
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        const confirm = this.createConfirmButton();

        // const close = this.createCloseButton();

        this.levelContainer.add([bg, title, body, footer, sub, confirm]);
    }

    createMissionPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_branco").setDisplaySize(500, 400);

        const text = this.scene.add.text(
            0,
            0,
            "Nova Missão!",
            { fontSize: "26px", color: "#ffffff" }
        ).setOrigin(0.5);

        const confirm = this.createConfirmButton();
        const close = this.createCloseButton(data.type);

        this.missionContainer.add([bg, text, confirm, close]);
    }

    createGenericPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_medio").setDisplaySize(500, 200);

        const body = this.scene.add.text(
            0,
            0,
            `Você não tem fundos suficiente`,
            {
                fontSize: "22px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2, wordWrap: {
                    width: this.bgFullWidth * 0.9
                }
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        // const confirm = this.createConfirmButton();
        const close = this.createCloseButton(data.type);

        this.genericContainer.add([bg, body, close]);
    }

    createCloseButton(type) {

        let offsetWidth = 0;
        let offsetHeight = 0;

        switch (type) {
            case "level up":
                offsetWidth = this.bgFullWidth / 2 - 40;
                offsetHeight = -this.bgFullHeight / 2 + 40;
                break;
            default:
                offsetWidth = this.bgFullWidth / 2 - 10;
                offsetHeight = -this.bgMediumHeight / 2 + 20;
                break;
        }

        const close = this.scene.add.image(
            offsetWidth,
            offsetHeight,
            "close_button"
        ).setScale(0.2)
            .setInteractive({ useHandCursor: true });

        close.on("pointerup", () => this.close());
        close.on("pointerover", () => close.setScale(0.25))
        close.on("pointerout", () => close.setScale(0.2))

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

                this.isShowing = false;

                this.scene.gameVariables.freeClick = true;
                this.processQueue();
                
            }
        });

    }

    isOpen() {
        return this.container.visible;
    }
}