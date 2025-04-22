"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDocument = exports.requestPage = void 0;
const user_agents_json_1 = __importDefault(require("./data/user_agents.json"));
const utils_1 = require("./utils");
const cheerio = __importStar(require("cheerio"));
const requestPage = async (url, options = {}) => {
    try {
        const time = new Date().getTime() / 1000;
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "user-agent": (0, utils_1.choose)(user_agents_json_1.default, options.seed ?? (Math.random() * 100 + Math.random() * time)),
            },
            redirect: 'follow',
            signal: AbortSignal.timeout(options.timeout || 3500),
        });
        const text = await resp.text();
        return text;
    }
    catch (e) {
        return null;
    }
};
exports.requestPage = requestPage;
const requestDocument = async (url, options = {}) => {
    const text = await (0, exports.requestPage)(url, options);
    if (!text)
        return null;
    return cheerio.load(text, {
        decodeEntities: true,
        normalizeWhitespace: true,
        recognizeSelfClosing: true
    });
};
exports.requestDocument = requestDocument;
