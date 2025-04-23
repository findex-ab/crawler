export declare class Queue<T> {
    private lookup;
    items: Array<T>;
    has(item: T): boolean;
    get length(): number;
    shuffle(): void;
    push(item: T): T | null;
    pop(): T | null;
    clear(): void;
}
