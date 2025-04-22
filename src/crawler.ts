import { WebCrawlerPlugin } from "./plugin";
import { Queue } from "./queue";
import { requestDocument } from "./request";
import { Scheduler } from "./scheduler";
import { getTime, sleep, urlJoin } from "./utils";

const DEFAULT_MAX_CRAWL_TIME = 10000;
const DEFAULT_CHUNK_SIZE = 10;
const DEFAULT_REQUEST_TIMEOUT = 3500;

export type WebCrawlerOptions = {
  requestTimeout?: number;
  chunkSize?: number;
  maxCrawlTime?: number;
  verbose?: boolean;
};

export class WebCrawler {
  scheduler = new Scheduler();
  queue = new Queue<string>();
  options: WebCrawlerOptions;
  plugins: WebCrawlerPlugin[] = [];

  constructor(options: WebCrawlerOptions = {}) {
    this.options = options;
  }

  use(plugin: WebCrawlerPlugin): WebCrawler {
    this.plugins.push(plugin);
    return this;
  }

  private log(...args: any[]) {
    if (!this.options.verbose) return;
    console.log(...args);
  }

  private async _crawl(urls: string[]): Promise<void> {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE,
      requestTimeout = DEFAULT_REQUEST_TIMEOUT,
      maxCrawlTime = DEFAULT_MAX_CRAWL_TIME,
    } = this.options;

    urls.forEach((url) => this.queue.push(url));

    const timeStarted = getTime();

    while (this.queue.length > 0) {
      const now = getTime();
      const diff = now - timeStarted;
      if (diff > maxCrawlTime) break;

      for (let i = 0; i < chunkSize; i++) {
        const url = this.queue.pop();
        if (!url) break;
        this.log(url);
        this.scheduler.schedule(async () => {
          const $ = await requestDocument(url, {
            timeout: requestTimeout,
            seed: 4918 + i,
          });
          if (!$) return;
          const links = $("a[href]")
            .toArray()
            .map((el) => $(el).attr("href"))
            .filter((it) => typeof it === "string")
            .filter(
              (it) =>
                !it.includes("tel:") &&
                !it.includes("mailto:") &&
                !it.includes("javascript:"),
            )
            .map((it) => urlJoin(url, it));
          links.forEach((link) => this.queue.push(link));

          await Promise.allSettled(this.plugins.map(async (plug) => await plug.run($, url)));
        }, requestTimeout);
      }
      await this.scheduler.process(chunkSize);
    }
  }

  async crawl(urls: string[]): Promise<void> {
    const { maxCrawlTime = DEFAULT_MAX_CRAWL_TIME } = this.options;

    return await Promise.race([this._crawl(urls), sleep(maxCrawlTime)]);
  }
}
