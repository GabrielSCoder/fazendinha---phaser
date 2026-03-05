export default class ActionQueue {

    constructor(scene, config = {}, maxsize = 5) {
        this.scene = scene;
        this.queue = [];
        this.executing = false;
        this.maxSize = maxsize;
        this.uiEvents = config.uiEvents;
        this.current = null;

        this.uiEvents.on("queue:cancelAll", () => {
            console.log("chegando")
            this.cancelAll();
        });
    }

    add(actionObj) {

        if (this.queue.length >= this.maxSize) {
            console.log("⚠ Fila cheia");
            return false;
        }

        this.queue.push(actionObj);
        this.runNext();
        return true;
    }

    runNext() {

        if (this.executing) return;

        const next = this.queue.shift();
        if (!next) {
            this.emitChange();
            return;
        }

        this.current = next;
        this.executing = true;
        this.emitChange();

        next.action(() => {

            if (next.sprite) {
                next.sprite.isQueued = false;
            }

            this.executing = false;
            this.current = null;

            this.emitChange();
            this.runNext();
        });
    }

    cancelAll() {

        this.queue.forEach(item => {

            const sprite = item.sprite;

            if (!sprite) return;

            sprite.setAlpha(1);
            sprite.isQueued = false;

            if (!sprite.destroyed) {
                sprite.setInteractive({ useHandCursor: true });
            }

        });

        this.queue = [];

        this.emitChange();
    }

    cancelCurrent() {

        if (!this.current) return;

        const sprite = this.current.sprite;

        if (sprite) {
            sprite.setAlpha(1);
            sprite.isQueued = false;
            sprite.setInteractive({ useHandCursor: true });
        }

        this.executing = false;
        this.current = null;

        this.runNext();
    }

    size() {
        return this.queue.length;
    }

    isFull() {
        return this.queue.length >= this.maxSize;
    }

    isBusy() {
        return this.executing || this.queue.length > 0;
    }

    emitChange() {
        this.uiEvents.emit('queue:changed', this.isBusy());
    }


}
