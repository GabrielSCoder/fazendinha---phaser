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

        this.bgTexture = scene.add.tileSprite(0, 0, width, height, 'item_bg').setOrigin(0);

        this.cardContainer = scene.add.container(x, y, [
            this.bgTexture
        ]);

        container.add(this.cardContainer);

        this.title = scene.add.text(x + width / 2, y + 20, data.nome, {
            fontSize: data.nome.lenght > 10 ? '10px' : '14px',
            color: '#875e2b',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0.5, 0.5);

        // Imagem do item
        this.img = scene.add.image(x + width / 2, y + 70, data.img).setOrigin(0.5, 0.5);
        this.img.setDisplaySize(70, 70);

        // XP ganho
        this.xpText = scene.add.text(x + 60, y + 100, `XP: ${data.xp}`, {
            fontSize: '14px',
            color: '#000000',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0);

        // Tempo de colheita com ícone de relógio (placeholder)

        this.clockIcon = scene.add.image(x + 50, y + 125, 'clock_icon').setOrigin(0.5, 0.5);
        this.clockIcon.setDisplaySize(15, 15);
        this.tempoText = scene.add.text(x + 60, y + 120, `${data.tempo_colheita_horas} horas`, {
            fontSize: '10px',
            color: '#000000',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0);

        // Valor de venda
        this.vendaText = scene.add.text(x + 40, y + 135, `Vender por: ${data.preco_venda}`, {
            fontSize: '10px',
            fontStyle: "thin",
            color: '#000000',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0);

        // Valor de compra centralizado com ícone de ouro
        this.gold = scene.add.image(x + width / 2 - 6, y + 165, 'gold_icon').setOrigin(0.5, 0.5);
        this.gold.setDisplaySize(20, 20);
        this.compraText = scene.add.text(x + width / 2 + 5, y + 165, data.preco_compra, {
            fontSize: '14px',
            color: '#000000',
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0.5);

        // Botão comprar
        const debouncedComprar = this.debounce(() => {
            console.log("comprar", this.data);
            this.scene.shopMenu.close();
            this.scene.events.emit('itemPurchased', this.data);
        }, 150);

        // Botão de compra
        this.comprarBtn = scene.add.text(
            x + width / 2, y + height + 3, "Comprar",
            {
                fontSize: '14px',
                color: 'white',
                backgroundColor: '#28a745',
                padding: { left: 10, right: 10, top: 4, bottom: 4 },
                fontFamily: 'LuckiestGuy-Regular'
            }
        )
            .setStroke('#000', 4)
            .setOrigin(0.5, 1)
            .setInteractive({ useHandCursor: true })
            .setShadow(2, 2, '#000', 2, true, true);

        // Aplica o debounce no evento pointerdown
        this.comprarBtn.on('pointerdown', debouncedComprar);
        this.comprarBtn.on('pointerover', () => this.comprarBtn.setStyle({ backgroundColor: '#3ec25f' }));
        this.comprarBtn.on('pointerout', () => this.comprarBtn.setStyle({ backgroundColor: '#28a745' }));

        container.add([this.title, this.xpText, this.clockIcon, this.img, this.tempoText, this.vendaText, this.gold,
        this.compraText, this.comprarBtn]);
    }

    comprarItem() {
        console.log(`Comprou item: ${this.data.nome}`);
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
        let timeout; // This variable will hold the timeout ID

        return function (...args) {
            const context = this; // Store the 'this' context for later use

            // Clear any existing timeout to prevent the previous function call from executing
            clearTimeout(timeout);

            // Set a new timeout
            timeout = setTimeout(() => {
                // Execute the original function after the delay, preserving 'this' context and arguments
                func.apply(context, args);
            }, delay);
        };
    }
}
