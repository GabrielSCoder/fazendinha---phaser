export default class CatalogUtils {

    constructor(scene, config = {}) {
        if (!config.save) throw new Error("Sem controller de save!");
        this.scene = scene;
        this.seeds = scene.sementes;
        this.animals = scene.animais;
        this.trees = scene.arvores;
        this.decoration = scene.decoracoes;
        this.expansion = scene.expansoes;
        this.soils = scene.solos;
        this.vehicles = scene.veiculos;
        this.consumibles = scene.consumibles;
        this.uiEvents = config.uiEvents;
        this.saveController = config.save;
        this.classEvents();
    }

    classEvents() {
        this.uiEvents.on("catalog:getUnlockList", (level, res) => {
            res?.(this.getUnlockedItensListByLevel(level));
        })

        this.uiEvents.on("catalog:getLevelResume", (level, res) => {
            res?.(this.getResumeUnlockLevel(level));
        })
    }

    init()
    {
        this.getBuyableExpansionList();
        this.mixVehicleAndEnergyConsumables();
    }

    getCatalog() {
        return {
            animal: this.animals.filter(item => !item.hidden),
            tree: this.trees.filter(item => !item.hidden),
            decoration: this.decoration.filter(item => !item.hidden),
            seed: this.seeds.filter(item => !item.hidden),
            expansion: this.expansion.filter(item => !item.hidden),
            vehicle: this.vehicles.filter(item => !item.hidden),
            consumible: this.consumibles.filter(item => !item.hidden) 
        }
    }

    isCultivableSoil(type) {
        return type == "solo_plantado_alagado" || type == "solo_plantado_simples"
    }

    findItem(data) {

        const id = data.id;
        const type = data.type;

        if (!id || !type) return;

        let item = null;

        switch (type) {
            case "soil":
                item = this.soils.find(item => item.nome == id)
                break;
            case "seed":
                item = this.seeds.find(item => item.id == id)
                break;
            case "animal":
                item = this.animals.find(item => item.id == id)
                break;
            case "arvore":
                item = this.trees.find(item => item.id === id)
                break;
            case "decoracao":
                item = this.decoration.find(item => item.id == id)
                break;
            case "cerca":
                item = this.decoration.find(item => item.id == id)
                break;
            case "expansao":
                item = this.expansion.find(item => item.id == id)
                break;
            case "veiculo":
                item = this.vehicles.find(item => item.id == id)
                break;
            case "consumible":
                item = this.consumibles.find(item => item.id == id)
                break;
            default:
                break;
        }

        return item ? structuredClone(item) : null;
    }

    getUnlockedItensListByLevel(level) {
        let list = [];

        const seeds = this.seeds.filter(element => element.nivel_requerido == level);
        const animals = this.animals.filter(element => element.nivel_requerido == level);
        const trees = this.trees.filter(element => element.nivel_requerido == level);
        const decoration = this.decoration.filter(element => element.nivel_requerido == level);
        const vehicles = this.vehicles.filter(element => element.nivel_requerido == level);
        const consumibles = this.consumibles.filter(element => element.nivel_requerido == level);

        list.push(...seeds, ...animals, ...trees, ...decoration, ...vehicles, ...consumibles);

        return list;
    }

    getResumeUnlockLevel(level) {
        let list = this.getUnlockedItensListByLevel(level);


        let newList = list.slice().sort((a, b) => a.nome - b.nome).slice(0, 5).map(item => item.nome);

        return newList;
    }

    getBuyableExpansionList() {

        const step = this.saveController.getWorld().expansion_step;

        const b = { "bought": true }

        Object.entries(this.expansion).forEach(([key], index) => {
            if (this.expansion[key].etapaExpansao <= step)
                this.expansion[key] = {... this.expansion[key], ...b}
        });

    }

    mixVehicleAndEnergyConsumables()
    {
        this.vehicles.push(...this.consumibles.filter(item => item.subtipo == "energia" && !item.hidden));
    }
}