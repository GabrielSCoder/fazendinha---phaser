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

        this.initialLevel = preset.initialLevel ?? 1;
        this.actualLevel = preset.actualLevel ?? 2;
        this.experienceAmount = preset.experience ?? 30;
        this.gold = preset.gold ?? 600;
        this.money = preset.money ?? 600;

        this.classEvents();

    }

    classEvents() {
        this.uiEvents.on("action:getExperience", () => {
            this.getExperience()


        })

        this.uiEvents.on("action:setExperience", (amount) => {
            this.setExperience(amount);

            this.uiEvents.emit("update:profile", this.getData());
        })

        this.uiEvents.on("action:getLevel", () => {
            this.getLevel()

        })

        this.uiEvents.on("action:getGold", () => {
            this.getGold()
        })

        this.uiEvents.on("action:setGold", (amount) => {
            console.log("modificando ouro")
            this.setGold(amount)

            this.uiEvents.emit("update:profile", this.getData());
        })

        this.uiEvents.on("action:getMoney", () => {
            this.getExperience()
        })

        this.uiEvents.on("action:setMoney", (amount) => {
            console.log("modificando grana")
            this.setMoney(amount)

            this.uiEvents.emit("update:profile", this.getData());
        })

        this.uiEvents.on("action:buyItemGold", (amount, level) => {
            this.buyItemGold(amount, level);

            this.uiEvents.emit("update:profile", this.getData());
        })

        this.uiEvents.on("action:buyItemMoney", (amount, level) => {
            this.buyItemMoney(amount, level);

            this.uiEvents.emit("update:profile", this.getData());
        })

        this.uiEvents.on("action:GetAllProfileData", (callback) => {

            const data = {
                "level": this.actualLevel,
                "ExperienceAmount": this.experienceAmount,
                "gold": this.gold,
                "money": this.money
            }

            callback(data)
        })
    }

    getData() {
        return {
            level: this.actualLevel,
            gold: this.gold,
            money: this.money,
            xp: this.experienceAmount
        }
    }

    getExperience() {
        return this.experienceAmount;
    }

    getLevel() {
        return this.actualLevel;
    }

    setExperience(valor) {
        if ((this.experienceAmount + valor) < this.experienceAmount) return;
        this.experienceAmount += valor;
    }

    getGold() {
        return this.gold;
    }

    setGold(valor) {
        if ((this.gold + valor) < 0) return;
        this.gold += valor;
    }

    getMoney() {
        return this.money;
    }

    setMoney(valor) {
        if ((this.money + valor) < 0) return;
        this.money += valor;
    }

    buyItemGold(price, level) {
        if ((this.gold - price) < 0) {
            console.log("Dinheiro insuficiente");
            return;
        }

        if (this.actualLevel < level) {
            console.log("Level insuficiente");
            return;
        }

        this.gold -= price;
    }

    buyItemMoney(price, level) {
        if ((this.money - price) < 0) {
            console.log("Grana insuficiente");
            return;
        }

        if (this.actualLevel < level) {
            console.log("Level insuficiente");
            return;
        }

        this.money -= price;
    }

}
