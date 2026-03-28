export default class UINotificationController {

    constructor(scene, configs = {}) {

        this.scene = scene;
        this.uiEvents = configs.uiEvents;
        this.controllers = scene.controllers;

        this.bgFullWidth = 500;
        this.bgFullHeight = 500;
        this.bgMediumHeight = 200;

        this.queue = [];
        this.isShowing = false;

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

        this.levelContainer = this.scene.add.container(0, 0).setVisible(false);
        this.newMissionContainer = this.scene.add.container(0, 0).setVisible(false);
        this.missionContainer = this.scene.add.container(0, 0).setVisible(false);
        this.genericContainer = this.scene.add.container(0, 0).setVisible(false);
        this.sellContainer = this.scene.add.container(0, 0).setVisible(false);
        this.itemContainer = this.scene.add.container(0, 0).setVisible(false);
        this.concludedContainer = this.scene.add.container(0, 0).setVisible(false);
        this.advideContainer = this.scene.add.container(0, 0).setVisible(false);

        this.container.add([
            this.newMissionContainer,
            this.levelContainer,
            this.missionContainer,
            this.genericContainer,
            this.sellContainer,
            this.concludedContainer,
            this.itemContainer,
            this.advideContainer
        ]);

        this.uiEvents.on("ui:notify", this.notify, this);

        this.uiEvents.emit("ui:warnings", (data) => {
            this.notifyWarnings(data)
        })
    }

    notify(data) {
        console.log(data)
        this.uiEvents.emit("ui:closeMenuSprite")
        this.uiEvents.emit("action:StopPlowing")
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
        this.newMissionContainer.setVisible(false);
        this.genericContainer.setVisible(false);
        this.sellContainer.setVisible(false);
        this.concludedContainer.setVisible(false);
        this.itemContainer.setVisible(false);
        this.advideContainer.setVisible(false);

        switch (data.type) {

            case "levelUp":
                this.createLevelPopup(data);
                this.levelContainer.setVisible(true);
                break;

            case "newMission":
                this.createNewMissionPopup(data);
                this.newMissionContainer.setVisible(true);
                break;

            case "mission":
                this.createMissionPopup(data);
                this.missionContainer.setVisible(true);
                break;

            case "item":
                this.createItemPopup(data);
                this.itemContainer.setVisible(true);
                break;

            case "conclusion_mission":
                this.createConclusionMissionPopup(data);
                this.concludedContainer.setVisible(true);
                break;

            case "sell":
                this.createSellPopup(data);
                this.sellContainer.setVisible(true);
                break;

            case "advice":
                this.createAdviceBanner(data.data);
                this.advideContainer.setVisible(true);
                break;

            default:
                this.createGenericPopup(data);
                this.genericContainer.setVisible(true);
        }

        this.open();
    }

    createAdviceBanner(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_medio").setDisplaySize(500, 200);

        const body = this.scene.add.text(
            0,
            0,
            data,
            {
                fontSize: "22px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2, wordWrap: {
                    width: this.bgFullWidth * 0.9
                }
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        // const confirm = this.createConfirmButton();
        const close = this.createCloseButton(data);

        this.advideContainer.add([bg, body, close]);
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

        const confirm = this.createConfirmButton(data);

        // const close = this.createCloseButton();

        this.levelContainer.add([bg, title, body, footer, sub, confirm]);
    }

    createItemPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira").setDisplaySize(500, 400);

        const itemData = data.data

        const amount = data.amount ?? 1;

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
            -this.bgFullHeight / 2 + 180,
            "Você recebeu: ",
            { fontSize: "20px", color: "#fbff00", fontFamily: 'LuckiestGuy-Regular' }
        ).setOrigin(0.5).setStroke('#000', 4);

        const description = this.scene.add.text(
            0,
            60,
            `${itemData.nome} x${amount}`,
            { fontSize: "20px", color: "#ffffff", align: "center", fontFamily: 'LuckiestGuy-Regular', wordWrap: { width: 420 } }
        ).setOrigin(0.5).setStroke('#000', 4);


        const item = this.scene.add
            .image(0, 0, itemData.img)
            .setDisplaySize(100, 100);


        const confirm = this.createConfirmButton(data);

        this.itemContainer.add([bg, title, body, description, item, confirm]);
    }

    createMissionPopup(data) {

        const width = 500;
        const height = 500;

        const mission = data.mission

        const root = this.scene.add.container(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2
        );

        const bg = this.scene.add.image(0, 0, "fundo_madeira_branco").setDisplaySize(width, height)

        root.add(bg);

        let y = -height / 2 + 60;

        // descrição
        const description = this.scene.add.text(
            0,
            y,
            mission.description,
            { fontSize: "16px", color: "#ffffff", align: "center", fontFamily: 'LuckiestGuy-Regular', wordWrap: { width: 420 } }
        ).setOrigin(0.5).setStroke('#000', 4);

        root.add(description);

        y += description.height + 20;

        // titulo
        const title = this.scene.add.text(
            0,
            y,
            mission.title,
            { fontSize: "28px", color: "#fbff00", fontFamily: 'LuckiestGuy-Regular' }
        ).setOrigin(0.5).setStroke('#000', 4);

        root.add(title);

        y += 80;

        // container de objetivos
        const objectivesContainer = this.scene.add.container(0, y);

        root.add(objectivesContainer);

        let rowY = 0;

        mission.objectives.forEach((obj, index) => {

            const row = this.createObjectiveRow(obj, width - 100, index === mission.objectives.length - 1);

            row.y = rowY;

            objectivesContainer.add(row);

            rowY += 50;

        });

        const confirm = this.createConfirmButton(data);

        this.missionContainer.add([bg, title, description, objectivesContainer, confirm]);

    }

    createConclusionMissionPopup(data) {

        const mission = data.data;

        const bg = this.scene.add.image(0, 0, "fundo_madeira").setDisplaySize(500, 400);

        const title = this.scene.add.text(
            0,
            -this.bgFullHeight / 2 + 80,
            "Parabéns",
            {
                fontSize: '30px',
                fontStyle: 'bold',
                color: '#fff',
                fontFamily: 'LuckiestGuy-Regular'
            }
        ).setStroke('#000', 4).setOrigin(0.5);

        const body = this.scene.add.text(
            0,
            -50,
            `Você completou a missão`,
            {
                fontSize: "28px",
                color: "#ffffff",
                fontFamily: 'LuckiestGuy-Regular',
                lineSpacing: 2
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        const mission_title = this.scene.add.text(
            0,
            -20,
            mission.title,
            {
                fontSize: "28px",
                color: "#eeff00",
                fontFamily: 'LuckiestGuy-Regular'
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        const footer = this.scene.add.text(
            0,
            60,
            "Recompensas:",
            {
                fontSize: "20px",
                color: "#fbff00",
                fontFamily: 'LuckiestGuy-Regular'
            }
        ).setOrigin(0.5).setStroke('#000', 4);


        const rewardContainer = this.scene.add.container(0, 110);

        this.createRewardLine(rewardContainer, mission);

        const confirm = this.createConfirmButton(data);

        this.concludedContainer.add([
            bg,
            title,
            body,
            mission_title,
            footer,
            rewardContainer,
            confirm
        ]);
    }

    createRewardLine(rewardContainer, mission) {

        const reward = mission.reward || {};

        const rewards = [];

        if (reward.gold) {
            rewards.push({ icon: "gold_icon", value: reward.gold });
        }

        if (reward.money) {
            rewards.push({ icon: "cash_icon", value: reward.money });
        }

        if (reward.xp) {
            rewards.push({ icon: "star", value: reward.xp });
        }

        const spacing = 90;
        const totalWidth = (rewards.length - 1) * spacing;

        let offset = -totalWidth / 2;

        rewards.forEach(r => {

            const icon = this.scene.add
                .image(offset, 0, r.icon)
                .setDisplaySize(32, 32);

            const text = this.scene.add.text(offset + 22, 0, r.value, {
                fontSize: "18px",
                color: "#ffffff",
                fontFamily: "LuckiestGuy-Regular"
            })
                .setOrigin(0, 0.5)
                .setStroke("#000", 3);

            rewardContainer.add([icon, text]);

            offset += spacing;

        });

    }


    createObjectiveRow(objective, width, isLast) {

        const row = this.scene.add.container(0, 0);

        const padding = 10;
        const height = 60;

        // icone
        const icon = this.scene.add.image(
            -width / 2 + 25,
            0,
            objective.icon || "semente_mirtilo"
        ).setScale(0.15);

        // texto
        const text = this.scene.add.text(
            -width / 2 + 50,
            0,
            objective.text,
            {
                fontSize: "16px",
                color: "#ffffff",
                wordWrap: { width: width * 0.55 },
                fontFamily: "LuckiestGuy-Regular"
            }
        )
            .setOrigin(0, 0.5)
            .setStroke("#000", 3);

        // progresso
        const progress = this.scene.add.text(
            width / 2 - padding - 20,
            0,
            `${objective.progress} / ${objective.required}`,
            {
                fontSize: "20px",
                color: !objective.done ? "#ffffff" : "#2bfc01cc",
                fontFamily: "LuckiestGuy-Regular"
            }
        )
            .setOrigin(1, 0.5)
            .setStroke("#000", 4);

        row.add([icon, text, progress]);

        if (!isLast) {

            const line = this.scene.add.rectangle(
                0,
                height / 2,
                width * 0.9,
                2,
                0x000,
                0.25
            ).setOrigin(0.5);

            row.add(line);

        }

        return row;
    }

    createNewMissionPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_branco").setDisplaySize(500, 400);

        const title = this.scene.add.text(
            0,
            -this.bgFullHeight / 2 + 120,
            "Nova Missão!",
            { fontSize: "28px", color: "#000", fontFamily: 'LuckiestGuy-Regular' }
        ).setOrigin(0.5).setStroke('#fff', 4);

        const body = this.scene.add.text(
            0,
            0,
            `${data.text}`,
            { fontSize: "28px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2 }
        ).setOrigin(0.5).setStroke('#000', 4);

        const confirm = this.createConfirmButton(data);
        // const close = this.createCloseButton(data.type);

        this.newMissionContainer.add([bg, title, body, confirm]);
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
        const close = this.createCloseButton(data);

        this.genericContainer.add([bg, body, close]);
    }

    createSellPopup(data) {

        const bg = this.scene.add.image(0, 0, "fundo_madeira_medio").setDisplaySize(500, 200);

        const body = this.scene.add.text(
            0,
            0,
            `Tem certeza que deseja vender ${data.nome} por ${data.preco} ouros ?`,
            {
                fontSize: "20px", color: "#ffffff", fontFamily: 'LuckiestGuy-Regular', lineSpacing: 2, wordWrap: {
                    width: this.bgFullWidth * 0.8
                }
            }
        ).setOrigin(0.5).setStroke('#000', 4);

        const confirm = this.createConfirmButton(data);
        const close = this.createCloseButton(data.type);

        this.sellContainer.add([bg, body, confirm, close]);
    }

    createCloseButton(type) {

        let offsetWidth = 0;
        let offsetHeight = 0;

        switch (type) {
            case "levelUp":
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

    createConfirmButton(data) {

        let offsetHeight = 0;

        switch (data.type) {
            case "levelUp":
                offsetHeight = 180;
                break;
            case "item":
                offsetHeight = 180;
                break;
            case "newMission":
                offsetHeight = 180;
                break;
            case "conclusion_mission":
                offsetHeight = 180;
                break;
            case "mission":
                offsetHeight = 220;
                break;
            default:
                offsetHeight = 80;
                break;
        }

        const btn = this.scene.add.image(0, offsetHeight, "confirm_button")
            .setScale(0.7)
            .setInteractive({ useHandCursor: true });


        btn.on("pointerup", () => { this.uiEvents.emit(data.action, data); this.close() });
        btn.on("pointerover", () => btn.setScale(0.8))
        btn.on("pointerout", () => btn.setScale(0.7))

        return btn;
    }

    notifyWarnings(data) {

        if (!data.length) return;

        let array = []

        data.forEach(element => {
            this.notify({type : "advice", data : element.mensagem})
            array.push(element.id)
        })

        this.controllers.save.changeMessages(array)
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