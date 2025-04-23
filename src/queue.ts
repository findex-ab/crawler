import { shuffle } from "./utils";

export class Queue<T> {
  private lookup: Set<T> = new Set();
  items: Array<T> = [];
  
  has(item: T): boolean {
    return this.lookup.has(item);
  }

  get length() {
    return this.items.length;
  }

  shuffle() {
    this.items = shuffle(this.items);
  }

  push(item: T): T | null {
    if (this.has(item)) return null;
    this.lookup.add(item);
    this.items.push(item);
    return item;
  }

  pop(): T | null {
    if (this.items.length <= 0) return null;
    const next = this.items[0];
    this.items.splice(0, 1);
    this.lookup.delete(next);
    return next;
  }

  clear() {
    this.items = [];
    this.lookup.clear();
  }
}
