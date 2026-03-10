import ShopItemCard from './ShopItemCard.js';
import { sementes, arvores, animais, decoracoes } from '../objects.js';

export default class ShopMenu {
    constructor(scene, config = {}) {
        if (!scene) throw new Error("ShopMenu: scene não foi passada!");
        this.scene = scene;
        this.width = 850;
        this.height = 550;
        this.activeCategory = 'Sementes';
        this.currentPage = 0;
        this.itemsPerPage = 10;
        this.shopItems = [];
        this.playerLevel = 1;
        this.uiEvents = config.uiEvents;
        this.listenEvents();
        this.requestProfileData();

        this.create();
    }

    requestProfileData() {

        this.uiEvents.emit("action:GetAllProfileData", (data) => {

            this.playerLevel = data.level;

        });

    }

    listenEvents() {

        this.uiEvents.on("update:level", (level) => {

            this.playerLevel = level;

        });

    }


    create() {
        const { scene, width, height } = this;
        scene.input.setDefaultCursor('pointer');

        // === OVERLAY ===
        this.overlay = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.4)
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(9998)
            .setVisible(false)
            .setInteractive();

        // === CONTAINER PRINCIPAL ===
        this.container = scene.add.container(scene.scale.width / 2 - width / 2, scene.scale.height / 2 - height / 2)
            .setDepth(9999)
            .setVisible(false)
            .setScrollFactor(0);

        // Fundo sólido e textura
        const bg = scene.add.rectangle(0, 0, width, height, 0x000000, 0.85).setOrigin(0);
        bg.setStrokeStyle(2, 0xffffff, 0.5);

        const bgTexture = scene.add.image(0, 0, 'menu_bg')
            .setOrigin(0)
            .setDisplaySize(width, height);

        // === TÍTULO E BOTÃO DE FECHAR ===
        const title = scene.add.text(width / 2, 30, "🌾 Loja", {
            fontSize: '22px',
            fontStyle: 'bold',
            color: '#fff',
            fontFamily: 'LuckiestGuy-Regular'
        }).setStroke('#000', 4).setOrigin(0.5);

        const closeBtn = scene.add.image(840, this.container.height + 15, 'close_button')
            .setScale(0.2)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const baseScale = closeBtn.scale;

        const debouncedClose = this.debounce(() => this.close(), 150);

        closeBtn.on("pointerover", () => {
            closeBtn.setScale(baseScale * 1.2);
        });

        closeBtn.on("pointerout", () => {
            closeBtn.setScale(baseScale);
        });

        closeBtn.on('pointerdown', debouncedClose);

        this.container.add([bg, bgTexture, title, closeBtn]);

        // === BOTÕES DE CATEGORIA ===
        const categories = ['Sementes', 'Árvores', 'Animais', 'Decorações'];
        this.categoryButtons = [];

        const startX = 40;
        const startY = 60;
        const btnWidth = 140;
        const btnHeight = 70;
        const spacing = 12;

        categories.forEach((cat, i) => {
            const x = startX + i * (btnWidth + spacing);

            const btn = scene.add.image(x, startY, 'categoria_bg')
                .setOrigin(0)
                .setDisplaySize(btnWidth, btnHeight)
                .setInteractive({ useHandCursor: true })
                .setTint(cat === this.activeCategory ? 0xf9d070 : 0xe3c082);

            const label = scene.add.text(x + btnWidth / 2, startY + btnHeight / 2, cat, {
                fontSize: '16px',
                fontFamily: 'LuckiestGuy-Regular',
                color: cat === this.activeCategory ? '#000' : '#fff',
            }).setOrigin(0.5);


            btn.on('pointerover', () => {
                if (this.activeCategory !== cat) {
                    btn.setTint(0xf9d070);
                    label.setColor('#fff');
                }
            });

            btn.on('pointerout', () => {
                if (this.activeCategory !== cat) {
                    btn.setTint(0xe3c082);
                    label.setColor('#fff');
                }
            });

            btn.on('pointerdown', () => this.showCategory(cat));

            this.categoryButtons.push({ btn, label, cat });
            this.container.add([btn, label]);
        });

