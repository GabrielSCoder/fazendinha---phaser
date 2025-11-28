export default class ActionQueue {
    constructor() {
        this.queue = [];
        this.executing = false;
    }

    add(action) {
        this.queue.push(action);
        this.runNext();
    }

    runNext() {
        if (this.executing) return;
        const next = this.queue.shift();
        if (!next) return;

        this.executing = true;
        next(() => {
            this.executing = false;
            this.runNext();
        });
    }

    clear() {
        this.queue = [];
        this.executing = false;
    }
}
