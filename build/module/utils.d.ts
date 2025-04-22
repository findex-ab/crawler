export declare const clamp: (value: number, min: number, max: number) => number;
export declare const range: (n: number) => number[];
export declare const sleep: (ms: number) => Promise<void>;
export declare const hashv1: (seed: number) => number;
export declare const choose: <T = any>(arr: T[], seed: number) => T;
export declare const urlJoin: (a: string, b: string) => string;
export declare const getTime: () => number;
