export default class ShopItemCard {
    constructor(scene, container, data, x, y, width = 130, height = 180) {
        if (!scene) throw new Error("ShopItemCard: scene não foi passado!");
        if (!container) throw new Error("ShopItemCard: container não foi passado!");
        this.scene = scene;
        this.container = container;
        this.data = data;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.createCard();
    }

    createCard() {
        const { x, y, width, height, data, scene, container } = this;
        this.Locked = false;
        this.unlockedList = [];
        this.lockedList = [];

        const bg = scene.add.tileSprite(0, 0, width, height, 'item_bg').setOrigin(0);

        const title = scene.add.text(width / 2, 20, data.nome, {
            fontSize: data.nome.length > 10 ? '10px' : '14px',
            color: '#875e2b',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0.5);

        const img = scene.add.image(width / 2, 70, data.img).setOrigin(0.5).setDisplaySize(70, 70);

        const xpText = scene.add.text(60, 100, `XP: ${data.xp}`, {
            fontSize: '14px',
            color: '#000',
            fontFamily: 'LuckiestGuy-Regular'
        });

        if (this.Locked) {
            const bloqueado = scene.add.tileSprite(20, 100, 140, 90, 'item_bloqueado').setOrigin(0).setScale(0.8)
            const bloqueioTexto = scene.add.text(50, 120, `Bloqueado \n nível 18`, {
                fontSize: '12px',
                color: 'white',
                fontFamily: 'Arial'
            });

            this.lockedList = [bg, title, img, bloqueado, bloqueioTexto]

            this.cardContainer = scene.add.container(x, y, this.lockedList);

        } else {
            const clockIcon = scene.add.image(50, 125, 'clock_icon').setOrigin(0.5).setDisplaySize(15, 15);
            const tempoText = scene.add.text(60, 120, `${data.tempo_colheita_horas} horas`, {
                fontSize: '10px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            });

            const vendaText = scene.add.text(40, 135, `Vender por: ${data.preco_venda}`, {
                fontSize: '10px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            });

            const gold = scene.add.image(width / 2 - 6, 165, 'gold_icon').setOrigin(0.5).setDisplaySize(20, 20);
            const compraText = scene.add.text(width / 2 + 5, 165, data.preco_compra, {
                fontSize: '14px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            }).setOrigin(0, 0.5);

            const comprarBtn = scene.add.text(width / 2, height + 3, "Comprar", {
                fontSize: '14px',
                color: 'white',
                backgroundColor: '#28a745',
                padding: { left: 10, right: 10, top: 4, bottom: 4 },
                fontFamily: 'LuckiestGuy-Regular'
            })
                .setStroke('#000', 4)
                .setOrigin(0.5, 1)
                .setInteractive({ useHandCursor: true })
                .setShadow(2, 2, '#000', 2, true, true);

            const debouncedComprar = this.debounce(() => {
                console.log("comprar", this.data);
                this.scene.shopMenu.close();
                this.scene.events.emit('itemPurchased', this.data);
            }, 150);

            comprarBtn.on('pointerdown', debouncedComprar);
            comprarBtn.on('pointerover', () => comprarBtn.setStyle({ backgroundColor: '#3ec25f' }));
            comprarBtn.on('pointerout', () => comprarBtn.setStyle({ backgroundColor: '#28a745' }));

            this.unlockedList = [
                bg, title, img,
                xpText,
                clockIcon,
                tempoText,
                vendaText,
                gold,
                compraText,
                comprarBtn
            ]

            this.cardContainer = scene.add.container(x, y, this.unlockedList);
        }

        container.add(this.cardContainer);

    }

    destroy() {
        this.title.destroy();
        this.img.destroy();
        this.xpText.destroy();
        this.clockIcon.destroy();
        this.tempoText.destroy();
        this.vendaText.destroy();
        this.gold.destroy();
        this.compraText.destroy();
        this.comprarBtn.destroy();
    }

    debounce(func, delay) {
        let timeout; 

        return function (...args) {
            const context = this; 

            clearTimeout(timeout);

            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
}
