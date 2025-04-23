import { workerData, parentPort } from "node:worker_threads";
import { EWorkerMessage, IWorkerData, IWorkerMessage } from "./workerTypes";
import { WebCrawler } from "./crawler";


const main = async () => {
  const data = workerData as IWorkerData;

  const crawler = new WebCrawler(data.options);
  crawler.use({
    run: async ($, url) => {
      const html = $.html();
      const msg: IWorkerMessage = {
        type: EWorkerMessage.RUN,
        html: html,
        url: url
      }
      parentPort?.postMessage(msg);
    },
    onCleanup: async () => {
      const msg: IWorkerMessage = {
        type: EWorkerMessage.CLEANUP
      }
      parentPort?.postMessage(msg);
    }
  })
  await crawler.crawl(data.urls);
}

main().catch(e => console.error(e));
