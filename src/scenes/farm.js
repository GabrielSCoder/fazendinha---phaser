// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class Farm extends Phaser.Scene {
    constructor() {
        super('Farm');
    }

    preload() {
        this.load.image('grass', 'assets/grass.png'); // opcional se quiser textura de grama
        this.load.spritesheet('chicken', 'assets/galo.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('cow', 'assets/vaca.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('sheep', 'assets/ovelha.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('porco', 'assets/porco.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('estabulo', 'assets/estabulo.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('armazem', 'assets/armazem.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('solo', 'assets/solo.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('super_armazem', 'assets/super_armazem.png', { frameWidth: 500, frameHeight: 500 });
        this.load.spritesheet('trator', 'assets/trator.png', { frameWidth: 500, frameHeight: 500 });
    }

    create() {
        const { width, height } = this.scale;

        // === CHÃO VERDE ===
        this.add.rectangle(width / 2, height / 2, width, height, 0x4CAF50); // verde
        // Se quiser textura: this.add.image(width / 2, height / 2, 'grass').setDisplaySize(width, height);

        const estabulo = this.add.image(width * 0.3, height * 0.4, 'estabulo').setScale(1.5);
        // const armazem = this.add.image(width * 0.7, height * 0.4, 'armazem').setScale(0.5);
        const super_armazem = this.add.image(width * 0.7, height * 0.4, 'super_armazem').setScale(1.0);
        const solo = this.add.image(width * 0.1, height * 0.2, 'solo').setScale(1.0);
        const trator = this.add.image(width * 0.9, height * 0.9, 'trator').setScale(0.7);

        // === ANIMAIS ===
        const cow = this.add.image(200, 300, 'cow').setScale(0.7);
        const chicken = this.add.image(400, 320, 'chicken').setScale(0.3);
        const pig = this.add.image(600, 340, 'porco').setScale(0.6);
        const sheep = this.add.image(800, 310, 'sheep').setScale(0.6);

        this.enableDrag(cow);
        this.enableDrag(chicken);
        this.enableDrag(pig);
        this.enableDrag(sheep);
        this.enableDrag(trator)
    }

    enableDrag(sprite) {
        sprite.setInteractive({ cursor: 'pointer' });
        this.input.setDraggable(sprite);

        // Enquanto estiver sendo arrastado
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === sprite) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            }
        });

        // Quando soltar
        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject === sprite) {
                console.log(`🐾 ${gameObject.texture.key} solto em:`, gameObject.x, gameObject.y);
            }
        });
    }
}

