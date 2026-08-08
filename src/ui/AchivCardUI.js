export default class AchivCardUI {

    constructor(scene, data, width = 160, height = 260) {
        this.scene = scene
        this.data = data
        this.width = width
        this.height = height

        this.container = this.createCard();
    }

    createCard() {

        const s = this.scene;

        const container = s.add.container(0, 0);

        // Dimensões do card
        const cardWidth = 320;
        const cardHeight = 160;

        // Área reservada para a imagem
        const leftWidth = 90;
        const padding = 12;

        const bg = s.add.rectangle(
            0,
            0,
            cardWidth,
            cardHeight,
            0x54c848,
            1
        )
            .setOrigin(0.5)
            .setStrokeStyle(2, 0x000000);

        //------------------------------------
        // COLUNA ESQUERDA
        //------------------------------------

        const img = s.add.image(
            -cardWidth / 2 + leftWidth / 2 + padding,
            0,
            this.data.img
        )
            .setDisplaySize(75, 75);

        //------------------------------------
        // COLUNA DIREITA
        //------------------------------------

        const startX = -cardWidth / 2 + leftWidth + 20;
        const textWidth = cardWidth - leftWidth;

        const startY = -cardHeight / 2 + 12;

        const title = s.add.text(
            startX,
            startY,
            this.data.title,
            {
                fontSize: "20px",
                color: "#ffffff",
                fontFamily: "LuckiestGuy-Regular",
                wordWrap: {
                    width: textWidth
                }
            }
        )
            .setOrigin(0, 0)
            .setStroke("#000", 4);

        const subtitle = s.add.text(
            startX,
            title.y + title.height + 6,
            this.data.description,
            {
                fontSize: "12px",
                color: "#ffffff",
                fontFamily: "LuckiestGuy-Regular",
                wordWrap: {
                    width: textWidth
                }
            }
        )
            .setOrigin(0, 0)
            .setStroke("#000", 3);

        const progress = s.add.text(
            startX,
            subtitle.y + subtitle.height + 10,
            `${this.data.amount} / ${this.data.target}`,
            // "90 / 200",
            {
                fontSize: "18px",
                color: "#ffffff",
                fontFamily: "LuckiestGuy-Regular"
            }
        )
            .setOrigin(0, 0)
            .setStroke("#000", 4);

        const stars = this.generateStars();

        stars.setPosition(
            startX + 50,
            progress.y + progress.height + 18
        );

        //------------------------------------

        container.add([
            bg,
            img,
            title,
            subtitle,
            progress,
            stars
        ]);

        return container;

    }

    generateStars() {
        const s = this.scene;

        const container = s.add.container(0, 0);

        const spacing = 22;

        const total = 5;

        const startX = -(spacing * (total - 1)) / 2;

        for (let i = 0; i < total; i++) {

            const texture =
                i < this.data.stars
                    ? "star"
                    : "hollow_star";

            const star = s.add.image(
                startX + spacing * i,
                0,
                texture
            )
                .setDisplaySize(18, 18);

            container.add(star);

        }

        return container;

    }
}