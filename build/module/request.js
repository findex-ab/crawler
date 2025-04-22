import agents from "./data/user_agents.json";
import { choose } from "./utils";
import * as cheerio from "cheerio";
export const requestPage = async (url, options = {}) => {
    try {
        const time = new Date().getTime() / 1000;
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "user-agent": choose(agents, options.seed ?? Math.random() * 100 + Math.random() * time),
            },
            redirect: "follow",
            signal: AbortSignal.timeout(options.timeout || 3500),
        });
        const text = await resp.text();
        return text;
    }
    catch (e) {
        return null;
    }
};
export const requestDocument = async (url, options = {}) => {
    const text = await requestPage(url, options);
    if (!text)
        return null;
    return cheerio.load(text, {
        decodeEntities: true,
        normalizeWhitespace: true,
        recognizeSelfClosing: true
    });
};
export const requestFile = async (url, options = {}) => {
    try {
        const time = new Date().getTime() / 1000;
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "user-agent": choose(agents, options.seed ?? Math.random() * 100 + Math.random() * time),
            },
            redirect: "follow",
            ...(options.timeout
                ? {
                    signal: AbortSignal.timeout(options.timeout),
                }
                : {}),
        });
        if (!resp.ok)
            return null;
        const arrayBuffer = await resp.arrayBuffer();
        if (arrayBuffer.byteLength <= 0)
            return null;
        const headers = resp.headers;
        const entries = Array.from(headers.entries());
        const headerDict = Object.assign({}, ...entries.map(([k, v]) => ({ [k]: v })));
        return {
            arrayBuffer,
            headers: headerDict,
        };
    }
    catch (e) {
        return null;
    }
};
