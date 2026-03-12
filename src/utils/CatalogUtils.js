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

    classEvents() 
    {
        this.uiEvents.on("catalog:getUnlockList", (level, res) => {
            res?.(this.getUnlockedItensListByLevel(level));
        })

        this.uiEvents.on("catalog:getLevelResume", (level, res) => {
            res?.(this.getResumeUnlockLevel(level));
        })
    }

    getUnlockedItensListByLevel(level)
    {
        let list = [];

        const seeds = this.seeds.filter(element => element.nivel_requerido == level);
        const animals = this.animals.filter(element => element.nivel_requerido == level);
        const trees = this.trees.filter(element => element.nivel_requerido == level);
        const soils = this.soils.filter(element => element.nivel_requerido == level);

        list.push(...seeds, ...animals, ...trees, ...soils);

        return list;
    }

    getResumeUnlockLevel(level) 
    {
        let list = this.getUnlockedItensListByLevel(level);

        let newList = list.slice().sort((a, b) => b.preco_compra - a.preco_compra).slice(0,5).map(item => item.nome);

        return newList;
    }

}