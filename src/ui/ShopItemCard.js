export default class ShopItemCard {

    constructor(scene, container, data, x, y, width = 130, height = 180, playerLevel) {

        if (!scene) throw new Error("ShopItemCard: scene não foi passado!");
        if (!container) throw new Error("ShopItemCard: container não foi passado!");

        this.scene = scene;
        this.controllers = scene.controllers;
        this.container = container;
        this.data = data;
        this.requiredLevel = data.nivel_requerido || 1;
        this.creativeMode = scene.gameVariables.creativeMode;
        this.noExperienceMode = scene.gameVariables.noExperienceMode;

        this.smallSprite = ["cabana", "cabana_rosa", "gazebo", "gazebo_rosa", "escorrega", "anao_jardim", "gangorra", "flamingo",
            "carro_amarelo", "carro_vermelho", "casa_grande", "casa_cogumelo", "espantalho_palha", "espantalho_azul"]

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.playerLevel = playerLevel;

        this.createCard();
    }

    createCard() {

        const smallSprite = this.smallSprite.includes(this.data.id)

        const imgSizeX = smallSprite ? 120 : 70
        const imgSizeY = smallSprite ? 120 : 70

        const s = this.scene;

        const locked = this.requiredLevel > this.playerLevel;

        const tipo_compra = this.data.preco_compra > this.data.preco_compra_grana || !this.data.preco_compra_grana ? "gold" : "money"

        const elements = [];

        const bg = s.add.tileSprite(0, 0, this.width, this.height, 'item_bg').setOrigin(0);
        elements.push(bg);

        const title = s.add.text(this.width / 2, 20, this.data.nome, {
            fontSize: this.data.nome.length > 10 ? '10px' : '14px',
            color: '#000',
            fontFamily: 'LuckiestGuy-Regular',
            lineSpacing: 2, wordWrap: {
                width: this.width * 0.9
            }
        }).setOrigin(0.5);

        elements.push(title);

        const img = s.add.image(this.width / 2, 70, this.data.img)
            .setOrigin(0.5)
            .setDisplaySize(imgSizeX, imgSizeY);

        elements.push(img);

        if (locked && !this.creativeMode && !this.noExperienceMode) {

            const bloqueado = s.add.tileSprite(20, 100, 140, 90, 'item_bloqueado')
                .setOrigin(0)
                .setScale(0.8);

            const bloqueioTexto = s.add.text(50, 120,
                `Bloqueado \n nível ${this.requiredLevel}`, {
                fontSize: '12px',
                color: 'white',
                fontFamily: 'Arial'
            });

            elements.push(bloqueado, bloqueioTexto);

        } else {

            const xpText = s.add.text(75, 110, `XP: ${this.data.xp}`, {
                fontSize: '14px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            }).setOrigin(0.5);

            if (this.data.tipo == "semente" || this.data.tipo == "arvore" || this.data.tipo == "animal") {
                const clockIcon = s.add.image(50, 125, 'clock_icon')
                    .setOrigin(0.5)
                    .setDisplaySize(15, 15);

                const tempoText = s.add.text(60, 120,
                    `${this.data.tempo_colheita_horas} horas`, {
                    fontSize: '10px',
                    color: '#000',
                    fontFamily: 'LuckiestGuy-Regular'
                });

                elements.push(clockIcon, tempoText)
            }


            const vendaText = s.add.text(40, 135,
                `Vender por: ${this.data.preco_venda}`, {
                fontSize: '10px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            });

            const value = tipo_compra == "gold"
                ? this.data.preco_compra
                : this.data.preco_compra_grana;

            const container = s.add.container(this.width / 2, 165);

            const icon = s.add.image(0, 0,
                tipo_compra == "gold" ? 'gold_icon' : 'cash_icon'
            )
                .setOrigin(0.5)
                .setDisplaySize(20, 20);

            const text = s.add.text(0, 0, value, {
                fontSize: '14px',
                color: '#000',
                fontFamily: 'LuckiestGuy-Regular'
            }).setOrigin(0, 0.5);

            icon.x = - (text.width / 2) - 2;
            text.x = - (text.width / 2) + 10;

            container.add([icon, text]);

            const comprarBtn = s.add.text(
                this.width / 2,
                this.height + 3,
                "Comprar",
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

            const debouncedComprar = this.debounce(() => {

                this.controllers.shopMenu.close();

                this.scene.events.emit('itemPurchased', this.data);

            }, 150);

            comprarBtn.on('pointerdown', debouncedComprar);

            comprarBtn.on('pointerover', () =>
                comprarBtn.setStyle({ backgroundColor: '#3ec25f' })
            );

            comprarBtn.on('pointerout', () =>
                comprarBtn.setStyle({ backgroundColor: '#28a745' })
            );

            elements.push(
                xpText,
                vendaText,
                container,
                comprarBtn
            );
        }

        this.cardContainer = this.scene.add.container(this.x, this.y, elements);

        this.container.add(this.cardContainer);
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