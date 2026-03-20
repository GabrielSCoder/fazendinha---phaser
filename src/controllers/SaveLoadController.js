import { debounce } from "../utils/debounce.js";

export default class SaveLoadController {

    constructor(scene, saveData, config = {}) {
        this.scene = scene;
        this.saveArchive = saveData;
        this.user = null;
        this.storage = null;
        this.gift = null;
        this.mission = null;
        this.world = null;
        this.uiEvents = config.uiEvents;

        this.saveDebounced = debounce(() => {
            this.saveData();
        }, 500);
    }

    init() {
        this.loadSaveData()
        this.gameEvents()
    }

    gameEvents() {
        this.uiEvents.on("save:user:gold", (value) => {
            console.log("Gold atualizado:", value);
        });
    }

    loadSaveData() {
        this.user = structuredClone(this.saveArchive.user);
        this.storage = structuredClone(this.saveArchive.storage);
        this.gift = structuredClone(this.saveArchive.gift);
        this.mission = structuredClone(this.saveArchive.mission);
        this.world = structuredClone(this.saveArchive.world);
    }

    static loadFromStorage() {
        const data = localStorage.getItem("game_save");

        if (!data) return null;

        return JSON.parse(data);
    }

    saveData() {

        const data = this.getSaveData();

        try {
            localStorage.setItem("game_save", JSON.stringify(data));
        } catch (e) {
            console.error("Erro ao salvar:", e);
        }
    }

    changeMissions(data) {

        this.mission = data;

        this.uiEvents.emit("save:mission:update", this.mission);

        this.saveDebounced();
    }

    getUser() {
        return this.user;
    }

    getMissions() {
        return this.mission;
    }

    getStorage() {
        return this.storage;
    }

    getWorld() {
        return this.world;
    }

    getGift() {
        return this.gift;
    }

    getSaveData() {
        return {
            user: this.user,
            storage: this.storage,
            gift: this.gift,
            mission: this.mission,
            world: this.world
        }
    }

    changeStorage(list) {
        this.storage = list;

        this.uiEvents.emit("save:storage:update", this.storage);

        this.saveDebounced();
    }

    changeGift(list) {
        this.gift = list;

        this.uiEvents.emit("save:gift:update", this.gift);

        this.saveDebounced();
    }

    changeUser(type, amount, operation = "set") {

        if (this.user[type] === undefined) return;

        if (operation === "add") {
            this.user[type] += amount;
        } else {
            this.user[type] = amount;
        }

        this.uiEvents.emit(`save:user:${type}`, this.user[type]);

        this.saveDebounced();
    }

    addUser(type, amount) {

        if (this.user[type] === undefined) return;

        this.user[type] += amount;

        this.uiEvents.emit(`save:user:${type}`, this.user[type]);

        this.saveDebounced();
    }

    changeWorld(world) {
        this.world = world;

        this.uiEvents.emit("save:world:update", this.world);

        this.saveDebounced();
    }

    changeObjectWorld(object) {

        if (!object.uuid) return;

        const objectList = this.world.objects;

        const item_exists = objectList.find(x => x.uuid === object.uuid);

        if (item_exists) {

            item_exists.state = object.state;
            item_exists.position = object.position;
            item_exists.isRotated = object.isRotated;
            item_exists.updatedAt = Date.now();

        } else {

            let new_item = {
                uuid: object.uuid,
                type: object.type,
                position: object.position,
                createdAt: Date.now()
            };

            if (object.canGrow) {
                new_item.plantTime = object.growStart;
            }

            if (object.itemId) {
                new_item.itemId = object.itemId;
            }

            objectList.push(new_item);
        }

        this.world.lastUpdate = Date.now();

        this.saveData();
    }
}