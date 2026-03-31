export default class MissionController {

    constructor(scene, missions, saveController = null, uiEvents) {

        this.scene = scene

        this.missionsDB = missions

        this.missionsById = {}

        missions.forEach(m => {
            this.missionsById[m.id] = m
        })

        this.uiEvents = uiEvents

        this.saveController = saveController

        this.controllers = scene.controllers;

    }

    init() {
        this.initMissions()

        if (this.scene.gameVariables.creativeMode) return;

        this.uiEvents.on("ui:showMission", (result) => {
            this.uiEvents.emit("ui:notify", { type: "mission", mission: this.getMissionUIData(result.id) })
        })

        this.uiEvents.on("game_action", data => {
            this.onAction(data)
        })

        this.uiEvents.on("plant", data => {
            //console.log(data)
            this.onAction({ action: "plant", ...data })
        })

        this.uiEvents.on("place", data => {
            //console.log(data)
            this.onAction({ action: "place", ...data })
        })

        this.uiEvents.on("harvest", data => {
            //console.log(data)
            this.onAction({ action: "harvest", ...data })
        })

        this.uiEvents.on("plow", data => {
            this.onAction({ action: "plow", ...data })
        })

        this.uiEvents.on("save:mission:update", () => {
            //console.log("missão mudada")
            this.uiEvents.emit("data:missions", this.getMissions());
        });

    }

    getActiveMissions() {
        return this.saveController.getMissions().activeMissions;
    }

    getCompletedMissions() {
        return this.saveController.getMissions().completedMissions;
    }

    initMissions() {

        const savedMissions = this.saveController.getMissions();

        const activeMissions = this.getActiveMissions();

        Object.values(savedMissions.activeMissions).forEach(saveData => {

            const config = this.missionsById[saveData.id];
            if (!config) return;

            if (!activeMissions[saveData.id]) {
                activeMissions[saveData.id] = {
                    ...saveData,
                    config
                };
            } else {
                activeMissions[saveData.id].config = config;
            }

        });

        const completed = this.getCompletedMissions();

        if (completed.length && typeof completed[0] === "number") {
            this.saveController.changeMissions({
                activeMissions: this.getActiveMissions(),
                completedMissions: completed.map(id => ({
                    id,
                    completedAt: Date.now()
                }))
            });
        }

        this.saveController.changeMissions({
            activeMissions: this.getActiveMissions(),
            completedMissions: this.getCompletedMissions()
        });
    }

    getMissions() {

        return Object.keys(this.getActiveMissions()).map(id => {

            const missionDB = this.missionsById[id];
            const missionState = this.getActiveMissions()[id];

            if (!missionDB) return null;

            return {
                id: missionDB.id,
                title: missionDB.title,
                icon: missionDB.icon,
                state: missionState.state,
                completed: missionState.completed,
                objectives: missionState.objectives
            };

        }).filter(Boolean);

    }

    getSaveData() {

        return {

            activeMissions: this.getActiveMissions(),

            completedMissions: this.getCompletedMissions()

        }

    }

    assignMission(missionId) {

        const activeMissions = this.getActiveMissions();

        const mission = this.missionsDB.find(m => m.id === missionId)

        if (!mission) return

        if (activeMissions[missionId]) return;

        activeMissions[missionId] = {

            state: 0,

            objectives: mission.states[0].objectives.map(obj => ({
                progress: 0,
                amount: obj.amount,
                done: false
            })),

            completed: false,

            startedAt: Date.now()

        }

        this.saveController.changeMissions({
            activeMissions: activeMissions,
            completedMissions: this.getCompletedMissions()
        });

        this.uiEvents.emit("ui:notify", { type: "newMission", text: mission.title })
    }

    getMissionUIData(id) {

        if (!id) return null;

        const mission = this.missionsDB.find(m => m.id == id);
        const status = this.getActiveMissions()[id];

        if (!mission || !status) return null;

        const currentState = Math.min(status.state ?? 0, mission.states.length - 1);

        const stateData = mission.states[currentState];
        const progressData = status.objectives ?? [];

        const objectives = stateData.objectives.map((obj, index) => {

            const progress = progressData[index] ?? {};

            return {
                text: obj.text,
                target: obj.target,
                action: obj.action,
                icon: obj.icon,
                required: obj.amount,
                progress: progress.progress ?? 0,
                done: progress.done ?? false
            };

        });

        return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            state: currentState,
            objectives,
            reward: mission.final_reward
        };

    }

    onAction(data) {

        let changed = false;

        for (const missionId in this.getActiveMissions()) {

            const mission = this.missionsById[missionId];
            const progress = this.getActiveMissions()[missionId];

            if (!mission || progress.completed) continue;

            const state = mission.states[progress.state];
            if (!state) return;

            state.objectives.forEach((obj, i) => {

                const objProgress = progress.objectives[i];
                if (!objProgress || objProgress.done) return;

                if (this.matches(obj, data)) {

                    objProgress.progress++;

                    if (objProgress.progress >= objProgress.amount) {
                        objProgress.progress = objProgress.amount;

                        objProgress.done = true;
                        this.uiEvents.emit("ui:showAlert", {
                            missionId: missionId
                        });

                    }

                    changed = true;
                }

            });

            this.checkStateCompletion(mission);
        }

        if (changed) {
            this.saveController.changeMissions({
                activeMissions: this.getActiveMissions(),
                completedMissions: this.getCompletedMissions()
            });

        }
    }

    checkLevelUnlocks(playerLevel) {

        this.missionsDB.forEach(mission => {

            if (!mission.level_requirement) return;
            if (mission.level_requirement > playerLevel) return

            if (this.getActiveMissions()[mission.id]) return

            if (this.getCompletedMissions().some(m => m.id === mission.id)) return

            this.assignMission(mission.id)

        })

    }

    matches(obj, data) {

        if (obj.action !== data.action) return false

        if (obj.target && obj.target !== data.target)
            return false

        if (obj.filters) {

            for (const key in obj.filters) {

                if (data[key] !== obj.filters[key])
                    return false

            }

        }

        return true
    }

    checkStateCompletion(mission) {

        const progress = this.getActiveMissions()[mission.id]

        const allDone = progress.objectives.every(o => o.done)

        if (!allDone) return

        this.completeState(mission)

    }

    completeState(mission) {

        const progress = this.getActiveMissions()[mission.id]

        const stateIndex = progress.state

        const state = mission.states[stateIndex]

        if (state.reward) {
            this.giveReward(state.reward)
        }

        progress.state++

        if (progress.state >= mission.states.length) {

            this.completeMission(mission)

            return
        }

        const nextState = mission.states[progress.state]

        progress.objectives = nextState.objectives.map(obj => ({
            progress: 0,
            amount: obj.amount,
            done: false
        }))

        this.uiEvents.emit("ui:showAlert", {
            missionId: mission.id
        });

        this.saveController.changeMissions({
            activeMissions: this.getActiveMissions(),
            completedMissions: this.getCompletedMissions()
        });

    }

    completeMission(mission) {

        const progress = this.getActiveMissions()[mission.id]

        const complete_mission = this.getMissionUIData(mission.id)

        progress.completed = true

        const completedMissions = this.getCompletedMissions();

        if (!completedMissions.find(m => m.id === mission.id)) {
            completedMissions.push({
                id: mission.id,
                completedAt: Date.now()
            });
        }

        this.giveReward(complete_mission)

        delete this.getActiveMissions()[mission.id]


        if (mission.unlocks) {

            mission.unlocks.forEach(id => {
                this.assignMission(id)
            })

        }


        this.saveController.changeMissions({
            activeMissions: this.getActiveMissions(),
            completedMissions: this.getCompletedMissions()
        });

    }


    giveReward(data) {

        if (data.reward) {

            this.uiEvents.emit("action:reward", {
                xp: data.reward.xp,
                gold: data.reward.gold,
            })

            this.uiEvents.emit("ui:notify", {
                type: "conclusion_mission",
                data: data
            })

        } else {
            this.uiEvents.emit("action:reward", {
                xp: data.xp,
                gold: data.gold
            })

        }

    }

}