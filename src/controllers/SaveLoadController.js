import { debounce } from "../utils/debounce.js";
import { messages } from "../static/server_messages.js";
import { stringToNumber } from "../utils/hash.js";

export default class SaveLoadController {

    constructor(scene, saveData, config = {}) {
        this.scene = scene;
        this.saveArchive = saveData;
        this.user = null;
        this.storage = null;
        this.gift = null;
        this.mission = null;
        this.world = null;
        this.messages = null;
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

        this.uiEvents.on("debug:downloadSave", () => {
            this.downloadSaveFile();
        });

        this.uiEvents.on("ui:warnings", (callback) => {
            callback(this.getServerMessages())
        })

    }

    loadSaveData() {
        this.user = structuredClone(this.saveArchive.user);
        this.storage = structuredClone(this.saveArchive.storage);
        this.gift = structuredClone(this.saveArchive.gift);
        this.mission = structuredClone(this.saveArchive.mission);
        this.messages = structuredClone(this.saveArchive.messages);
        this.loadWorld(this.saveArchive.world);
    }

    static loadFromStorage() {
        const data = localStorage.getItem("game_save");

        if (!data) return null;

        return JSON.parse(data);
    }

    saveData() {

        // if (!this.dirty) return;

        const data = this.getSaveData();

        try {
            localStorage.setItem("game_save", JSON.stringify(data));
        } catch (e) {
            console.error("Erro ao salvar:", e);
        }

        this.dirty = false;
    }

    changeMessages(data) {

        this.messages = data;

        this.saveDebounced();
    }

    changeMissions(data) {

        this.mission = data;

        this.uiEvents.emit("save:mission:update", this.mission);

        this.saveDebounced();
    }

    getServerMessages() {
        return messages.filter(msg => !this.messages.includes(msg.id));
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
            messages: this.messages,
            world: this.getWorldSaveFormat()
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
        this.dirty = true;

        this.uiEvents.emit("save:world:update", world);

        this.saveDebounced();
    }

    getWorldSaveFormat() {
        return {
            ...this.world,
            objects: Object.values(this.world.objects)
        };
    }

    downloadSaveFile() {

        const raw = localStorage.getItem("game_save");

        if (!raw) {
            console.warn("Nenhum save encontrado");
            return;
        }

        const parsed = JSON.parse(raw);

        const formatted = JSON.stringify(parsed, null, 2);

        const blob = new Blob([formatted], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const date = new Date().toISOString().replace(/[:.]/g, "-");

        const a = document.createElement("a");
        a.href = url;
        a.download = `save-${date}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }

    loadWorld(worldData) {

        if (!worldData) return;

        this.world = {
            ...worldData,
            objects: {}
        };

        worldData.objects.forEach(obj => {

            const key = `${obj.position.x}_${obj.position.y}`;

            this.world.objects[key] = obj;

        });

    }

    static createStartSave(data, scene) {

        const saveData = scene.cache.json.get('save_template');
        const objectData = scene.cache.json.get('objects_template');

        let newSave = JSON.parse(JSON.stringify(saveData));

        newSave.user.id = 90;
        newSave.user.name = data.nome;

        const timestamp = Date.now();
        const idade = data.idade;

        const frutaHash = stringToNumber(data.fruta);

        const random = Math.floor(Math.random() * 10000);

        const uuid = `${timestamp}${idade}${frutaHash}${random}`;

        newSave.user.uuid = uuid;
        newSave.user.createdAt = timestamp;
        newSave.world.objects = objectData;

        newSave.world.objects[1].plantTime = Date.now();
        newSave.world.objects[2].plantTime = Date.now();
        
        localStorage.setItem("game_save", JSON.stringify(newSave));

        scene.scene.start("Loading");
    }

    static openFileLoader(scene) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.style.display = "none";

        document.body.appendChild(input);

        input.click();

        input.onchange = (event) => {
            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const save = JSON.parse(e.target.result);

                    // 🔥 validação básica
                    if (!save.user || !save.world) {
                        throw new Error("Arquivo inválido");
                    }

                    // 🔥 salva no localStorage
                    localStorage.setItem("game_save", JSON.stringify(save));

                    // 🔥 vai pro jogo
                    scene.start("Loading");

                } catch (err) {
                    console.error("Erro ao carregar save:", err);
                    alert("Arquivo de save inválido!");
                }
            };

            reader.readAsText(file);

           
            input.remove();
        };
    }
}