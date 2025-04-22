import { WebCrawlerPlugin } from "./plugin";
import { Queue } from "./queue";
import { Scheduler } from "./scheduler";
export type WebCrawlerOptions = {
    requestTimeout?: number;
    chunkSize?: number;
    maxCrawlTime?: number;
    verbose?: boolean;
};
export declare class WebCrawler {
    scheduler: Scheduler;
    queue: Queue<string>;
    options: WebCrawlerOptions;
    plugins: WebCrawlerPlugin[];
    constructor(options?: WebCrawlerOptions);
    use(plugin: WebCrawlerPlugin): WebCrawler;
    private log;
    private _crawl;
    crawl(urls: string[]): Promise<void>;
}
