"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCrawler = void 0;
const queue_1 = require("./queue");
const request_1 = require("./request");
const scheduler_1 = require("./scheduler");
const utils_1 = require("./utils");
const DEFAULT_MAX_CRAWL_TIME = 10000;
const DEFAULT_CHUNK_SIZE = 10;
const DEFAULT_REQUEST_TIMEOUT = 3500;
class WebCrawler {
    scheduler = new scheduler_1.Scheduler();
    queue = new queue_1.Queue();
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
    async _crawl(urls) {
        const { chunkSize = DEFAULT_CHUNK_SIZE, requestTimeout = DEFAULT_REQUEST_TIMEOUT, maxCrawlTime = DEFAULT_MAX_CRAWL_TIME, } = this.options;
        urls.forEach((url) => this.queue.push(url));
        const timeStarted = (0, utils_1.getTime)();
        while (this.queue.length > 0) {
            const now = (0, utils_1.getTime)();
            const diff = now - timeStarted;
            if (diff > maxCrawlTime)
                break;
            for (let i = 0; i < chunkSize; i++) {
                const url = this.queue.pop();
                if (!url)
                    break;
                this.log(url);
                this.scheduler.schedule(async () => {
                    const $ = await (0, request_1.requestDocument)(url, {
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
                        !it.includes("javascript:"))
                        .map((it) => (0, utils_1.urlJoin)(url, it));
                    links.forEach((link) => this.queue.push(link));
                    await Promise.allSettled(this.plugins.map(async (plug) => await plug.run($, url)));
                }, requestTimeout);
            }
            await this.scheduler.process(chunkSize);
        }
    }
    async crawl(urls) {
        const { maxCrawlTime = DEFAULT_MAX_CRAWL_TIME } = this.options;
        return await Promise.race([this._crawl(urls), (0, utils_1.sleep)(maxCrawlTime)]);
    }
}
exports.WebCrawler = WebCrawler;
