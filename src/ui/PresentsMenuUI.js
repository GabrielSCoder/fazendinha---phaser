import { debounce } from "../utils/debounce.js";
import PaginationUtils from "../utils/PaginationUtils.js";

export default class PresentsMenuUI {

    constructor(scene, config = {}) {

        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = config.uiEvents;

        this.menuContainer = this.scene.add.container(0, 0)

        this.bgHeight = 600
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

        this.uiEvents.emit("data:getPresents", (data) => {
            this.createMenuUI(data)
        })

        this.uiEvents.on("data:storageChange", (data) => {
            this.createMenuUI(data)
        })

        this.uiEvents.on("ui:showPresents", () => {
            this.show()
        })

        this.uiEvents.on("ui:hidePresents", () => {
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

        const list = data.list;

        const bg = this.scene.add.image(0, -20, "menu_bg")
            .setOrigin(0.5)
            .setDisplaySize(this.bgWidth, this.bgHeight);

        const title = this.scene.add.text(0, -this.bgHeight / 2 + 20, "Presentes", {
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#fff',
            fontFamily: 'LuckiestGuy-Regular'
        }).setStroke('#000', 4).setOrigin(0.5);

        const amount = this.scene.add.text(
            this.bgWidth / 2 - 80,
            -this.bgHeight / 2 + 20,
            `${data.amount} / ${data.limit}`,
            {
                fontSize: '28px',
                fontStyle: 'bold',
                color: '#fff',
                fontFamily: 'LuckiestGuy-Regular'
            }
        ).setStroke('#000', 4).setOrigin(0.5);

        const cardContainer = this.scene.add.container(
            -this.bgWidth / 2 + 300,
            -this.bgHeight / 2 + 320
        );


        this.pagination = new PaginationUtils(this.scene, {

            container: cardContainer,

            items: list,

            itemsPerPage: 8,

            cols: 4,

            spacingX: 20,
            spacingY: 50,

            startX: -160,
            startY: -120,

            renderItem: ({ container, data, x, y }) => {

                const card = this.createPresentCard(data);

                card.x = x;
                card.y = y;

                container.add(card);

            }

        });

        this.pagination.displayCurrentPage();


        this.pagination.createNavigation(
            { key: 'anterior_button', x: -this.bgWidth / 2, y: this.bgHeight / 2 - 300 },
            { key: 'proximo_button', x: this.bgWidth / 2, y: this.bgHeight / 2 - 300 }
        );

        const closeBtn = this.scene.add.image(
            this.bgWidth / 2 - 10,
            -this.bgHeight / 2 - 10,
            'close_button'
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
            amount,
            cardContainer,
            this.pagination.prevBtn,
            this.pagination.nextBtn,
            closeBtn
        ]);
    }

    createPresentCard(data) {

        const bgHeight = 260
        const bgWidth = 160

        const container = this.scene.add.container(0, 0);

        const bg = this.scene.add.image(0, 0, 'item_bg')
            .setOrigin(0.5)
            .setDisplaySize(bgWidth, bgHeight);

        const circle = this.scene.add.circle(bgWidth / 2 - 20, -bgHeight / 2 + 30, 20, 0xfffff, 1)
            .setStrokeStyle(2, 0xffffff);

        const amount = this.scene.add.text(bgWidth / 2 - 20, -bgHeight / 2 + 30, data.amount, {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#000000',
            fontFamily: 'LuckiestGuy-Regular'
        })
            .setStroke('#ffffff', 4)
            .setOrigin(0.5);

        const title = this.scene.add.text(0, -90, data.nome, {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#ffffff',
            fontFamily: 'LuckiestGuy-Regular'
        })
            .setStroke('#000', 4)
            .setOrigin(0.5);

        const image = this.scene.add.image(0, -20, data.img)
            .setOrigin(0.5)
            .setDisplaySize(80, 80);

        const button = this.createButton({ color: "green", text: "usar", action: "" });
        button.setPosition(0, 50);

        const button_vender = this.createButton({ color: "red", text: "vender", action: "" });
        button_vender.setPosition(0, 85);

        container.add([bg, title, circle, amount, image, button, button_vender]);

        return container;
    }

    createButton(data) {

        const text = this.scene.add.text(0, 100, data.text, {
            fontSize: '20px',
            fontFamily: 'LuckiestGuy-Regular',
            color: 'white',
            backgroundColor: data.color == "red" ? '#ff0000' : '#00ff0d',
            padding: { left: 8, right: 8, top: 4, bottom: 4 }
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });


        text.on("pointerup", () => {
            console.log("apertando")
        })

        text.on("pointerover", () => {
            text.setScale(1.2)
        })

        text.on("pointerout", () => {
            text.setScale(1)
        })

        return text
    }

    isOpen() {
        return this.menuContainer.visible;
    }
}