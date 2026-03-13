export default class SidesUi {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.uiEvents = config.uiEvents;
        this.width = scene.scale.width;
        this.height = scene.scale.height;

        this.eastSideContainer = scene.add.container(0, 0).setVisible(false);
        this.westSideContainer = scene.add.container(0, 0).setVisible(false);
    }

    show() {
        this.eastSideContainer.setVisible(true);
        this.westSideContainer.setVisible(true);
    }



}