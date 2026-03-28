import { AssetLoader } from "../utils/AssetLoader.js";

export class Loading extends Phaser.Scene {
    constructor() {
        super('Loading');
    }

    preload() {

        const { width, height } = this.scale;

        const bg = this.add.image(0, 0, "bg")
            .setOrigin(0);

        bg.setDisplaySize(width, height);

        this.add.rectangle(0, 0, width, height, 0x000000, 0.3)
            .setOrigin(0);

        const bg2 = this.add.image(width / 2, height / 2 - 120, "icon")
            .setOrigin(0.5);

        bg2.setDisplaySize(500, 500);

        const text = this.add.text(width / 2, height / 2 + 100, "Carregando...", {
            fontSize: "32px",
            color: "#ffffff",
            fontFamily: 'LuckiestGuy-Regular',
        }).setOrigin(0.5);


        const progressBar = this.add.rectangle(width / 2, height / 2 + 150, 300, 20, 0x444444);
        const progressFill = this.add.rectangle(width / 2 - 150, height / 2 + 150, 0, 20, 0x00ff00)
            .setOrigin(0, 0.5);

        this.load.on('progress', (value) => {
            progressFill.width = 300 * value;
        });

        this.load.on('complete', () => {
            text.setText("Pronto!");
        });

        this.load.json('sementes_data', 'src/static/sementes.json');
        this.load.json('arvores_data', 'src/static/arvores.json');
        this.load.json('animais_data', 'src/static/animais.json');
        this.load.json('decoracoes_data', 'src/static/decoracoes.json');
        this.load.json('solos_data', 'src/static/solos.json');


        this.load.text('xpTable', 'assets/data/xp_levels.csv');
        this.load.image('menu_bg', 'assets/ui/fundo_madeira.jpg');
        this.load.image('item_bg', 'assets/ui/fundo_item_loja.png');
        this.load.image('item_bloqueado', 'assets/ui/bloqueado_ui.png');
        this.load.image('categoria_bg', 'assets/ui/categoria_fundo.png');
        this.load.image('gold_icon', 'assets/ui/gold.png');
        this.load.image('cash_icon', 'assets/ui/cash.png');
        this.load.image('clock_icon', 'assets/ui/clock2.png');
        this.load.image('close_button', 'assets/ui/close.png');
        this.load.image('confirm_button', 'assets/ui/confirm.png');
        this.load.image('proximo_button', 'assets/ui/proximo.png');
        this.load.image('anterior_button', 'assets/ui/anterior.png');
        this.load.image('enxada', 'assets/ui/enxada.png');
        this.load.image('pa', 'assets/ui/pazinha.png');
        this.load.image('star', 'assets/ui/star.png');
        this.load.image('energy', 'assets/ui/energy.png');
        this.load.image('gift', 'assets/ui/gift2.png');
        this.load.image('grama', 'assets/fundo/grama_tile.png');

        this.load.image('fundo_madeira', 'assets/ui/fundo_madeira_escuro_2.png');
        this.load.image('fundo_madeira_medio', 'assets/ui/banner_medio.png');
        this.load.image('fundo_madeira_branco', 'assets/ui/fundo_madeira_escuro_medio_fundo_branco.png');

        this.load.image('boneco_frente', 'assets/boneco/boneco_frente.png');
        this.load.image('boneco_costas', 'assets/boneco/boneco_tras.png');

        this.load.image('frame1', 'assets/anim/frame_01.png');
        this.load.image('frame2', 'assets/anim/frame_02.png');
        this.load.image('frame3', 'assets/anim/frame_03.png');
        this.load.image('frame4', 'assets/anim/frame_04.png');

        this.load.image('back_frame0', 'assets/anim/back/frame_0.png');
        this.load.image('back_frame1', 'assets/anim/back/frame_1.png');
        this.load.image('back_frame2', 'assets/anim/back/frame_2.png');
        this.load.image('back_frame3', 'assets/anim/back/frame_3.png');

        this.load.image('solo2', 'assets/solo/512/solo_preparado512.png');
        this.load.image('solo_plantado_simples', 'assets/solo/512/solo_plantado_simples512.png');
        this.load.image('solo_seco', 'assets/solo/512/solo_seco512.png');
        this.load.image('solo_alagado', 'assets/solo/512/solo_plantado_alagado512.png');
        this.load.image('solo_alagado2', 'assets/solo/512/solo_plantado_alagado512.png');
        this.load.image('solo_plantado_alagado', 'assets/solo/512/solo_plantado_alagado512.png');

        this.load.json('sementes_data', 'src/static/sementes.json');
        this.load.json('arvores_data', 'src/static/arvores.json');
        this.load.json('animais_data', 'src/static/animais.json');
        this.load.json('decoracoes_data', 'src/static/decoracoes.json');
        this.load.json('solos_data', 'src/static/solos.json');


        AssetLoader.load(this)
    }

    create() {
        this.scene.start('Start');
    }
}