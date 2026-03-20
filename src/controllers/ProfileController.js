export default class ProfileController {
    constructor(scene, config = {}, saveController) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.input = scene.input;
        this.itemMenuUI = scene.itemMenuUI;
        this.gridUtils = scene.controllers.gridUtils;
        this.uiEvents = config.uiEvents;
        this.AcoesUtils = scene.acoesUtils;
        this.interact = scene.interactController;
        this.creativeMode = scene.gameVariables.creativeMode;
        this.saveController = saveController;
    }

    init() {
        this.classEvents();
    }

    checkMissions() {
        const data = this.controllers.xp.getData()
        this.controllers.missions.checkLevelUnlocks(data.level)
    }

    classEvents() {

        this.uiEvents.on("action:buyItem", (data, test) => {
            this.buyItem(data, test)
        })

        this.uiEvents.on("action:getGold", (callback) => {
            callback(this.getGold())
        })

        this.uiEvents.on("action:setGold", (data) => {
            this.setGold(data)
        })

        this.uiEvents.on("action:getMoney", (callback) => {
            callback(this.getMoney())
        })

        this.uiEvents.on("action:setMoney", (data) => {
            this.setMoney(data)
        })

        this.uiEvents.on("save:user:gold", () => {
            this.uiEvents.emit("update:profile", this.getData());
        });

        this.uiEvents.on("save:user:money", () => {
            this.uiEvents.emit("update:profile", this.getData());
        });

        this.uiEvents.on("action:GetAllProfileData", (callback) => {

            callback(this.getData())
        })

        this.checkMissions();
    }

    getData() {

        return {
            gold: this.saveController.getUser().gold,
            money: this.saveController.getUser().money,
        }
    }

    getGold() {
        return this.saveController.getUser().gold;
    }

    getMoney() {
        return this.saveController.getUser().money;
    }

    setGold(data) {

        const gold = data.amount || data

        if ((this.getGold() + gold) < 0) return;

        this.saveController.addUser("gold", gold);

        if (data.x !== undefined) {

            this.uiEvents.emit("ui:floatingText", {
                text: `${data.amount}`,
                x: data.x,
                y: data.y,
                color: "#ffff66",
                icon: "gold_icon"
            });
        }
    }

    setMoney(data) {

        const money = data.amount || data

        if ((this.getMoney() + money) < 0) return;

        this.saveController.addUser("money", money);
    }

    buyItem(data, callback) {

        if (this.creativeMode) {
            callback(true)
            return;
        }

        if (data.price < 0 || !data.level || !data.type) {
            callback(false);
            return;
        }

        if (data.type === "gold") {

            if ((this.getGold() - data.price) >= 0) {
                callback(true);
            } else {

                callback(false);
            }

            return;
        }

        if (data.type === "money") {

            if ((this.getMoney() - data.price) >= 0) {
                callback(true);
            } else {

                callback(false);
            }

            return;
        }

        callback(false);
    }

}
