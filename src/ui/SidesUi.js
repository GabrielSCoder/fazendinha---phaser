export default class SidesUi {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.controllers = scene.controllers;

        this.width = scene.scale.width;
        this.height = scene.scale.height;

        this.circleSize = 64;
        this.spacing = 20;

        this.eastSideContainer = scene.add.container(this.width - 90, this.height / 2 - 200);
        this.westSideContainer = scene.add.container(90, this.height / 2);

        this.eastSideContainer.setDepth(9997);
        this.westSideContainer.setDepth(9997);

    }

    init() {

        this.uiEvents.on("data:missions", (result) => {
            this.start(result)
        })

    }

    start(data) {
        this.createEastButtons(data);
        this.createWestButtons();

        this.show();
    }

    createEastButtons(data) {

        console.log(data)

        Object.entries(data).forEach(([index, key]) => {

            const offset = index * (this.circleSize + this.spacing);

            const btn = this.createCircleButton(key, offset);

            const label = this.createLabel(key, offset, "east");

            btn.on("pointerover", () => {
                console.log("hdashdjkasdh")
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

        // reservado para futuro
        // pode colocar notificações, atalhos etc

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


        container.setSize(this.circleSize, this.circleSize);
        container.setInteractive({ useHandCursor: true });

        container.on("pointerover", () => {
            container.setScale(1.05);
        });

        container.on("pointerout", () => {
            container.setScale(1);
        });

        container.on("pointerup", () => {

            if (this.uiEvents) {
                this.uiEvents.emit("ui:showMission", { id: key.id })
            }

        });

        container.add([bg, icon]);

        return container;

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