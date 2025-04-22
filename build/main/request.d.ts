export type RequestOptions = {
    timeout?: number;
    seed?: number;
};
export declare const requestPage: (url: string, options?: RequestOptions) => Promise<string | null>;
export declare const requestDocument: (url: string, options?: RequestOptions) => Promise<cheerio.Root | null>;
