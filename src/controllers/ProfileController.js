export default class ProfileController {
    constructor(scene, config = {}, preset = {}) {
        this.scene = scene;
        this.gridSize = scene.gameVariables.gridSize;
        this.gridWidth = scene.gameVariables.gridWidth;
        this.gridHeight = scene.gameVariables.gridHeight;
        this.offsetX = scene.gameVariables.offsetX;
        this.offsetY = scene.gameVariables.offsetY;
        this.logicFactor = scene.gameVariables.logicFactor;
        this.input = scene.input;
        this.itemMenuUI = scene.itemMenuUI;
        this.gridUtils = scene.gridUtils;
        this.uiEvents = config.uiEvents;
        this.AcoesUtils = scene.acoesUtils;
        this.interact = scene.interactController;


        this.gold = preset.gold ?? 600;
        this.money = preset.money ?? 6;

        this.classEvents();

    }

    classEvents() {

        this.uiEvents.on("action:buyItem", (data, test) => {
            this.buyItem(data, test)
        })

        this.uiEvents.on("action:getLevel", () => {
            this.getLevel()
        })

        this.uiEvents.on("action:getGold", (callback) => {
            callback(this.getGold())
        })

        this.uiEvents.on("action:setGold", (data) => {
            this.setGold(data)
        })

        this.uiEvents.on("action:getMoney", () => {
            this.getExperience()
        })

        this.uiEvents.on("action:setMoney", (data) => {
            this.setMoney(data)
        })

        this.uiEvents.on("action:GetAllProfileData", (callback) => {

            const data = {
                "gold": this.gold,
                "money": this.money
            }

            callback(data)
        })
    }

    getData() {
        return {
            gold: this.gold,
            money: this.money,
        }
    }

    getGold() {
        return this.gold;
    }

    setGold(data) {

        const gold = data.amount || data

        if ((this.gold + gold) < 0) return;
        this.gold += gold;

        if (data.x !== undefined) {

            this.uiEvents.emit("ui:floatingText", {
                text: `${data.amount}`,
                x: data.x,
                y: data.y,
                color: "#ffff66",
                icon: "gold_icon"
            });

        }

        this.uiEvents.emit("update:profile", this.getData());
    }

    getMoney() {
        return this.money;
    }

    setMoney(valor) {
        
        if ((this.money + valor) < 0) return;
        this.money += valor;

        this.uiEvents.emit("update:profile", this.getData());
    }

    buyItem(data, callback) {

        if (data.price < 0 || !data.level || !data.type) {
            callback(false);
            return;
        }

        if (data.type === "gold") {

            if ((this.gold - data.price) >= 0) {
                callback(true);
            } else {
                
                callback(false);
            }

            return;
        }

        if (data.type === "money") {

            if ((this.money - data.price) >= 0) {
                callback(true);
            } else {
                
                callback(false);
            }

            return;
        }

        callback(false);
    }

}
