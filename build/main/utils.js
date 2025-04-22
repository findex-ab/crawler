"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTime = exports.urlJoin = exports.choose = exports.hashv1 = exports.sleep = exports.range = exports.clamp = void 0;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
exports.clamp = clamp;
const range = (n) => n <= 0 || typeof n !== "number" || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());
exports.range = range;
const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};
exports.sleep = sleep;
const hashv1 = (seed) => {
    let j = (~seed >> 3) * 19;
    let k = seed + j;
    k ^= k << 17;
    k ^= k >> 13;
    k ^= k << 5;
    j ^= k;
    j ^= j << 15;
    j ^= j >> 14;
    j ^= j << 3;
    j *= 50135;
    j = j >>> 0;
    return j / 0xffffffff;
};
exports.hashv1 = hashv1;
const choose = (arr, seed) => {
    return arr[(0, exports.clamp)(Math.round((0, exports.hashv1)(seed) * (arr.length - 1)), 0, arr.length - 1)];
};
exports.choose = choose;
const urlJoin = (a, b) => {
    try {
        return new URL(b, a).href;
    }
    catch {
        return b || a || '';
    }
};
exports.urlJoin = urlJoin;
const getTime = () => {
    return performance.now();
};
exports.getTime = getTime;
