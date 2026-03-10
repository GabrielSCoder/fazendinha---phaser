export default class XPController {

    constructor(scene, xpTable, uiEvents) {

        this.scene = scene;
        this.uiEvents = uiEvents;

        this.table = xpTable;

        this.totalXP = 0;
        this.level = 1;

        this.maxLevel = xpTable[xpTable.length - 1].level;

        this.gameEvents()
    }

    gameEvents() {
        this.uiEvents.on("action:addXP", (amount) => {
            this.addXP(amount);
        });

        this.uiEvents.on("xp:getLevel", (callback) => {

            callback(this.level);

        });
    }

    addXP(amount) {

        if (amount <= 0) return;

        this.totalXP += amount;

        const newLevel = this.getLevelFromXP(this.totalXP);

        if (newLevel > this.level) {

            for (let lvl = this.level + 1; lvl <= newLevel; lvl++) {
                this.onLevelUp(lvl);
            }

            this.level = newLevel;
        }

        this.emitUpdate();

    }

    // encontra level pelo xp total
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

        const current = this.table[this.level - 1];

        return this.totalXP - current.xp_cumulative;

    }

    getXPToNextLevel() {

        if (this.level >= this.maxLevel) return 0;

        return this.table[this.level - 1].xp_to_next;

    }

    getNextLevelTotalXP() {

        if (this.level >= this.maxLevel) {
            return this.totalXP;
        }

        return this.table[this.level].xp_cumulative;

    }

    getProgressRatio() {

        const xp = this.getXPIntoLevel();
        const needed = this.getXPToNextLevel();

        if (needed === 0) return 1;

        return xp / needed;

    }

    onLevelUp(level) {

        console.log("LEVEL UP:", level);

        this.uiEvents.emit("profile:levelUp", {
            level: level
        });

    }

    emitUpdate() {

        this.uiEvents.emit("profile:xpUpdated", {

            level: this.level,
            xpAtual: this.totalXP,
            xpObjetivo: this.getNextLevelTotalXP()

        });

    }

    getData() {

        return {
            level: this.level,
            totalXP: this.totalXP
        };

    }

    loadData(data) {

        this.totalXP = data.totalXP || 0;
        this.level = this.getLevelFromXP(this.totalXP);

        this.emitUpdate();

    }

}