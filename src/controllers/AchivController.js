export default class AchivController {

    constructor(scene, achivs, saveController, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = config.uiEvents;
        this.saveController = saveController;
        this.creativeMode = scene.gameVariables.creativeMode;
        this.achivsBD = achivs.filter(x => x.active == true);;
        this.achivsById = {};
        this.activeAchivs = {};
    }

    init() {

        this.activeAchivs = this.saveController.getAchievements();

        this.achivsBD.forEach(m => {
            this.achivsById[m.id] = m
        })

        this.achivEvents()
    }

    getAchivRecordById(id) {
        return this.saveController.getAchievements()[id];
    }

    achivEvents() {

        if (this.scene.gameVariables.creativeMode) return;

        this.uiEvents.on("data:getAchivs", (callback) => {

            callback({
                list: this.getAchievementsList()
            });

        });

        this.uiEvents.on("plant", data => {
            this.onAction({ action: "plant", ...data })
        })

        this.uiEvents.on("place", data => {
            this.onAction({ action: "place", ...data })
        })

        this.uiEvents.on("harvest", data => {
            this.onAction({ action: "harvest", ...data })
        })

        this.uiEvents.on("plow", data => {
            this.onAction({ action: "plow", ...data })
        })

        this.uiEvents.on("renewSoil", data => {
            this.onAction({ action: "renew", ...data })
        })

        this.uiEvents.on("transaction:gold", data => {
            this.onAction({ action: "transaction", target: "gold", amount: data, ...data })
        })

        this.uiEvents.on("transaction:money", data => {
            this.onAction({ action: "transaction", target: "money", amount: data, ...data })
        })
    }

    onAction(data) {

        Object.values(this.achivsById).forEach(achiv => {

            const record = this.activeAchivs[achiv.id];

            if (!record) return;

            if (record.steps_done >= achiv.states.length)
                return;

            const state = achiv.states[record.steps_done];

            state.objectives.forEach(obj => {

                if (!this.matches(obj, data))
                    return;

                if (data.action === "transaction") {
                    record.amount += data.amount;
                } else {
                    record.amount++;
                }

                this.uiEvents.emit("data:achivChange", {
                    list: this.getAchievementsList()
                })

                this.checkStateCompletion(achiv);

            });

        });
    }

    matches(obj, data) {

        if (obj.action !== data.action)
            return false;

        if (obj.target && obj.target !== data.target)
            return false;

        if (obj.filters) {

            for (const key in obj.filters) {

                if (data[key] !== obj.filters[key])
                    return false;

            }

        }

        return true;
    }

    checkStateCompletion(achiv) {

        const record = this.activeAchivs[achiv.id];

        while (record.steps_done < achiv.states.length) {

            const state = achiv.states[record.steps_done];

            const completed = state.objectives.every(obj => {
                return record.amount >= obj.amount;
            });

            if (!completed)
                break;

            this.completeState(achiv);
        }

    }

    completeState(achiv) {

        const record = this.activeAchivs[achiv.id];

        const complete_rec = this.achivsById[achiv.id];

        const state = achiv.states[record.steps_done];

        if (state.reward)
            this.giveReward(state.reward);

        record.steps_done++;

        this.uiEvents.emit("ui:notify", { type: "achiv", data: { title: complete_rec.title, img: complete_rec.img, reward: state.reward } })

        this.uiEvents.emit("data:achivChange", {
            list: this.getAchievementsList()
        })

        if (record.steps_done >= achiv.states.length) {

            if (achiv.final_reward)
                this.giveReward(achiv.final_reward);

        }

    }

    giveReward(reward) {

        if (!reward)
            return;

        if (reward.gold)
            this.controllers.profile.setGold(reward.gold);

        if (reward.money)
            this.controllers.profile.setMoney(reward.money);

        if (reward.xp)
            this.controllers.xp.addXP(reward.xp);

    }

    getAchievementData(id) {

        const achiv = this.achivsById[id];
        const record = this.activeAchivs[id];

        if (!achiv || !record)
            return null;

        const nextState = achiv.states[record.steps_done];

        return {

            id: achiv.id,

            title: achiv.title,

            description: achiv.description,

            img: achiv.img,

            stars: record.steps_done,

            completed: record.steps_done >= achiv.states.length,

            amount: record.amount,

            target: nextState
                ? nextState.objectives[0].amount
                : achiv.states[achiv.states.length - 1].objectives[0].amount

        };

    }

    getAchievementsList() {

        return Object.keys(this.achivsById).map(id => {

            return this.getAchievementData(Number(id));

        });

    }
}