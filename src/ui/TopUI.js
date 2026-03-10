export default class TopUI {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.uiEvents = config.uiEvents;

        this.userName = config.userName || "Gabriel";
        this.xpAtual = 0;
        this.xpObjetivo = 100;
        this.level = 1;
        this.moedas = 0;
        this.grana = 0;

        this.createUI();

        this.uiEvents.emit("action:GetAllProfileData", (result) => {

            console.log(result.gold);

            this.level = result.level
            this.moedas = result.gold
            this.grana = result.gold
            this.xpAtual = result.ExperienceAmount

            this.updateUI();
            this.updateXP(
                result.ExperienceAmount,
                this.xpObjetivo
            );
        })
    }

    updateUI() {

        this.levelText.setText(this.level);
        this.granaText.setText(this.moedas);
        this.moedaText.setText(this.grana);
        // this.xpText.setText(this.xpAtual);

    }

    updateXP(xpAtual, xpObjetivo) {

        this.xpAtual = xpAtual;
        this.xpObjetivo = xpObjetivo;

        const ratio = Phaser.Math.Clamp(xpAtual / xpObjetivo, 0, 1);

        this.barraXp.displayWidth = this.barraWidth * ratio;

        this.xpText.setText(`${xpAtual}/${xpObjetivo}`);
    }

    createUI() {
        const { width } = this.scene.scale;


        this.containerUI = this.scene.add.container(0, 0).setDepth(1000);
        this.containerUI.setScrollFactor(0);

        const leftX = 20;
        const leftY = 20;

        this.uiLeftContainer = this.scene.add.container(leftX, leftY);
        this.containerUI.add(this.uiLeftContainer);

        // Fundo do container
        const leftBg = this.scene.add.rectangle(0, 0, 250, 60, 0x222222, 0.3).setOrigin(0, 0);
        this.uiLeftContainer.add(leftBg);

        this.barraWidth = 180;
        this.barraHeight = 20;
        this.barraBg = this.scene.add.rectangle(10, 10, this.barraWidth, this.barraHeight, 0x55e4f8).setOrigin(0, 0);
        this.barraXp = this.scene.add.rectangle(10, 10, this.barraWidth * (this.xpAtual / this.xpObjetivo), this.barraHeight, 0xfff08a).setOrigin(0, 0);

        this.xpText = this.scene.add.text(this.barraWidth / 4, this.barraHeight, `${this.xpAtual}/${this.xpObjetivo}`, {
            fontSize: '14px',
            color: 'black',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);

        // Nome da fazenda
        this.farmNameText = this.scene.add.text(10, this.barraHeight + 12, `Fazenda de ${this.userName}`, {
            fontSize: '16px',
            color: 'yellow',
            fontStyle: "bold",
            fontFamily: 'LuckiestGuy-Regular',

        }).setStroke('#000', 4).setOrigin(0, 0);

        // Nível
        this.levelText = this.scene.add.text(this.barraWidth + 20, this.barraHeight - 1, `${this.level}`, {
            fontSize: '24px',
            color: 'yellow',
            fontStyle: "bold",
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0.5).setStroke('black', 5);

        this.uiLeftContainer.add([this.barraBg, this.barraXp, this.xpText, this.farmNameText, this.levelText]);

        // =========================
        // UI Centro - Moedas e Grana
        // =========================
        const centerY = 20;
        this.uiCenterContainer = this.scene.add.container(width / 2, centerY);
        this.containerUI.add(this.uiCenterContainer);

        // Fundo do container (apenas para visualização)
        const centerBg = this.scene.add.rectangle(0, 0, 200, 40, 0xffffff, 0.3).setOrigin(0.5, 0);
        this.uiCenterContainer.add(centerBg);

        // Ícones e textos
        // Ícones de moeda
        this.moedaIcon = this.scene.add.image(-70, 20, 'gold_icon').setOrigin(0.5, 0.5);
        this.moedaIcon.setDisplaySize(30, 30);
        this.moedaText = this.scene.add.text(-50, 20, this.moedas, { fontSize: '16px', color: 'yellow', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);

        // Ícones de dinheiro
        this.granaIcon = this.scene.add.image(40, 20, 'cash_icon').setOrigin(0.5, 0.5);
        this.granaIcon.setDisplaySize(30, 30);
        this.granaText = this.scene.add.text(60, 20, this.grana, { fontSize: '16px', color: 'green', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);

        this.uiCenterContainer.add([this.moedaIcon, this.moedaText, this.granaIcon, this.granaText]);
    }

    // =========================
    // Métodos auxiliares para atualizar UI
    // =========================
    updateXP(valorAtual) {
        this.xpAtual = valorAtual;
        this.barraXp.width = this.barraWidth * (this.xpAtual / this.xpObjetivo);
        this.xpText.setText(`${this.xpAtual}/${this.xpObjetivo}`);
    }

    updateMoedas(qtde) {
        this.moedas = qtde;
        this.moedaText.setText(this.moedas);
    }

    updateGrana(qtde) {
        this.grana = qtde;
        this.granaText.setText(this.grana);
    }
}

