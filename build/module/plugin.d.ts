export type WebCrawlerPluginRunFunction = ($: cheerio.Root, url: string) => any;
export type WebCrawlerPluginCleanupFunction = () => any;
export interface WebCrawlerPlugin {
    run: WebCrawlerPluginRunFunction;
    onCleanup?: WebCrawlerPluginCleanupFunction;
}
