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
exports.batchCrawl = void 0;
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const workerTypes_1 = require("./workerTypes");
const node_worker_threads_1 = require("node:worker_threads");
const cheerio = __importStar(require("cheerio"));
const workerPath = path_1.default.resolve(__dirname, "./worker.js");
const createWorker = (data, plugins = []) => {
    return new Promise((resolve) => {
        const worker = new node_worker_threads_1.Worker(workerPath, {
            workerData: data,
        });
        worker.on("message", async (data) => {
            const msg = data;
            switch (msg.type) {
                case workerTypes_1.EWorkerMessage.RUN:
                    {
                        const root = cheerio.load(msg.html);
                        await Promise.allSettled(plugins.map(async (plug) => {
                            return await plug.run(root, msg.url);
                        }));
                    }
                    break;
                case workerTypes_1.EWorkerMessage.CLEANUP:
                    {
                        await Promise.allSettled(plugins.map(async (plug) => {
                            if (plug.onCleanup) {
                                return await plug.onCleanup();
                            }
                        }));
                    }
                    break;
            }
        });
        worker.on("exit", () => {
            resolve();
        });
        worker.on("error", (err) => {
            console.error(err);
            resolve();
        });
    });
};
const batchCrawl = async (urls, options = {}) => {
    const { numWorkers = 2, plugins = [] } = options;
    const chunks = (0, utils_1.chunkify)(urls, Math.max(1, Math.ceil(urls.length / numWorkers)));
    return (await Promise.allSettled(chunks.map(async (chunk) => {
        const messages = await createWorker({
            urls: chunk,
            options: options.options || {},
        }, plugins);
        return messages;
    })))
        .filter((it) => it.status === "fulfilled")
        .map((it) => it.value)
        .flat();
};
exports.batchCrawl = batchCrawl;
