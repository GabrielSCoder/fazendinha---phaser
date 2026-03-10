export default class FloatingTextController {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;

        this.listenEvents();
    }

    listenEvents() {

        this.uiEvents.on("ui:floatingText", (data) => {

            if (data.x === undefined || data.y === undefined) return;

            this.createFloatingText(data);

        });

    }

    createFloatingText(data) {

        const {
            text = "",
            x,
            y,
            color = "#ffffff",
            fontSize = "16px",
            duration = 1000,
            rise = 40,
            icon = null
        } = data;

        const offsetX = Phaser.Math.Between(-10, 10);
        const offsetY = Phaser.Math.Between(-5, 5);

        const container = this.scene.add.container(
            x + offsetX,
            y + offsetY
        ).setDepth(2000);

        let iconImage = null;

        if (icon) {
            iconImage = this.scene.add.image(0, 0, icon)
                .setOrigin(0.5)
                .setDisplaySize(16, 16);
        }

        const textObj = this.scene.add.text(
            icon ? 12 : 0,
            0,
            text,
            {
                fontSize,
                color,
                fontStyle: "bold",
                stroke: "#000",
                strokeThickness: 4
            }
        ).setOrigin(0, 0.5);

        if (iconImage) container.add(iconImage);

        container.add(textObj);

        this.scene.tweens.add({
            targets: container,
            y: container.y - rise,
            alpha: 0,
            duration: duration,
            ease: "Cubic.out",
            onComplete: () => {
                container.destroy();
            }
        });

        this.scene.cameraController.ignoreInUICamera([container]);
    }

}