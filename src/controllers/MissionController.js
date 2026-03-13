export class MissionController {

    constructor(scene, missions, saveData = null, uiEvents) {

        this.scene = scene

        this.missionsDB = missions

        this.activeMissions = {}

        this.completedMissions = []

        this.uiEvents = uiEvents

        this.saveData = saveData

        this.controllers = scene.controllers;

    }

    init() {
        if (this.saveData) {
            this.loadSave(this.saveData)
        }

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

        this.uiEvents.emit("ui:notify", { type: "mission" })
    }

    onAction(data) {

        for (const missionId in this.activeMissions) {

            const mission = this.missionsDB.find(m => m.id == missionId)

            const progress = this.activeMissions[missionId]

            if (progress.completed) continue

            const state = mission.states[progress.state]

            state.objectives.forEach((obj, i) => {

                if (this.matches(obj, data)) {

                    progress.objectives[i].progress++

                    if (progress.objectives[i].progress >= progress.objectives[i].amount) {
                        progress.objectives[i].done = true
                    }

                }

            })

            this.checkStateCompletion(mission)

        }

    }

    checkLevelUnlocks(playerLevel) {

        this.missionsDB.forEach(mission => {

            if (!mission.level_requirement) return

            if (mission.level_requirement > playerLevel) return

            if (this.activeMissions[mission.id]) return

            if (this.completedMissions.includes(mission.id)) return

            this.assignMission(mission.id)

        })

        console.log(this.activeMissions)

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

        progress.completed = true

        this.completedMissions.push(mission.id)

        this.giveReward(mission.final_reward)

        delete this.activeMissions[mission.id]

        if (mission.unlocks) {

            mission.unlocks.forEach(id => {
                this.assignMission(id)
            })

        }

    }

    giveReward(reward) {

        if (reward.gold)
            this.scene.player.gold += reward.gold

        if (reward.xp)
            this.scene.player.xp += reward.xp

    }

}