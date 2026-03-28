import { stringToNumber } from "../utils/hash.js";


export class Menu extends Phaser.Scene {

    preload() {
        this.load.font('LuckiestGuy-Regular', 'assets/fonts/LuckiestGuy-Regular.ttf', 'truetype');
        this.load.image("bg", "assets/ui/wallpaper.png");
        this.load.image("icon", "assets/ui/freeFarmIcon.png");
        this.load.image("logo", "assets/ui/freeFarmLogo.png");
        this.load.json('save_template', 'src/static/player_save_template.json');
    }

    constructor() {
        super('Menu');
    }

    create() {


        const { width, height } = this.scale;

        const bg = this.add.image(0, 0, "bg")
            .setOrigin(0);

        bg.setDisplaySize(width, height);

        this.add.rectangle(0, 0, width, height, 0x000000, 0.3)
            .setOrigin(0);

        const bg2 = this.add.image(width / 2, height / 2 - 120, "logo")
            .setOrigin(0.5);

        bg2.setDisplaySize(500, 500);

        const container = this.add.container(width / 2, height / 2 + 120);

        const panel = this.add.rectangle(0, 0, 300, 150, 0x222222, 0.9)
            .setStrokeStyle(2, 0xffffff);

        container.add([panel]);

        const btnStart = this.createButton("Novo Jogo", 0, -30, () => {
            this.createCadastroInput()
        });

        const btnLoad = this.createButton("Carregar Jogo", 0, 30, () => {
            // const save = localStorage.getItem("game_save");

            // if (!save) {
            //     console.warn("Nenhum save encontrado");
            //     return;
            // }

            // this.scene.start("Start");
            this.openFileLoader();
        });

        container.add([btnStart, btnLoad]);
    }

    createButton(text, x, y, callback, sizeX = 200, sizeY = 40, bgColor = 0x444444, bgHoverColor = 0x666666) {

        const container = this.add.container(x, y);

        const bg = this.add.rectangle(0, 0, sizeX, sizeY, bgColor)
            .setStrokeStyle(2, 0xffffff);

        const label = this.add.text(0, 0, text, {
            fontSize: "16px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        container.add([bg, label]);

        container.setSize(sizeX, sizeY);
        container.setInteractive({ useHandCursor: true });

        container.on("pointerover", () => {
            bg.setFillStyle(bgHoverColor);
        });

        container.on("pointerout", () => {
            bg.setFillStyle(bgColor);
        });

        container.on("pointerup", callback);

        return container;
    }

    createCadastroInput() {

        const { width, height } = this.scale;


        this.overlay = this.createOverlay();

        const container = this.add.container(width / 2, height / 2)
            .setDepth(1000);

        const panel = this.add.rectangle(0, 0, 500, 500, 0x222222, 0.95)
            .setStrokeStyle(2, 0x000);

        container.add(panel);

        const titulo = this.add.text(0, -200, "Criar nova fazenda", {
            fontSize: "30px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        const label_nome = this.add.text(0, -130, "Seu nome ou apelido", {
            fontSize: "22px",
            color: "#ffee00",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        const label_idade = this.add.text(0, -50, "Sua idade", {
            fontSize: "22px",
            color: "#ffee00",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        const label_fruta = this.add.text(0, 30, "Sua fruta favorita", {
            fontSize: "22px",
            color: "#ffee00",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);

        container.add([titulo, label_nome, label_idade, label_fruta]);

        // 🔥 guardar inputs
        this.formInputs = [];

        const baseX = width / 2;
        const baseY = height / 2;

        this.formInputs.push(
            this.createNameInput(baseX - 140, baseY - 120, { placeholder: "Nome" })
        );

        this.formInputs.push(
            this.createNameInput(baseX - 140, baseY - 50, { placeholder: "Idade" }, "number")
        );

        this.formInputs.push(
            this.createNameInput(baseX - 140, baseY + 30, { placeholder: "Fruta favorita" })
        );

        const btnVoltar = this.createButton("Voltar", 0, 190, () => {
            this.closeCadastro();
        }, 200, 40, 0xa83232, 0xe31717);

        const btnConfirmar = this.createButton("Confirmar", 0, 140, () => {

            const nome = this.formInputs[0].value;
            const idade = this.formInputs[1].value;
            const fruta = this.formInputs[2].value;

            this.createStartSave({ nome, idade, fruta })

            this.closeCadastro();

        }, 200, 40, 0x2ccc1b, 0x20ed09);

        container.add([btnVoltar, btnConfirmar]);

        // 🔥 salvar referência do container
        this.cadastroContainer = container;

        return container;
    }

    closeCadastro() {

        // remove inputs do DOM
        if (this.formInputs) {
            this.formInputs.forEach(input => input.remove());
            this.formInputs = [];
        }

        // remove container Phaser
        if (this.cadastroContainer) {
            this.cadastroContainer.destroy();
            this.cadastroContainer = null;
        }

        // remove overlay
        if (this.overlay) {
            this.overlay.destroy();
            this.overlay = null;
        }
    }

    createOverlay() {
        const { width, height } = this.scale;

        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.1)
            .setOrigin(0)
            .setDepth(999)
            .setInteractive();

        return overlay;
    }

    createNameInput(x, y, options = {}, type = "text") {

        const {
            width = 200,
            height = 30,
            placeholder = "Digite...",
            fontSize = 16
        } = options;

        const rect = this.game.canvas.getBoundingClientRect();

        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        input.maxLength = 12

        input.style.position = "absolute";

        input.style.left = rect.left + x + "px";
        input.style.top = rect.top + y + "px";

        input.style.width = width + "px";
        input.style.height = height + "px";

        input.style.fontSize = fontSize + "px";
        input.style.padding = "5px";
        input.style.zIndex = 1000;

        document.body.appendChild(input);

        return input;
    }

    createStartSave(data) {
        const saveData = this.cache.json.get('save_template');

        let newSave = JSON.parse(JSON.stringify(saveData));

        newSave.user.id = 90;
        newSave.user.name = data.nome;

        const timestamp = Date.now();
        const idade = data.idade;

        const frutaHash = stringToNumber(data.fruta);

        const random = Math.floor(Math.random() * 10000);

        const uuid = `${timestamp}${idade}${frutaHash}${random}`;

        newSave.user.uuid = uuid;
        newSave.user.createdAt = timestamp;

        localStorage.setItem("game_save", JSON.stringify(newSave));

        this.scene.start("Loading");
    }

    openFileLoader() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.style.display = "none";

        document.body.appendChild(input);

        input.click();

        input.onchange = (event) => {
            const file = event.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const save = JSON.parse(e.target.result);

                    // 🔥 validação básica
                    if (!save.user || !save.world) {
                        throw new Error("Arquivo inválido");
                    }

                    // 🔥 salva no localStorage
                    localStorage.setItem("game_save", JSON.stringify(save));

                    // 🔥 vai pro jogo
                    this.scene.start("Loading");

                } catch (err) {
                    console.error("Erro ao carregar save:", err);
                    alert("Arquivo de save inválido!");
                }
            };

            reader.readAsText(file);

            // limpa input depois
            input.remove();
        };
    }

}