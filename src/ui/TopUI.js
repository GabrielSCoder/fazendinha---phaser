// export default class TopUI {
//     constructor(scene, config = {}) {
//         this.scene = scene;

//         // =========================
//         // Dados iniciais (pode vir do servidor depois)
//         // =========================
//         this.userName = config.userName || "Gabriel";
//         this.xpAtual = config.xpAtual || 350;
//         this.xpObjetivo = config.xpObjetivo || 500;
//         this.level = config.level || 5;
//         this.moedas = config.moedas || 120000;
//         this.grana = config.grana || 100;

//         this.createUI();
//     }

//     createUI() {
//         const { width, height } = this.scene.scale;

//         // =========================
//         // Container canto esquerdo superior
//         // =========================
//         const leftX = 20;
//         const leftY = 20;

//         this.uiLeftContainer = this.scene.add.container(leftX, leftY);
//         this.uiLeftContainer.setScrollFactor(0);

//         // Fundo do container
//         const leftBg = this.scene.add.rectangle(0, 0, 250, 60, 0x222222, 0.3).setOrigin(0, 0);
//         this.uiLeftContainer.add(leftBg);

//         // Barra de XP
//         this.barraWidth = 180;
//         this.barraHeight = 20;
//         this.barraBg = this.scene.add.rectangle(0, 0, this.barraWidth, this.barraHeight, 0x55e4f8).setOrigin(0, 0);
//         this.barraXp = this.scene.add.rectangle(0, 0, this.barraWidth * (this.xpAtual / this.xpObjetivo), this.barraHeight, 0xfff08a).setOrigin(0, 0);

//         this.xpText = this.scene.add.text(this.barraWidth / 4, this.barraHeight / 2, `${this.xpAtual}/${this.xpObjetivo}`, {
//             fontSize: '14px',
//             color: 'black',
//             fontStyle: 'bold'
//         }).setOrigin(0.5, 0.5);

//         // Nome da fazenda
//         this.farmNameText = this.scene.add.text(0, this.barraHeight + 5, `Fazenda de ${this.userName}`, {
//             fontSize: '16px',
//             color: 'yellow',
//             fontStyle: "bold",
//             fontFamily: 'LuckiestGuy-Regular',

//         }).setStroke('#000', 4).setOrigin(0, 0);

//         // Nível
//         this.levelText = this.scene.add.text(this.barraWidth + 10, this.barraHeight / 2, `${this.level}`, {
//             fontSize: '24px',
//             color: 'yellow',
//             fontStyle: "bold",
//             fontFamily: 'LuckiestGuy-Regular'
//         }).setOrigin(0, 0.5).setStroke('black', 5);

//         this.uiLeftContainer.add([this.barraBg, this.barraXp, this.xpText, this.levelText, this.farmNameText]);

//         const centerY = 20;

//         this.uiCenterContainer = this.scene.add.container(width / 2, centerY);
//         this.uiCenterContainer.setScrollFactor(0);

//         // Fundo do container (apenas para visualização)
//         const centerBg = this.scene.add.rectangle(0, 0, 200, 40, 0xffffff, 0.3).setOrigin(0.5, 0);
//         this.uiCenterContainer.add(centerBg);

//         // Ícones de moeda
//         this.moedaIcon = this.scene.add.image(-70, 20, 'gold_icon').setOrigin(0.5, 0.5);
//         this.moedaIcon.setDisplaySize(30, 30);
//         this.moedaText = this.scene.add.text(-50, 20, this.moedas, { fontSize: '16px', color: 'yellow', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);

//         // Ícones de dinheiro
//         this.granaIcon = this.scene.add.image(40, 20, 'cash_icon').setOrigin(0.5, 0.5);
//         this.granaIcon.setDisplaySize(30, 30);
//         this.granaText = this.scene.add.text(60, 20, this.grana, { fontSize: '16px', color: 'green', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);

//         this.uiCenterContainer.add([this.moedaIcon, this.moedaText, this.granaIcon, this.granaText]);
//     }

//     // =========================
//     // Métodos para atualizar valores
//     // =========================
//     setXP(xpAtual, xpObjetivo) {
//         this.xpAtual = xpAtual;
//         this.xpObjetivo = xpObjetivo;
//         this.barraXp.width = this.barraWidth * (xpAtual / xpObjetivo);
//         this.xpText.setText(`${xpAtual} / ${xpObjetivo}`);
//     }

//     setLevel(level) {
//         this.level = level;
//         this.levelText.setText(`${level}`);
//     }

//     setMoedas(valor) {
//         this.moedas = valor;
//         this.moedaText.setText(valor);
//     }

//     setGrana(valor) {
//         this.grana = valor;
//         this.granaText.setText(valor);
//     }

//     setUserName(name) {
//         this.userName = name;
//         this.farmNameText.setText(`Fazenda de ${name}`);
//     }
// }

// TopUI.js
export default class TopUI {
    constructor(scene, config = {}) {
        this.scene = scene;

        // =========================
        // Dados iniciais (pode vir do servidor depois)
        // =========================
        this.userName = config.userName || "Gabriel";
        this.xpAtual = config.xpAtual || 350;
        this.xpObjetivo = config.xpObjetivo || 500;
        this.level = config.level || 5;
        this.moedas = config.moedas || 120000;
        this.grana = config.grana || 100;

        this.createUI();
    }

    createUI() {
        const { width } = this.scene.scale;

        // =========================
        // Container principal da UI
        // =========================
        this.containerUI = this.scene.add.container(0, 0).setDepth(1000);
        this.containerUI.setScrollFactor(0); // fixa no canto, não é afetada pela câmera

        // =========================
        // UI Esquerda - XP e Level
        // =========================
        const leftX = 20;
        const leftY = 20;

        this.uiLeftContainer = this.scene.add.container(leftX, leftY);
        this.containerUI.add(this.uiLeftContainer);

        // Fundo do container
        const leftBg = this.scene.add.rectangle(0, 0, 250, 60, 0x222222, 0.3).setOrigin(0, 0);
        this.uiLeftContainer.add(leftBg);

        // Barra de XP
        this.barraWidth = 180;
        this.barraHeight = 20;
        this.barraBg = this.scene.add.rectangle(10, 10, this.barraWidth, this.barraHeight, 0x55e4f8).setOrigin(0, 0);
        this.barraXp = this.scene.add.rectangle(10, 10, this.barraWidth * (this.xpAtual / this.xpObjetivo), this.barraHeight, 0xfff08a).setOrigin(0, 0);

        this.xpText = this.scene.add.text(this.barraWidth / 4, this.barraHeight , `${this.xpAtual}/${this.xpObjetivo}`, {
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

