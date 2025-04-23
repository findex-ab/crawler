import { workerData, parentPort } from "node:worker_threads";
import { EWorkerMessage } from "./workerTypes";
import { WebCrawler } from "./crawler";
const main = async () => {
    const data = workerData;
    const crawler = new WebCrawler(data.options);
    crawler.use({
        run: async ($, url) => {
            const html = $.html();
            const msg = {
                type: EWorkerMessage.RUN,
                html: html,
                url: url
            };
            parentPort?.postMessage(msg);
        },
        onCleanup: async () => {
            const msg = {
                type: EWorkerMessage.CLEANUP
            };
            parentPort?.postMessage(msg);
        }
    });
    await crawler.crawl(data.urls);
};
main().catch(e => console.error(e));
