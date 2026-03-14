export class MissionController {

    constructor(scene, missions, saveData = null, uiEvents) {

        this.scene = scene

        this.missionsDB = missions

        this.activeMissions = {}

        this.missionsById = {}

        missions.forEach(m => {
            this.missionsById[m.id] = m
        })

        this.completedMissions = []

        this.uiEvents = uiEvents

        this.saveData = saveData

        this.controllers = scene.controllers;

    }

    init() {
        if (this.saveData) {
            this.loadSave(this.saveData)
        }

        this.uiEvents.on("ui:showMission", (result) => {
            this.uiEvents.emit("ui:notify", { type: "mission", mission: this.getMissionUIData(result.id) })
        })

        this.uiEvents.on("game_action", data => {
            this.onAction(data)
        })

        this.uiEvents.on("plant", data => {
            this.onAction({ action: "plant", ...data })
        })

        this.uiEvents.on("harvest", data => {
            this.onAction({ action: "harvest", ...data })
        })

        this.uiEvents.on("plow", data => {
            this.onAction({ action: "plow", ...data })
        })
    }

    getMissions() {

        return Object.keys(this.activeMissions).map(id => {

            const missionDB = this.missionsById[id];
            const missionState = this.activeMissions[id];

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

            activeMissions: this.activeMissions,

            completedMissions: this.completedMissions

        }

    }

    loadSave(saveData) {

        this.activeMissions = saveData.activeMissions || {}

        this.completedMissions = saveData.completedMissions || []

    }

    assignMission(missionId) {

        const mission = this.missionsDB.find(m => m.id === missionId)

        if (!mission) return

        this.activeMissions[missionId] = {

            state: 0,

            objectives: mission.states[0].objectives.map(obj => ({
                progress: 0,
                amount: obj.amount,
                done: false
            })),

            completed: false

        }

        // this.uiEvents.emit("ui:notify", { type: "newMission", text: mission.title })
    }

    getMissionUIData(id) {

        if (!id) return null;

        const mission = this.missionsDB.find(m => m.id == id);
        const status = this.activeMissions[id];

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

        for (const missionId in this.activeMissions) {

            const mission = this.missionsById[missionId];

            const progress = this.activeMissions[missionId];

            if (!mission || progress.completed) continue;

            const state = mission.states[progress.state];

            state.objectives.forEach((obj, i) => {

                if (this.matches(obj, data)) {

                    progress.objectives[i].progress++;

                    if (progress.objectives[i].progress >= progress.objectives[i].amount) {
                        progress.objectives[i].done = true;
                    }

                }

            });

            this.checkStateCompletion(mission);

        }

    }

    checkLevelUnlocks(playerLevel) {

        this.missionsDB.forEach(mission => {

            if (!mission.level_requirement) retulikuitrern
            if (mission.level_requirement > playerLevel) return

            if (this.activeMissions[mission.id]) return

            if (this.completedMissions.includes(mission.id)) return

            this.assignMission(mission.id)

        })

        this.uiEvents.emit("data:missions", this.getMissions());
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

        const progress = this.activeMissions[mission.id]

        const allDone = progress.objectives.every(o => o.done)

        if (!allDone) return

        this.completeState(mission)

    }

    completeState(mission) {

        const progress = this.activeMissions[mission.id]

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

    }

    completeMission(mission) {

        const progress = this.activeMissions[mission.id]

        const complete_mission = this.getMissionUIData(mission.id)

        progress.completed = true

        this.completedMissions.push(mission.id)

        this.giveReward(complete_mission)

        delete this.activeMissions[mission.id]

        if (mission.unlocks) {

            mission.unlocks.forEach(id => {
                this.assignMission(id)
            })

        }

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