export class WorldController {

    constructor(scene, saveController, uiEvents) {
        this.scene = scene;
        this.saveController = saveController;
        this.uiEvents = uiEvents;
    }

    init() {

        this.world = this.saveController.getWorld();

        this.uiEvents.on("plow", data => this.onPlow(data));
        this.uiEvents.on("renewSoil", data => this.onRenew(data));
        this.uiEvents.on("plant", data => this.onPlant(data));
        this.uiEvents.on("harvest", data => this.onHarvest(data));
        this.uiEvents.on("move", data => this.onMove(data));
        this.uiEvents.on("sell", data => this.onDelete(data));
    }

    onPlow(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;

        if (!key) {
            console.log("Sem uuid")
            return;
        }

        this.world.objects[key] = {
            uuid: key,
            type: "soil",
            state: "plowed",
            position: { x: sprite.gridX, y: sprite.gridY }
        };

        this.save();
    }

    onRenew(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;

        if (!key) {
            console.log("Sem uuid")
            return;
        }

        this.world.objects[key] = {
            uuid: key,
            type: "soil",
            state: "plowed",
            harvestTimes: sprite.harvestTime,
            position: { x: sprite.gridX, y: sprite.gridY }
        };

        this.save();
    }

    onPlant(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;
        const obj = this.world.objects[key];

        if (!key) {
            console.log("Sem uuid")
            return;
        }

        if (!obj || obj.state !== "plowed") return;

        obj.state = "planted";
        obj.item = sprite.planta_cultivada;
        obj.plantTime = sprite.growthStart;

        this.save();
    }

    onHarvest(data) {

        const sprite = data.sprite;

        console.log(sprite)

        const key = sprite.uuid;
        const obj = this.world.objects[key];

        if (!key) {
            console.log("Sem uuid")
            return;
        }

        if (!obj) return;

        let save = {
            uuid: obj.uuid,
            id: obj.id,
            harvestTimes: sprite.harvestTime,
            position: obj.position,
        }

        if (sprite.tipo == "animal" || sprite.tipo == "arvore") {
            save = {
                ...save,
                type: obj.type,
                state: "placed",
            }
        } else {
            save = {
                ...save,
                type: "soil",
                state: "dry",
            }
        }

        this.world.objects[key] = save;

        this.save();
    }

    onMove(data) {

        const sprite = data.sprite;
        const key = sprite.uuid;

        if (!key) {
            console.log("Sem uuid")
            return;
        }

        let save = {
            uuid: key,
            id: sprite.id,
            type: sprite.tipo,
            state: "placed",
            isRotated: sprite.isRotated,
            position: { x: sprite.gridX, y: sprite.gridY }
        };

        if (sprite.tipo == "animal" || sprite.tipo == "arvore") {

            save = {
                ...save,
                plantTime: sprite.growthStart,
                harvestTimes: sprite.harvestTime,
            }

        }

        this.world.objects[key] = save;

        this.save();
    }

    onDelete(data) {

        const sprite = data.sprite;
        const key = sprite.uuid;

        if (!key) {
            console.log("Sem uuid");
            return;
        }

        if (!this.world.objects[key]) {
            console.log("Objeto não existe no world");
            return;
        }

        delete this.world.objects[key];

        this.save();

    }

    save() {

        this.world.lastUpdate = Date.now();

        this.saveController.changeWorld(this.world);
    }


}
