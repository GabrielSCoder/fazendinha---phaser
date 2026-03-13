export default class FloatingTextController {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.controllers = scene.controllers;

    }

    init() {
        this.listenEvents();
    }

    listenEvents() {

        this.uiEvents.on("ui:floatingText", (data) => {

            if (data.x === undefined || data.y === undefined) return;

            this.createFloatingText(data);

        });

        this.uiEvents.on("floating:rewards", (data) => {
            this.showRewards(data);
        });

    }

    createFloatingText(data) {

        const {
            text = "",
            x,
            y,
            color = "#ffffff",
            fontSize = "16px",
            duration = 3000,
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

        this.controllers.camera.ignoreInUICamera([container]);
    }

    showRewards(data) {

        const rewards = [];

        if (data.xp) {
            rewards.push({
                icon: "star",
                value: data.xp,
                color: "#ffff88"
            });
        }

        if (data.gold) {
            rewards.push({
                icon: "gold_icon",
                value: data.gold,
                color: "#ffd700"
            });
        }

        if (data.money) {
            rewards.push({
                icon: "cash_icon",
                value: data.money,
                color: "#ffd700"
            });
        }

        this.createFloatingRow(data.x, data.y, rewards);
    }

    createFloatingRow(x, y, rewards) {

        const container = this.scene.add.container(x, y).setDepth(2000);

        let offsetX = 0;

        rewards.forEach(r => {

            const icon = this.scene.add.image(offsetX, 0, r.icon).setDisplaySize(16, 16)

            const text = this.scene.add.text(offsetX + 12, 0, `${r.value}`, {
                fontSize: "14px",
                color: r.color,
                stroke: "#000",
                strokeThickness: 3
            }).setOrigin(0, 0.5);

            container.add([icon, text]);

            offsetX += text.width + 20;

        });

        this.scene.tweens.add({
            targets: container,
            y: y - 40,
            alpha: 0,
            duration: 4000,
            ease: "Cubic.easeOut",
            onComplete: () => container.destroy()
        });

        this.controllers.camera.ignoreInUICamera([container]);
    }

}