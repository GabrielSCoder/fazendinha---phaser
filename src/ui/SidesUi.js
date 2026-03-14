export default class SidesUi {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.controllers = scene.controllers;

        this.width = scene.scale.width;
        this.height = scene.scale.height;

        this.circleSize = 64;
        this.spacing = 20;

        this.eastSideContainer = scene.add.container(this.width - 90, this.height / 2 - 90);
        this.westSideContainer = scene.add.container(90, this.height / 2);

        this.eastSideContainer.setDepth(9997);
        this.westSideContainer.setDepth(9997);

        this.createEastButtons();
        this.createWestButtons();
    }

    init() {

        this.show();

    }

    createEastButtons() {

        const btn1 = this.createCircleButton(0);
        // const btn2 = this.createCircleButton(this.circleSize + this.spacing);

        this.eastSideContainer.add(btn1);
        // this.eastSideContainer.add(btn2);

        this.controllers.camera.ignoreInMainCamera([this.eastSideContainer, this.eastSideContainer])

    }

    createWestButtons() {

        // reservado para futuro
        // pode colocar notificações, atalhos etc

    }

    createCircleButton(offsetY) {

        const radius = this.circleSize / 2;

        const container = this.scene.add.container(0, offsetY);

        const bg = this.scene.add.circle(0, 0, radius, 0xfffff, 0.8)
            .setStrokeStyle(2, 0xffffff);

        const icon = this.scene.add.image(0, 0, 'enxada')
            .setScale(0.2);

        bg.setInteractive({ useHandCursor: true });

        bg.on("pointerover", () => {
            bg.setScale(1.05);
        });

        bg.on("pointerout", () => {
            bg.setScale(1);
        });

        bg.on("pointerup", () => {

            if (this.uiEvents) {
                this.uiEvents.emit("ui:showMission", {id : 1 })
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