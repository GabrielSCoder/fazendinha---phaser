export default class PresentsControler {

    constructor(scene, saveController, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = config.uiEvents;
        this.saveController = saveController;

        this.creativeMode = scene.gameVariables.creativeMode;

        this.limitStorageAmount = 30;
        this.actualStorageAmount = 0;

        this.dataTest = [
            {
                id: "animal_vaca",
                type: "animal",
                preco_venda: 60,
                nome: "vaca",
                img: "vaca",
                amount: 1
            },
            {
                id: "animal_frango",
                type: "animal",
                preco_venda: 60,
                nome: "galo",
                img: "galo",
                amount: 1
            },
            {
                id: "animal_porco",
                type: "animal",
                preco_venda: 60,
                nome: "porco",
                img: "porco",
                amount: 1
            }
        ]
    }

    init() {

        this.presentList = this.dataTest;
        // this.presentList = this.saveController.getGift() || [];

        this.actualStorageAmount = this.presentList.reduce((acc, item) => acc + item.amount, 0);

        this.uiEvents.on("data:getPresents", (callback) => {
            callback(this.getListData());
        });

        this.uiEvents.on("data:addItemStorage", (data) => {
            const resp = this.addItemStorage(data);

            if (resp) this.uiEvents.emit("data:storageChange", this.getListData());
        });

        this.uiEvents.on("data:removeItemStorage", (data) => {
            console.log("XXXXXXXXXXXX")
            const resp = this.removeItemStorage(data);
            if (resp) this.uiEvents.emit("data:storageChange", this.getListData());
        });
    }

    addItemStorage(data) {

        if (this.limitStorageAmount <= this.actualStorageAmount) {
            //console.log("inventario cheio");
            return false;
        }

        const list = this.presentList;

        const exists = list.find(item => item.id === data.id);

        if (exists) {

            exists.amount += 1;
            exists.lastReceivedAt = Date.now();

        } else {

            list.push({
                id: data.id,
                type: data.tipo,
                amount: 1,
                lastReceivedAt: Date.now()
            });

        }

        this.actualStorageAmount += 1;

        const dados = this.controllers.catalog.findItem({ id: data.id, type: data.tipo });

        console.log(dados)

        this.uiEvents.emit("ui:notify", { type: "item", data: { nome: dados.nome, img: dados.img } })

        this.saveController.changeGift(list);

        return true;
    }

    removeItemStorage(data) {

        const list = this.presentList;

        const exists = list.find(item => item.id === data.id);

        if (!exists) return false;

        if (exists.amount > 1) {

            exists.amount -= 1;

        } else {

            this.presentList = list.filter(item => item.id !== data.id);

        }

        this.actualStorageAmount -= 1;

        this.saveController.changeGift(this.presentList);

        return true;
    }

    getListData() {

        const list = this.presentList.map(item => {

            const catalogItem = this.controllers.catalog.findItem({
                id: item.id,
                type: item.type
            });

            return {
                ...item,
                nome: catalogItem?.nome,
                img: catalogItem?.img,
                cantSell: catalogItem?.cannotSell ?? false,
                preco_venda: catalogItem?.preco_venda
            };

        });

        return {
            list,
            amount: this.actualStorageAmount,
            limit: this.limitStorageAmount
        };
    }

    usePresent(data) {
        if (!data) return;
        if (!data.type) return;
        if (!data.id) return;

        console.log(data)

        switch (data.type) {
            case "animal":
                const item = this.controllers.catalog.findItem({ id: data.id, type: data.type })
                if (!item) return;
                item.gift = true;
                this.controllers.acoesUtils.comprarItem(item)
                break;
            case "decoracao":
                const itemd = this.controllers.catalog.findItem({ id: data.id, type: data.type })
                if (!itemd) return;
                itemd.gift = true;
                this.controllers.acoesUtils.comprarItem(itemd)
                break;
            default:
                break;
        }

    }

}