export default class CatalogUtils {

    constructor(scene, config = {}) {
        this.scene = scene;
        this.seeds = scene.sementes;
        this.animals = scene.animais;
        this.trees = scene.arvores;
        this.decoration = scene.decoracoes;
        this.soils = scene.solos;
        this.uiEvents = config.uiEvents;
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

    getCatalog() {
        return {
            animal: this.animals.filter(item => !item.hidden),
            tree: this.trees.filter(item => !item.hidden),
            decoration: this.decoration.filter(item => !item.hidden),
            seed: this.seeds.filter(item => !item.hidden)
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

        list.push(...seeds, ...animals, ...trees, ...decoration);

        return list;
    }

    getResumeUnlockLevel(level) {
        let list = this.getUnlockedItensListByLevel(level);


        let newList = list.slice().sort((a, b) => a.nome - b.nome).slice(0, 5).map(item => item.nome);

        return newList;
    }

}