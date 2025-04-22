export class Queue {
    lookup = new Set();
    items = [];
    has(item) {
        return this.lookup.has(item);
    }
    get length() {
        return this.items.length;
    }
    push(item) {
        if (this.has(item))
            return null;
        this.lookup.add(item);
        this.items.push(item);
        return item;
    }
    pop() {
        if (this.items.length <= 0)
            return null;
        const next = this.items[0];
        this.items.splice(0, 1);
        return next;
    }
    clear() {
        this.items = [];
        this.lookup.clear();
    }
}
