export default class CameraController {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        this.initCamera();
        this.addControls();
    }

    initCamera() {
        const cam = this.camera;
        cam.setZoom(0.6);
        cam.centerOn(400, 100);
        this.dragSpeed = 1.5;
        this.zoomSpeed = 0.1;
        this.minZoom = 0.6;
        this.maxZoom = 2.5;
    }

    addControls() {
        const scene = this.scene;
        const cam = this.camera;
        let isDragging = false;
        let dragStart = { x: 0, y: 0 };
        let camStart = { x: 0, y: 0 };

        // === Rolagem com botão do meio ===
        scene.input.on('pointerdown', (pointer) => {
            if (pointer.middleButtonDown()) {
                isDragging = true;
                dragStart.x = pointer.x;
                dragStart.y = pointer.y;
                camStart.x = cam.scrollX;
                camStart.y = cam.scrollY;
            }
        });

        scene.input.on('pointerup', () => {
            isDragging = false;
        });

        scene.input.on('pointermove', (pointer) => {
            if (!isDragging) return;
            const dx = (pointer.x - dragStart.x) * this.dragSpeed;
            const dy = (pointer.y - dragStart.y) * this.dragSpeed;
            cam.scrollX = camStart.x - dx;
            cam.scrollY = camStart.y - dy;
        });

        // === Zoom com rodinha ===
        scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const zoomChange = -deltaY * 0.001 * this.zoomSpeed * 10;
            let newZoom = Phaser.Math.Clamp(cam.zoom + zoomChange, this.minZoom, this.maxZoom);
            cam.setZoom(newZoom);
        });
    }

    centerOn(x, y) {
        this.camera.centerOn(x, y);
    }

    setZoom(zoom) {
        this.camera.setZoom(Phaser.Math.Clamp(zoom, this.minZoom, this.maxZoom));
    }
}
