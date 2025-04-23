import pathlib from "path";
import { chunkify } from "./utils";
import { EWorkerMessage } from "./workerTypes";
import { Worker } from "node:worker_threads";
import * as cheerio from "cheerio";
const workerPath = pathlib.resolve(__dirname, "./worker.js");
const createWorker = (data, plugins = []) => {
    return new Promise((resolve) => {
        const worker = new Worker(workerPath, {
            workerData: data,
        });
        worker.on("message", async (data) => {
            const msg = data;
            switch (msg.type) {
                case EWorkerMessage.RUN:
                    {
                        const root = cheerio.load(msg.html);
                        await Promise.allSettled(plugins.map(async (plug) => {
                            return await plug.run(root, msg.url);
                        }));
                    }
                    break;
                case EWorkerMessage.CLEANUP:
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
export const batchCrawl = async (urls, options = {}) => {
    const { numWorkers = 2, plugins = [] } = options;
    const chunks = chunkify(urls, Math.max(1, Math.ceil(urls.length / numWorkers)));
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
