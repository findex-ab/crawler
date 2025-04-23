import { WebCrawlerOptions } from "./crawler";
import { WebCrawlerPlugin } from "./plugin";
export type BatchWebCrawlOptions = {
    options?: WebCrawlerOptions;
    plugins?: WebCrawlerPlugin[];
    numWorkers?: number;
};
export declare const batchCrawl: (urls: string[], options?: BatchWebCrawlOptions) => Promise<void[]>;
