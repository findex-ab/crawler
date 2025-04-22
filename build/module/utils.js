import pathlib from 'path';
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const range = (n) => n <= 0 || typeof n !== "number" || isNaN(n) || !isFinite(n)
    ? []
    : Array.from(Array(Math.floor(n)).keys());
export const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};
export const hashv1 = (seed) => {
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
export const choose = (arr, seed) => {
    return arr[clamp(Math.round(hashv1(seed) * (arr.length - 1)), 0, arr.length - 1)];
};
export const urlJoin = (a, b) => {
    try {
        return new URL(b, a).href;
    }
    catch {
        return b || a || '';
    }
};
export const getTime = () => {
    return performance.now();
};
export const getFileName = (x) => {
    const basename = pathlib.basename(x);
    const idx = basename.lastIndexOf('?');
    if (idx > 0)
        return basename.slice(0, idx);
    return basename;
};
