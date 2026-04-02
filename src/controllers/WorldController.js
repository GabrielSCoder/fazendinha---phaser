export default class WorldController {

    constructor(scene, saveController, uiEvents) {
        this.scene = scene;
        this.saveController = saveController;
        this.uiEvents = uiEvents;
    }

    init() {

        this.uiEvents.on("plow", data => this.onPlow(data));
        this.uiEvents.on("renewSoil", data => this.onRenew(data));
        this.uiEvents.on("plant", data => this.onPlant(data));
        this.uiEvents.on("harvest", data => this.onHarvest(data));
        this.uiEvents.on("move", data => this.onMove(data));
        this.uiEvents.on("sell", data => this.onDelete(data));
        this.uiEvents.on("listObjects", () => this.mountMap());
    }

    onPlow(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;

        const map = this.saveController.getWorld().objects;


        if (!key) {
            return;
        }

        map[key] = {
            uuid: key,
            id: sprite.nome,
            type: "soil",
            state: "plowed",
            position: { x: sprite.gridX, y: sprite.gridY },
            x: sprite.x,
            y: sprite.y,
            harvestTimes: 0
        };

        this.save("plow");
    }

    onRenew(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;

        const map = this.saveController.getWorld().objects;


        if (!key) {
            return;
        }

        map[key] = {
            id: "solo_preparado",
            uuid: key,
            type: "soil",
            state: "plowed",
            harvestTimes: sprite.harvestTime,
            position: { x: sprite.gridX, y: sprite.gridY },
            x: sprite.x,
            y: sprite.y
        };

        this.save("renew");
    }

    onPlant(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;
        const obj = this.saveController.getWorld().objects[key];


        if (!key) {
            return;
        }

        if (!obj || obj.state != "plowed") {
            console.log("não achou")
            return;
        };

        obj.id = sprite.tipo
        obj.nome = sprite.tipo
        obj.state = "planted";
        obj.item = sprite.planta_cultivada;
        obj.plantTime = sprite.growthStart;
        obj.duration = sprite.growthDuration;

        this.save("plant");
    }

    onHarvest(data) {

        const sprite = data.sprite;

        const key = sprite.uuid;
        const obj = this.saveController.getWorld().objects[key];

        if (!key) {
            return;
        }

        if (!obj) {
            console.log("não achou")
            return;
        };

        let save = {
            uuid: obj.uuid,
            id: obj.id,
            harvestTimes: sprite.harvestTime,
            position: obj.position,
            x: obj.x,
            y: obj.y
        }

        if (sprite.tipo == "animal" || sprite.tipo == "arvore") {
            save = {
                ...save,
                type: obj.type,
                state: "placed",
                plantTime: sprite.growthStart,
                duration: obj.duration,
            }
        } else {
            save = {
                ...save,
                id: "solo_seco",
                type: "soil",
                state: "dry",
            }
        }

        this.saveController.getWorld().objects[key] = save;

        this.save("harvest");
    }

    onMove(data) {

        const sprite = data.sprite;
        const key = sprite.uuid;

        if (!key) {
            return;
        }


        let save = {
            uuid: key,
            id: sprite.id,
            type: sprite.tipo,
            state: "placed",
            isRotated: sprite.isRotated,
            position: { x: sprite.lastFreePos.startX, y: sprite.lastFreePos.startY },
            x: sprite.x,
            y: sprite.y
        };

        if (sprite.tipo == "animal" || sprite.tipo == "arvore") {

            save = {
                ...save,
                plantTime: sprite.growthStart,
                duration: sprite.duration,
                harvestTimes: sprite.harvestTime,
            }
        }


        this.saveController.getWorld().objects[key] = save;

        this.save();
    }

    onDelete(data) {

        const sprite = data.sprite;
        const key = sprite.uuid;
        const obj = this.saveController.getWorld().objects[key];

        if (!key) {
            return;
        }

        if (!obj) {
            console.log("Objeto não existe no world");
            return;
        }

        delete this.saveController.getWorld().objects[key];

        this.save();

    }

    mountMap() {

        const map = this.saveController.getWorld().objects;

        if (!map) return;

        let objects = [];

        Object.values(map).forEach(element => {

            let seed = null
            let item = null

            if (element.state == "dry") {

                item = this.scene.controllers.catalog.findItem({
                    id: "solo_seco",
                    type: "soil"
                });

            } else {

                item = this.scene.controllers.catalog.findItem({
                    id: element.id,
                    type: element.type
                });

                if (this.scene.controllers.catalog.isCultivableSoil(element.id)) {

                    seed = this.scene.controllers.catalog.findItem({
                        id: element.item,
                        type: "seed"
                    });

                    item.nome = seed.nome
                    seed.img = seed.tipo_plantacao
                    seed.tipo = element.id

                }
            }

            objects.push({ ...element, ...seed, ...item });

        });

        objects.forEach(first => {

            const sprite = this.scene.controllers.spriteUtils.addGameSprite(first, first.x, first.y, first.escala, first.origem[0], first.origem[1], first.isRotated, true);

            const { w, h } = this.scene.controllers.gridUtils.getSpriteFootprint(sprite);

            this.scene.controllers.gridUtils.markOccupied(sprite, first.position.x, first.position.y, w, h);

            if (this.scene.controllers.catalog.isCultivableSoil(sprite.tipo)) {


                sprite.regrow = false;
            }

            this.scene.controllers.gridUtils.recalculateDepthAround(sprite);

        })

        this.scene.controllers.camera.ignoreInUICamera([...this.scene.gameVariables.sprites])

        this.scene.controllers.gridUtils.drawFootprints();

        this.scene.controllers.growth.start();

    }

    save(type = false) {

        if (type)
            this.saveController.changeRecords({ type: type });

        const world = this.saveController.getWorld();

        world.lastUpdate = Date.now();

        this.saveController.changeWorld(world);
    }

}
