export default class PresentsControler {

    constructor(scene, config = {}) {
        this.scene = scene;
        this.controllers = scene.controllers;
        this.uiEvents = config.uiEvents;

        this.creativeMode = scene.gameVariables.creativeMode;

        this.limitStorageAmount = 30;
        this.actualStorageAmount = 0;

        this.presentList = [];

        this.dataTest = [
            {
                id: "gazebo",
                type: "decoration",
                preco_venda: 50,
                nome: "gazebo",
                img: "bangalo",
                amount: 1
            },
            {
                id: "trator",
                type: "decoration",
                preco_venda: 60,
                nome: "trator",
                img: "trator2",
                amount: 1
            },
            {
                id: "trator",
                type: "decoration",
                preco_venda: 60,
                nome: "trator",
                img: "trator2",
                amount: 1
            },
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

        // this.dataTest.forEach(element => {
        //     this.addItemStorage(element)
        // });

        this.uiEvents.on("data:getPresents", (callback) => {
            callback(this.getListData());
        })

        this.uiEvents.on("data:addItemStorage", (data) => {
            const resp = this.addItemStorage(data)

            if (resp) this.uiEvents.emit("data:storageChange", this.getListData());
        })
    }

    addItemStorage(data) {

        if (this.limitStorageAmount <= this.actualStorageAmount) {
            console.log("inventario cheio");
            return false;
        }

        const exists = this.presentList.find(item => item.id === data.id);

        if (exists) {

            exists.amount += 1;

        } else {

            const newItem = {
                id: data.id,
                type: data.type,
                nome: data.nome,
                preco_venda: data.preco_venda,
                img: data.img,
                amount: data.amount ?? 1
            };

            this.presentList.push(newItem);

        }

        this.actualStorageAmount += 1;

        return true;
    }

    removeItemStorage(data) {

        if (this.presentList.length <= 0) return;

        const exists = this.presentList.find(item => item.id === data.id);

        if (!exists) return;

        if (exists.amount > 1) {

            exists.amount -= 1;

        } else {

            this.presentList = this.presentList.filter(item => item.id !== data.id);

        }

        this.actualStorageAmount -= 1;

    }

    getListData() {

        return {
            list: this.presentList,
            amount: this.actualStorageAmount,
            limit: this.limitStorageAmount
        };

    }

}