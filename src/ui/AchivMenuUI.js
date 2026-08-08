import { debounce } from "../utils/debounce.js";
import PaginationUtils from "../utils/PaginationUtils.js";
import AchivCardUI from "./AchivCardUI.js";
import AchivShopUI from "./AchivCardUI.js";

export default class AchivMenuUI {

    constructor(scene, config = {}, achivs) {

        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = config.uiEvents;
        this.achivs = achivs;

        this.menuContainer = this.scene.add.container(0, 0)
        this.cardContainer = null;

        this.bgHeight = 500
        this.bgWidth = 800

    }

    init() {
        const cam = this.scene.cameras.main;

        this.overlay = this.scene.add.rectangle(0, 0, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.4)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(9998)
            .setVisible(false)
            .setInteractive();

        this.container = this.scene.add.container(cam.centerX, cam.centerY)
            .setDepth(9999)
            .setVisible(false)
            .setScrollFactor(0);

        this.container.add(this.menuContainer)

        this.controllers.camera.ignoreInMainCamera([this.container]);

        this.classEvents();
    }

    classEvents() {

        this.uiEvents.emit("data:getAchivs", (data) => {
            this.createMenuUI(data)
        })

        this.uiEvents.on("data:achivChange", (data) => {
            this.createMenuUI(data)
        })

        this.uiEvents.on("ui:showAchivs", () => {
            this.show()
        })

        this.uiEvents.on("ui:hideAchivs", () => {
            this.hide()
        })
    }

    hide() {
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.8,
            duration: 200,
            ease: 'Back.In',
            onComplete: () => {
                this.container.setVisible(false);
                this.overlay.setVisible(false);
            }
        });
    }

    show() {

        this.overlay.setVisible(true);
        this.container.setVisible(true).setAlpha(0).setScale(0.8);

        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Back.Out'
        });

    }

    createMenuUI(data) {

        if (!this.cardContainer) {
            this.createBaseUI();
        }

        this.updateCards(data.list);

    }

    createBaseUI() {

        const bg = this.scene.add.image(
            0,
            -20,
            "menu_bg"
        )
            .setOrigin(0.5)
            .setDisplaySize(this.bgWidth, this.bgHeight);

        const title = this.scene.add.text(
            0,
            -this.bgHeight / 2 + 20,
            "Conquistas",
            {
                fontSize: "30px",
                fontStyle: "bold",
                color: "#fff",
                fontFamily: "LuckiestGuy-Regular"
            }
        )
            .setStroke("#000", 4)
            .setOrigin(0.5);

        this.cardContainer = this.scene.add.container(
            -this.bgWidth / 2 + 240,
            -this.bgHeight / 2 + 170
        );

        const closeBtn = this.scene.add.image(
            this.bgWidth / 2 - 10,
            -this.bgHeight / 2 - 10,
            "close_button"
        )
            .setScale(0.2)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });


        const baseScale = closeBtn.scale;
        const debouncedClose = debounce(() => this.hide(), 150);

        closeBtn.on("pointerdown", debouncedClose);

        closeBtn.on("pointerover", () => {
            closeBtn.setScale(baseScale * 1.2);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.setScale(baseScale);
        });

        this.menuContainer.add([
            bg,
            title,
            this.cardContainer,
            closeBtn
        ]);

    }

    updateCards(list) {

        this.cardContainer.removeAll(true);

        list.forEach((achiv, index) => {

            const card = new AchivCardUI(this.scene, achiv);

            const col = index % 2;
            const row = Math.floor(index / 2);

            card.container.setPosition(
                col * 340,
                row * 180
            );

            this.cardContainer.add(card.container);
        });

    }

    isOpen() {
        return this.menuContainer.visible;
    }

      // createMenuUI(data) {

    //     console.log(data)

    //     const bg = this.scene.add.image(0, -20, "menu_bg")
    //         .setOrigin(0.5)
    //         .setDisplaySize(this.bgWidth, this.bgHeight);

    //     const title = this.scene.add.text(0, -this.bgHeight / 2 + 20, "Conquistas", {
    //         fontSize: '30px',
    //         fontStyle: 'bold',
    //         color: '#fff',
    //         fontFamily: 'LuckiestGuy-Regular'
    //     }).setStroke('#000', 4).setOrigin(0.5);

    //     this.cardContainer = this.scene.add.container(
    //         -this.bgWidth / 2 + 240,
    //         -this.bgHeight / 2 + 170
    //     );


    //     data.

    //         this.cardContainer.list.forEach((card, cardIndex) => {

    //             const starsContainer = card.list.find(
    //                 child => child.type === "Container"
    //             );

    //             console.log(
    //                 `Card ${cardIndex}:`,
    //                 starsContainer?.list.length ?? 0,
    //                 "estrelas"
    //             );

    //         });

    //     const closeBtn = this.scene.add.image(
    //         this.bgWidth / 2 - 10,
    //         -this.bgHeight / 2 - 10,
    //         'close_button'
    //     )
    //         .setScale(0.2)
    //         .setOrigin(0.5)
    //         .setInteractive({ useHandCursor: true });

    //     const baseScale = closeBtn.scale;
    //     const debouncedClose = debounce(() => this.hide(), 150);

    //     closeBtn.on("pointerdown", debouncedClose);

    //     closeBtn.on("pointerover", () => {
    //         closeBtn.setScale(baseScale * 1.2);
    //     });

    //     closeBtn.on("pointerout", () => {
    //         closeBtn.setScale(baseScale);
    //     });

    //     this.menuContainer.add([
    //         bg,
    //         title,
    //         this.cardContainer,
    //         closeBtn
    //     ]);
    // }
}