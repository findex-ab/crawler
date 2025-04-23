import { Queue } from "./queue";
import { requestDocument } from "./request";
import { Scheduler } from "./scheduler";
import { getTime, sleep, urlJoin } from "./utils";
const DEFAULT_MAX_CRAWL_TIME = 10000;
const DEFAULT_CHUNK_SIZE = 10;
const DEFAULT_REQUEST_TIMEOUT = 3500;
export class WebCrawler {
    scheduler = new Scheduler();
    queue = new Queue();
    visited = new Set();
    options;
    plugins = [];
    constructor(options = {}) {
        this.options = options;
    }
    use(plugin) {
        this.plugins.push(plugin);
        return this;
    }
    log(...args) {
        if (!this.options.verbose)
            return;
        console.log(...args);
    }
    shouldSkip(url) {
        if (this.visited.has(url))
            return true;
        if (!url.startsWith("http://") && !url.startsWith("https://"))
            return true;
        return false;
    }
    async _crawl(urls) {
        const { chunkSize = DEFAULT_CHUNK_SIZE, requestTimeout = DEFAULT_REQUEST_TIMEOUT, maxCrawlTime = DEFAULT_MAX_CRAWL_TIME, } = this.options;
        urls.forEach((url) => this.queue.push(url));
        const timeStarted = getTime();
        while (this.queue.length > 0) {
            const now = getTime();
            const diff = now - timeStarted;
            if (diff > maxCrawlTime)
                break;
            for (let i = 0; i < chunkSize; i++) {
                const url = this.queue.pop();
                if (!url)
                    break;
                if (this.shouldSkip(url))
                    continue;
                this.visited.add(url);
                this.log(url);
                this.scheduler.schedule(async () => {
                    const $ = await requestDocument(url, {
                        timeout: requestTimeout,
                        seed: 4918 + i,
                    });
                    if (!$)
                        return;
                    const links = $("a[href]")
                        .toArray()
                        .map((el) => $(el).attr("href"))
                        .filter((it) => typeof it === "string")
                        .filter((it) => !it.includes("tel:") &&
                        !it.includes("mailto:") &&
                        !it.includes("javascript:") &&
                        !this.shouldSkip(it))
                        .map((it) => urlJoin(url, it));
                    links.forEach((link) => this.queue.push(link));
                    await Promise.allSettled(this.plugins.map(async (plug) => await plug.run($, url)));
                }, requestTimeout);
            }
            await this.scheduler.process(chunkSize);
            await Promise.allSettled(this.plugins.map(async (plug) => {
                if (plug.onCleanup) {
                    await plug.onCleanup();
                }
            }));
        }
    }
    async crawl(urls) {
        const { maxCrawlTime = DEFAULT_MAX_CRAWL_TIME } = this.options;
        return await Promise.race([this._crawl(urls), sleep(maxCrawlTime)]);
    }
}
