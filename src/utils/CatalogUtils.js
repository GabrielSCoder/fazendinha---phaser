import { sementes, animais, arvores, decoracoes, solos } from "../objects.js";


export default class CatalogUtils {

    constructor(scene, config = {}) {
        this.scene = scene;
        this.seeds = sementes;
        this.animals = animais;
        this.trees = arvores;
        this.decoration = decoracoes;
        this.soils = solos;
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
            animal: this.animals,
            tree: this.trees,
            decoration: this.decoration,
            seed: this.seeds
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
        const soils = this.soils.filter(element => element.nivel_requerido == level);

        list.push(...seeds, ...animals, ...trees, ...soils);

        return list;
    }

    getResumeUnlockLevel(level) {
        let list = this.getUnlockedItensListByLevel(level);

        let newList = list.slice().sort((a, b) => b.preco_compra - a.preco_compra).slice(0, 5).map(item => item.nome);

        return newList;
    }

}