        this.itemsContainer = scene.add.container(0, 0);
        this.container.add(this.itemsContainer);

        this.itemsData = {
            'Sementes': sementes,
            'Árvores': arvores,
            'Animais': animais,
            'Decorações': decoracoes
        };


        const arrowY = height / 2 + 55;
        const arrowOffset = 30;

        this.prevBtn = this.createPageButton(scene, 'anterior_button', arrowOffset, arrowY, () => this.changePage(-1));
        this.nextBtn = this.createPageButton(scene, 'proximo_button', width - arrowOffset + 10, arrowY, () => this.changePage(1));

        this.container.add([this.prevBtn, this.nextBtn]);
    }

    open() {
        if (this.container.visible) return;
        this.overlay.setVisible(true);
        this.container.setVisible(true).setAlpha(0).setScale(0.8);

        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Back.Out'
        });

        this.showCategory(this.activeCategory);
    }

    close() {
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.8,
            duration: 200,
            ease: 'Back.In',
            onComplete: () => {
                this.container.setVisible(false);
                this.overlay.setVisible(false);
            }
        });
    }

    showCategory(category) {
        this.activeCategory = category;
        this.currentPage = 0;

        this.categoryButtons.forEach(({ btn, cat, label }) => {
            const isActive = cat === category;
            btn.setTint(isActive ? 0xf9d070 : 0xe3c082);
            label.setColor(isActive ? '#000' : '#fff');
        });

        this.displayCurrentPage();
    }

    changePage(delta) {
        const totalItems = this.itemsData[this.activeCategory]?.length || 0;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        this.currentPage = Phaser.Math.Clamp(this.currentPage + delta, 0, totalPages - 1);
        this.displayCurrentPage();
    }

    updatePageButtons() {
        const totalItems = this.itemsData[this.activeCategory]?.length || 0;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);

        this.prevBtn.setAlpha(this.currentPage === 0 ? 0.4 : 1);
        this.nextBtn.setAlpha(this.currentPage >= totalPages - 1 ? 0.4 : 1);

        this.prevBtn.canClick = this.currentPage > 0;
        this.nextBtn.canClick = this.currentPage < totalPages - 1;
    }

    displayCurrentPage() {
        if (!this.itemsContainer) return;

        this.itemsContainer.removeAll(true);
        this.shopItems = [];

        // const items = this.itemsData[this.activeCategory] || [];
        const items = (this.itemsData[this.activeCategory] || [])
            .slice()
            .sort((a, b) => a.nivel_requerido - b.nivel_requerido);
        const startIndex = this.currentPage * this.itemsPerPage;
        const pageItems = items.slice(startIndex, startIndex + this.itemsPerPage);

        const cols = 5;
        const itemWidth = 150;
        const itemHeight = 200;
        const spacingX = 10;
        const spacingY = 10;
        const startX = 35;
        const startY = 120;

        pageItems.forEach((data, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (itemWidth + spacingX);
            const y = startY + row * (itemHeight + spacingY);

            const card = new ShopItemCard(this.scene, this.itemsContainer, data, x, y, itemWidth, itemHeight, this.playerLevel);
            this.shopItems.push(card);
        });

        this.updatePageButtons();
    }

    venderItem(item) {
        console.log("Item vendido:", item.name);
    }

    isOpen() {
        return this.container.visible;
    }

    createPageButton(scene, key, x, y, onClick, delay = 150) {
        const btn = scene.add.image(x, y, key)
            .setDisplaySize(50, 50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        btn.canClick = true;
        console.log(btn)

        const debouncedClick = this.debounce(() => {
            if (btn.canClick) onClick();
        }, delay);

        btn.on('pointerdown', debouncedClick);

        btn.on('pointerover', () => {
            btn.setScale(0.6)
        });

        btn.on('pointerout', () => {
            btn.setScale(0.5)
        });

        return btn;
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
