export default class SidesUi {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.controllers = scene.controllers;

        this.width = scene.scale.width;
        this.height = scene.scale.height;

        this.circleSize = 64;
        this.spacing = 20;

        this.onceCreated = false;

        this.missionButtons = {};

        this.eastSideContainer = scene.add.container(this.width - 60, this.height / 2 - 200);
        this.westSideContainer = scene.add.container(90, this.height / 2);

        this.eastSideContainer.setDepth(9997);
        this.westSideContainer.setDepth(9997);

    }

    init() {

        this.uiEvents.on("data:missions", (result) => {
            this.start(result)
        })

        this.uiEvents.on("ui:showAlert", (data) => {
            this.showAlert(data)
        })

        this.start(this.controllers.missions.getMissions())
    }

    start(data) {
        this.syncMissions(data);
    }

    syncMissions(data) {

        const currentIds = new Set(Object.keys(this.missionButtons));
        const newIds = new Set(data.map(m => String(m.id)));


        currentIds.forEach(id => {
            if (!newIds.has(id)) {
                const btn = this.missionButtons[id];

                if (btn) {
                    btn.destroy();
                }

                delete this.missionButtons[id];
            }
        });


        data.forEach((mission, index) => {

            if (!this.missionButtons[mission.id]) {

                const offset = index * (this.circleSize + this.spacing);

                const btn = this.createCircleButton(mission, offset);
                const label = this.createLabel(mission, offset, "east");

                btn.on("pointerover", () => label.setVisible(true));
                btn.on("pointerout", () => label.setVisible(false));

                this.eastSideContainer.add([btn, label]);

                this.missionButtons[mission.id] = btn;
            }

        });


        this.repositionButtons(data);

        this.show();
    }

    repositionButtons(data) {

        data.forEach((mission, index) => {

            const btn = this.missionButtons[mission.id];

            if (!btn) return;

            const offset = index * (this.circleSize + this.spacing);

            btn.y = offset;


        });

    }

    createEastButtons(data) {

        Object.entries(data).forEach(([index, key]) => {

            const offset = index * (this.circleSize + this.spacing);

            const btn = this.createCircleButton(key, offset);

            const label = this.createLabel(key, offset, "east");

            this.missionButtons[mission.id] = {
                btn,
                label
            };

            btn.on("pointerover", () => {
                label.setVisible(true);
            });

            btn.on("pointerout", () => {
                label.setVisible(false);
            });

            this.eastSideContainer.add([btn, label]);

        });

        this.controllers.camera.ignoreInMainCamera([this.eastSideContainer]);

    }

    createWestButtons() {


    }

    createLabel(key, offsetY, side) {

        const offsetX = side === "east" ? -40 : 60;

        const container = this.scene.add.container(offsetX, offsetY);

        const bg = this.scene.add.rectangle(0, 0, 140, 28, 0x000000, 1);

        const text = this.scene.add.text(0, 0, key.title, {
            fontSize: "14px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular'
        });

        if (side === "east") {

            bg.setOrigin(1, 0.5);
            text.setOrigin(1, 0.5);
            text.x = -10;

        } else {

            bg.setOrigin(0, 0.5);
            text.setOrigin(0, 0.5);
            text.x = 10;

        }

        container.add([bg, text]);

        container.setVisible(false);

        return container;
    }

    createCircleButton(key, offsetY) {

        const radius = this.circleSize / 2;

        const container = this.scene.add.container(0, offsetY);

        const bg = this.scene.add.circle(0, 0, radius, 0xfffff, 1)
            .setStrokeStyle(2, 0xffffff);

        const icon = this.scene.add.image(0, 0, key.icon)
            .setScale(0.2);

        // indicador !
        const alert = this.scene.add.text(radius - 8, -radius + 8, "!", {
            fontSize: "20px",
            color: "#ff0000",
            fontStyle: "bold",
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0.5);

        alert.setVisible(false);

        container.alert = alert;

        container.setSize(this.circleSize, this.circleSize);
        container.setInteractive({ useHandCursor: true });

        container.on("pointerover", () => {
            container.setScale(1.05);
        });

        container.on("pointerout", () => {
            container.setScale(1);
        });

        container.on("pointerup", () => {

            if (container.alert) {
                container.alert.setVisible(false);
            }

            if (this.uiEvents) {
                this.uiEvents.emit("ui:showMission", { id: key.id })
            }

        });

        container.add([bg, icon, alert]);

        return container;

    }

    refreshEastButtons(data) {

        this.eastSideContainer.removeAll(true);

        this.createEastButtons(data);

    }

    showAlert(data) {

        const btn = this.missionButtons[data.missionId];

        if (!btn || !btn.alert) return;

        btn.alert.setVisible(true);

        this.scene.tweens.add({
            targets: btn.alert,
            scale: { from: 1, to: 1.3 },
            duration: 400,
            yoyo: true,
            repeat: -1
        });

    }
    show() {

        this.eastSideContainer.setVisible(true);
        this.westSideContainer.setVisible(true);

    }

    hide() {

        this.eastSideContainer.setVisible(false);
        this.westSideContainer.setVisible(false);

    }

}