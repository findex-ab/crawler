"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
const workerTypes_1 = require("./workerTypes");
const crawler_1 = require("./crawler");
const main = async () => {
    const data = node_worker_threads_1.workerData;
    const crawler = new crawler_1.WebCrawler(data.options);
    crawler.use({
        run: async ($, url) => {
            const html = $.html();
            const msg = {
                type: workerTypes_1.EWorkerMessage.RUN,
                html: html,
                url: url
            };
            node_worker_threads_1.parentPort?.postMessage(msg);
        },
        onCleanup: async () => {
            const msg = {
                type: workerTypes_1.EWorkerMessage.CLEANUP
            };
            node_worker_threads_1.parentPort?.postMessage(msg);
        }
    });
    await crawler.crawl(data.urls);
};
main().catch(e => console.error(e));
