export default class ActionQueue {

    constructor(scene, config = {}, maxsize = 5) {

        this.scene = scene;
        this.queue = [];
        this.executing = false;
        this.maxSize = maxsize;
        this.uiEvents = config.uiEvents;

        this.current = null;
        this.cancelToken = 0;

        this.uiEvents.on("queue:cancelAll", () => {
            this.cancelAll();
        });
    }

    add(actionObj) {

        if (this.queue.length >= this.maxSize) {
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

        const token = this.cancelToken;

        this.emitChange();

        next.action(() => {

            if (token !== this.cancelToken) return;

            if (next.sprite && next.sprite.scene) {
                next.sprite.isQueued = false;
            }

            this.executing = false;
            this.current = null;

            this.emitChange();
            this.runNext();
        });

    }

    cancelAll() {

        this.cancelToken++;

        if (this.current) {

            if (this.current.onCancel) {
                this.current.onCancel(this.current);
            }

            this.restoreSprite(this.current.sprite);

            this.current = null;
        }

        this.queue.forEach(item => {

            if (item.onCancel) {
                item.onCancel(item);
            }

            this.restoreSprite(item.sprite);

        });

        this.queue = [];
        this.executing = false;

        this.emitChange();
    }

    cancelCurrent() {

        if (!this.current) return;

        this.cancelToken++;

        if (this.current.onCancel) {
            this.current.onCancel(this.current);
        }

        this.restoreSprite(this.current.sprite);

        this.current = null;
        this.executing = false;

        this.runNext();
    }

    restoreSprite(sprite) {

        if (!sprite || !sprite.scene) return;

        sprite.clearTint?.();
        sprite.setAlpha?.(1);

        sprite.isQueued = false;

        if (!sprite.destroyed) {
            sprite.setInteractive?.({ useHandCursor: true });
        }

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