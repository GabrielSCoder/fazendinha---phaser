export default class XPController {

    constructor(scene, xpTable, uiEvents, saveController) {

        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = uiEvents;
        this.table = xpTable;
        this.saveController = saveController;
        this.maxLevel = xpTable[xpTable.length - 1].level;
    }



    init() {
        this.gameEvents()
    }

    gameEvents() {

        this.uiEvents.on("action:addXP", (data) => {

            this.addXP(data.amount || data);

            const amount = data.amount || data;

            if (data.x !== undefined) {

                this.uiEvents.emit("ui:floatingText", {
                    text: `${amount} XP`,
                    x: data.x,
                    y: data.y,
                    color: "#ffff66",
                    icon: "star"
                });

            }

        });

        this.uiEvents.on("xp:getLevel", (callback) => {

            callback(this.getLevel());

        });

        this.uiEvents.on("action:GetXPData", (callback) => {

            callback({
                level: this.getLevel(),
                xpAtual: this.getTotalXP(),
                xpObjetivo: this.getNextLevelTotalXP()
            });
        });

    }

    getTotalXP() {
        return this.saveController.getUser().xp;
    }

    getLevel() {
        return this.saveController.getUser().level;
    }

    addXP(amount) {

        if (amount <= 0) return;

        const currentXP = this.getTotalXP();
        const newXP = currentXP + amount;

        this.saveController.changeUser("xp", newXP);

        const newLevel = this.getLevelFromXP(this.getTotalXP());

        if (newLevel > this.getLevel()) {

            for (let lvl = this.getLevel() + 1; lvl <= newLevel; lvl++) {
                this.onLevelUp(lvl);
            }

            this.saveController.changeUser("level", newLevel);
        }

        this.emitUpdate();

    }

    getLevelFromXP(xp) {

        let left = 0;
        let right = this.table.length - 1;

        while (left <= right) {

            const mid = Math.floor((left + right) / 2);
            const entry = this.table[mid];

            if (xp >= entry.xp_cumulative) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }

        }

        return Math.min(this.table[right]?.level || 1, this.maxLevel);

    }

    getXPIntoLevel() {

        const current = this.table[this.getLevel() - 1];

        return this.getTotalXP() - current.xp_cumulative;

    }

    getXPToNextLevel() {

        if (this.getLevel() >= this.maxLevel) return 0;

        return this.table[this.getLevel() - 1].xp_to_next;

    }

    getNextLevelTotalXP() {

        if (this.getLevel() >= this.maxLevel) {
            return this.getTotalXP();
        }

        return this.table[this.getLevel()].xp_cumulative;

    }

    getProgressRatio() {

        const xp = this.getXPIntoLevel();
        const needed = this.getXPToNextLevel();

        if (needed === 0) return 1;

        return xp / needed;

    }

    onLevelUp(level) {

        this.uiEvents.emit("profile:levelUp", {
            level: level
        });

        this.uiEvents.emit("action:setMoney", 1);
        this.uiEvents.emit("ui:notify", { type: "levelUp", level: level, action: "" });
        this.controllers.missions.checkLevelUnlocks(level)
    }

    emitUpdate() {

        this.uiEvents.emit("profile:xpUpdated", {

            level: this.getLevel(),
            xpAtual: this.getTotalXP(),
            xpObjetivo: this.getNextLevelTotalXP()
        });

    }

    getData() {

        return {
            level: this.saveController.getUser().level,
            totalXP: this.saveController.getUser().xp
        };

    }
}