export default class EnergyManagementController {

    constructor(scene, config = {}) {
        if (!config.saveController) throw new Error("Sem controller de save!");
        this.scene = scene;
        this.saveController = config.save;
        this.controllers = config.controllers;
        this.uiEvents = config.uiEvents;
        this.saveController = config.saveController;
    }

    init() {

        this.classEvents();
    }

    classEvents() {

        this.uiEvents.on("energy:checkEnergy", (callback) => {
            callback(this.getEnergy())
        })

        this.uiEvents.on("energy:changeEnergy", (data) => {
            this.setEnergy(data)
        })

    }

    getEnergy() {
        return this.saveController.getUser().energy;
    }

    useEnergy(data) {

        if (!data?.action)
            return false;

        const energy = this.getEnergy();

        let cost = 0;

        switch (data.action) {

            case "plow":
                cost = this.scene.gameVariables.energyPlowCost;
                break;

            case "harvest":
                cost = this.scene.gameVariables.energyHarvestCost;
                break;

            case "renew":
                cost = this.scene.gameVariables.energyRenewSoilCost;
                break;

            case "seed":
                cost = this.scene.gameVariables.energySeedCost;
                break;

            default:
                return false;
        }

        if (!cost || cost < 0)
            return false;

        if (energy < cost)
            return false;

        const success = this.setEnergy({
            amount: -cost
        });

        if (!success)
            return false;

        return true;
    }

    setEnergy(data) {

        if (!data.amount) return false;

        const energy = this.getEnergy();

        if ((energy + data.amount) < 0) return false;

        this.saveController.changeUser('energy', data.amount, 'add')

        this.uiEvents.emit(
            "energy:updateUI",
            this.getEnergy()
        );

        return true;
    }

}