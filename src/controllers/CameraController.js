export default class CameraController {
    constructor(scene) {
        this.scene = scene;
        this.mainCamera = scene.cameras.main;
        this.uiCamera = scene.cameras.add(0, 0, scene.scale.width, scene.scale.height);

        this.dragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.camStart = { x: 0, y: 0 };
        const worldWidth = 2000;
        const worldHeight = 2000;

        this.setupDragControls();

        this.mainCamera.setBounds(
            -worldWidth / 2,
            -worldHeight / 2,
            worldWidth,
            worldHeight
        );

        const cam = this.mainCamera;
        const newZoom = 1.599999999
        cam.setZoom(newZoom);
        // this.mainCamera.centerOn(0, 0);
        const center = this.scene.gridUtils.isoToScreen(this.scene.gameVariables.gridWidth, this.scene.gameVariables.gridHeight);

        this.mainCamera.centerOn(center.x, center.y);
    }

    ignoreInUICamera(...gameObjects) {
        this.uiCamera.ignore(gameObjects.flat());
    }

    ignoreInMainCamera(...gameObjects) {
        this.mainCamera.ignore(gameObjects.flat());
    }

    setupDragControls() {
        const { input } = this.scene;

        input.on('pointerdown', (pointer) => {
            if (this.scene.shopMenu.isOpen()) return;

            if (pointer.middleButtonDown()) {
                this.dragging = true;
                this.dragStart.x = pointer.x;
                this.dragStart.y = pointer.y;
                this.camStart.x = this.mainCamera.scrollX;
                this.camStart.y = this.mainCamera.scrollY;
            }
        });

        input.on('pointerup', () => {
            this.dragging = false;
        });

        input.on('pointermove', (pointer) => {
            if (!this.dragging) return;
            const dx = pointer.x - this.dragStart.x;
            const dy = pointer.y - this.dragStart.y;
            this.mainCamera.scrollX = this.camStart.x - dx;
            this.mainCamera.scrollY = this.camStart.y - dy;
        });
    }
}
