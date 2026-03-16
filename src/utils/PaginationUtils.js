import { debounce } from "./debounce.js";

export default class PaginationUtils {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.items = config.items || [];
        this.itemsPerPage = config.itemsPerPage || 10;
        this.currentPage = 0;

        this.container = config.container;

        this.renderItem = config.renderItem;

        this.layout = {
            cols: config.cols || 5,
            itemWidth: config.itemWidth || 150,
            itemHeight: config.itemHeight || 200,
            spacingX: config.spacingX || 10,
            spacingY: config.spacingY || 10,
            startX: config.startX || 0,
            startY: config.startY || 0
        };

        this.prevBtn = null;
        this.nextBtn = null;
    }

    setItems(items) {
        this.items = items;
        this.currentPage = 0;
        this.displayCurrentPage();
    }

    createPageButton(key, x, y, onClick, delay = 150) {

        const btn = this.scene.add.image(x, y, key)
            .setDisplaySize(50, 50)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        btn.canClick = true;

        const handler = debounce(() => {
            if (btn.canClick) onClick();
        }, delay);

        btn.on("pointerdown", handler);

        btn.on("pointerover", () => btn.setScale(0.6));
        btn.on("pointerout", () => btn.setScale(0.5));

        return btn;
    }

    createNavigation(prevConfig, nextConfig) {

        this.prevBtn = this.createPageButton(
            prevConfig.key,
            prevConfig.x,
            prevConfig.y,
            () => this.changePage(-1)
        );

        this.nextBtn = this.createPageButton(
            nextConfig.key,
            nextConfig.x,
            nextConfig.y,
            () => this.changePage(1)
        );

        this.updatePageButtons();
    }

    changePage(delta) {

        const totalPages = Math.ceil(this.items.length / this.itemsPerPage);

        this.currentPage = Phaser.Math.Clamp(
            this.currentPage + delta,
            0,
            totalPages - 1
        );

        this.displayCurrentPage();
    }

    updatePageButtons() {

        if (!this.prevBtn || !this.nextBtn) return;

        const totalPages = Math.ceil(this.items.length / this.itemsPerPage);

        this.prevBtn.setAlpha(this.currentPage === 0 ? 0.4 : 1);
        this.nextBtn.setAlpha(this.currentPage >= totalPages - 1 ? 0.4 : 1);

        this.prevBtn.canClick = this.currentPage > 0;
        this.nextBtn.canClick = this.currentPage < totalPages - 1;
    }

    displayCurrentPage() {

        if (!this.container) return;

        this.container.removeAll(true);

        const startIndex = this.currentPage * this.itemsPerPage;

        const pageItems = this.items.slice(
            startIndex,
            startIndex + this.itemsPerPage
        );

        const {
            cols,
            itemWidth,
            itemHeight,
            spacingX,
            spacingY,
            startX,
            startY
        } = this.layout;

        pageItems.forEach((data, i) => {

            const col = i % cols;
            const row = Math.floor(i / cols);

            const x = startX + col * (itemWidth + spacingX);
            const y = startY + row * (itemHeight + spacingY);

            if (this.renderItem) {
                this.renderItem({
                    scene: this.scene,
                    container: this.container,
                    data,
                    x,
                    y,
                    width: itemWidth,
                    height: itemHeight,
                    index: i
                });
            }

        });

        this.updatePageButtons();
    }
}