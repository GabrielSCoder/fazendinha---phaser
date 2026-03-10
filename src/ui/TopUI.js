export default class TopUI {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.uiEvents = config.uiEvents;

        this.userName = config.userName || "Gabriel";
        this.ExperienceAmount = 0;
        this.xpObjetivo = 100;
        this.level = 1;
        this.gold = 0;
        this.money = 0;

        this.createUI();

        this.uiEvents.emit("action:GetAllProfileData", (result) => {

            console.log(result.gold);

            this.level = result.level
            this.gold = result.gold
            this.money = result.money
            this.ExperienceAmount = result.ExperienceAmount

            this.updateUI();
            this.updateXP(
                result.ExperienceAmount,
                this.xpObjetivo
            );
        })

        this.uiEvents.on("update:profile", (data) => {

            this.level = data.level;
            this.gold = data.gold;
            this.money = data.money;

            this.updateUI();
            this.updateXP(data.xp, this.xpObjetivo);

        });
    }

    updateUI() {

        this.levelText.setText(this.level);
        this.moneyText.setText(this.money);
        this.goldText.setText(this.gold);
        // this.xpText.setText(this.ExperienceAmount);

    }

    updateXP(ExperienceAmount, xpObjetivo) {

        this.ExperienceAmount = ExperienceAmount;
        this.xpObjetivo = xpObjetivo;

        const ratio = Phaser.Math.Clamp(ExperienceAmount / xpObjetivo, 0, 1);

        this.barraXp.displayWidth = this.barraWidth * ratio;

        this.xpText.setText(`${ExperienceAmount}/${xpObjetivo}`);
    }

    createUI() {
        const { width } = this.scene.scale;


        this.containerUI = this.scene.add.container(0, 0).setDepth(1000);
        this.containerUI.setScrollFactor(0);

        const leftX = 20;
        const leftY = 20;

        this.uiLeftContainer = this.scene.add.container(leftX, leftY);
        this.containerUI.add(this.uiLeftContainer);


        const leftBg = this.scene.add.rectangle(0, 0, 250, 60, 0x222222, 0.3).setOrigin(0, 0);
        this.uiLeftContainer.add(leftBg);

        this.barraWidth = 180;
        this.barraHeight = 20;
        this.barraBg = this.scene.add.rectangle(10, 10, this.barraWidth, this.barraHeight, 0x55e4f8).setOrigin(0, 0);
        this.barraXp = this.scene.add.rectangle(10, 10, this.barraWidth * (this.ExperienceAmount / this.xpObjetivo), this.barraHeight, 0xfff08a).setOrigin(0, 0);

        this.xpText = this.scene.add.text(this.barraWidth / 4, this.barraHeight, `${this.ExperienceAmount}/${this.xpObjetivo}`, {
            fontSize: '14px',
            color: 'black',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5);


        this.farmNameText = this.scene.add.text(10, this.barraHeight + 12, `Fazenda de ${this.userName}`, {
            fontSize: '16px',
            color: 'yellow',
            fontStyle: "bold",
            fontFamily: 'LuckiestGuy-Regular',

        }).setStroke('#000', 4).setOrigin(0, 0);


        this.levelText = this.scene.add.text(this.barraWidth + 20, this.barraHeight - 1, `${this.level}`, {
            fontSize: '24px',
            color: 'yellow',
            fontStyle: "bold",
            fontFamily: 'LuckiestGuy-Regular'
        }).setOrigin(0, 0.5).setStroke('black', 5);

        this.uiLeftContainer.add([this.barraBg, this.barraXp, this.xpText, this.farmNameText, this.levelText]);


        const centerY = 20;
        this.uiCenterContainer = this.scene.add.container(width / 2, centerY);
        this.containerUI.add(this.uiCenterContainer);

        const centerBg = this.scene.add.rectangle(0, 0, 200, 40, 0xffffff, 0.3).setOrigin(0.5, 0);
        this.uiCenterContainer.add(centerBg);

 
        this.moedaIcon = this.scene.add.image(-70, 20, 'gold_icon').setOrigin(0.5, 0.5);
        this.moedaIcon.setDisplaySize(30, 30);
        this.goldText = this.scene.add.text(-50, 20, this.gold, { fontSize: '16px', color: 'yellow', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);


        this.moneyIcon = this.scene.add.image(40, 20, 'cash_icon').setOrigin(0.5, 0.5);
        this.moneyIcon.setDisplaySize(30, 30);
        this.moneyText = this.scene.add.text(60, 20, this.money, { fontSize: '16px', color: 'green', fontStyle: "bold", fontFamily: 'LuckiestGuy-Regular' }).setOrigin(0, 0.5);

        this.uiCenterContainer.add([this.moedaIcon, this.goldText, this.moneyIcon, this.moneyText]);
    }

 
    updateXP(valorAtual) {
        this.ExperienceAmount = valorAtual;
        this.barraXp.width = this.barraWidth * (this.ExperienceAmount / this.xpObjetivo);
        this.xpText.setText(`${this.ExperienceAmount}/${this.xpObjetivo}`);
    }
}

