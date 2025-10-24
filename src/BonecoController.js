export default class BonecoController {
    constructor(scene, config) {
        this.scene = scene;
        this.gridUtils = this.scene.gridUtils;
        this.shopMenu = this.scene.shopMenu;
        this.gridSize = this.scene.gridSize;
        this.offsetX = this.scene.offsetX;
        this.offsetY = this.scene.offsetY;
        this.gridWidth = this.scene.gridWidth;
        this.gridHeight = this.scene.gridHeight;

        this.spritesFaceLeft = true;

        this.createBoneco();
        this.scene.input.on('pointerup', (pointer) => this.handlePointer(pointer));
        this.isStoped = true;
    }

    createBoneco() {
        const bonecoData = {
            img: 'boneco_frente',
            escala: 0.5,
            area: [1, 1],
            origem: [0.5, 0.8],
            tipo : "boneco"
        };

        const centerX = Math.floor(this.gridWidth);
        const centerY = Math.floor(this.gridHeight );
        const screenPos = this.gridUtils.isoToScreen(centerX, centerY);

        const sprite = this.scene.add.sprite(screenPos.x, screenPos.y, bonecoData.img)
            .setScale(bonecoData.escala)
            .setOrigin(...bonecoData.origem)
            .setInteractive({ pixelPerfect: true, alphaTolerance: 1 });

        sprite.isMoving = false;
        sprite.path = [];
        sprite.currentStep = 0;
        sprite.lastDirection = 'frente';
        sprite._shouldFlipX = false;
        sprite.tipo = bonecoData.tipo

        this.scene.gridUtils.markOccupied(sprite, centerX, centerY, 1, 1);
        this.boneco = sprite;

        // --- Animação de frente ---
        this.scene.anims.create({
            key: 'andar_frente',
            frames: [
                { key: 'frame1' },
                { key: 'frame2' },
                { key: 'frame3' },
                { key: 'frame4' }
            ],
            frameRate: 8,
            repeat: -1
        });

        // --- Animação de costas ---
        this.scene.anims.create({
            key: 'andar_costas',
            frames: [
                { key: 'back_frame0' },
                { key: 'back_frame1' },
                { key: 'back_frame2' },
                { key: 'back_frame3' }
            ],
            frameRate: 8,
            repeat: -1
        });
    }

    // === Clique do mouse ===
    setupPointerHandler() {
        this.scene.input.on('pointerup', (pointer) => this.handlePointer(pointer));
    }

    handlePointer(pointer) {
        const scene = this.scene;
        const boneco = this.boneco;
        if (!boneco || scene.middleButtonDown || this.isStoped) return;

        if (scene.shopMenu.isOpen() && boneco.isMoving) {
            this.stopMovement();
            return;
        }

        const worldPoint = scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const targetIso = this.gridUtils.screenToIso(worldPoint.x, worldPoint.y);
        const target = { x: Math.round(targetIso.x), y: Math.round(targetIso.y) };

        const startIso = this.gridUtils.screenToIso(boneco.x, boneco.y);
        const start = { x: Math.round(startIso.x), y: Math.round(startIso.y) };

        const path = this.gridUtils.findPath(start, target, {
            width: this.gridWidth,
            height: this.gridHeight,
            isOccupied: (x, y) => this.gridUtils.checkOccupiedGrid(x, y, x, y, boneco)
        });

        if (path.length > 0) {
            boneco.path = path;
            boneco.currentStep = 0;
            boneco.isMoving = true;

            // aplica direção inicial + animação
            if (path.length > 1) {
                this.computeAndApplyFacingFromGridVec(path[0], path[1]);
            }
        }

        this.gridUtils.drawPathDebug(path);
    }

    // === Atualização de movimento ===
    update() {
        const boneco = this.boneco;

        if (this.isStoped) this.stopMovement();

        if (!boneco || !boneco.isMoving || !boneco.path?.length) return;

        const step = boneco.path[boneco.currentStep];
        if (!step) return;

        const screenPos = this.gridUtils.isoToScreen(step.x, step.y);
        const dx = screenPos.x - boneco.x;
        const dy = screenPos.y - boneco.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = 2;

        if (dist < 2) {
            boneco.currentStep++;

            // chegou ao destino final
            if (boneco.currentStep >= boneco.path.length) {
                this.stopMovement();
                return;
            }

            // apenas quando muda de tile
            const next = boneco.path[boneco.currentStep];
            this.computeAndApplyFacingFromGridVec(step, next);
        } else {
            boneco.x += (dx / dist) * speed;
            boneco.y += (dy / dist) * speed;
        }
    }

    stopMovement() {
        const boneco = this.boneco;
        if (!boneco) return;

        boneco.path = [];
        boneco.isMoving = false;
        boneco.currentStep = 0;
        boneco.stop();

        // mantém a direção final
        const key = boneco.lastDirection === 'costas' ? 'boneco_costas' : 'boneco_frente';
        boneco.setTexture(key);
        boneco.setFlipX(boneco._shouldFlipX);
    }

    // === Atualiza frente/costas e flip ===
    computeAndApplyFacingFromGridVec(fromGrid, toGrid) {
        const boneco = this.boneco;

        const fromS = this.gridUtils.isoToScreen(fromGrid.x, fromGrid.y);
        const toS = this.gridUtils.isoToScreen(toGrid.x, toGrid.y);

        const dx = toS.x - fromS.x;
        const dy = toS.y - fromS.y;
        const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;

        let dir = 'frente';
        let flipX = false;

        if (angleDeg >= 150) {
            dir = 'frente';
            flipX = false;
        } else if (angleDeg > 0) {
            dir = 'frente';
            flipX = true;
        } else if (angleDeg > -30) {
            dir = 'costas';
            flipX = false;
        } else {
            dir = 'costas';
            flipX = true;
        }

        // ---- Aplica flip se mudou ----
        if (flipX !== boneco._shouldFlipX) {
            boneco._shouldFlipX = flipX;
            boneco.setFlipX(flipX);
        }

        // ---- Toca a animação correta sempre que necessário ----
        const animKey = dir === 'costas' ? 'andar_costas' : 'andar_frente';
        // adiciona o flip na verificação para forçar re-play se necessário
        const currentAnimKey = boneco.anims.currentAnim?.key;
        if (currentAnimKey !== animKey || !boneco.anims.isPlaying) {
            boneco.play(animKey, true);
        }

        boneco.lastDirection = dir;
    }

}



