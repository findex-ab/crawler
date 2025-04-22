"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crawler_1 = require("./crawler");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const node_sqlite_1 = __importDefault(require("node:sqlite"));
const OUT_DIR = './crawler_data';
const main = async () => {
    if (!fs_1.default.existsSync(OUT_DIR)) {
        fs_1.default.mkdirSync(OUT_DIR, {
            recursive: true
        });
    }
    const db = new node_sqlite_1.default.DatabaseSync('./tmp.sqlite');
    db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT,
      filename TEXT
    ) STRICT
  `);
    const crawler = new crawler_1.WebCrawler({
        chunkSize: 10,
        requestTimeout: 3500,
        maxCrawlTime: 60000 * 10,
    });
    crawler.use({
        run: async ($, url) => {
            const title = $("title").first().text();
            console.log(title);
            $('img[src]').toArray().forEach(async (el) => {
                const src = $(el).attr('src');
                if (src) {
                    const joined = (0, utils_1.urlJoin)(url, src);
                    const filename = (0, utils_1.getFileName)(joined);
                    const insert = db.prepare('INSERT INTO images (src, filename) VALUES (?, ?)');
                    insert.run(joined, filename);
                    console.log(filename);
                    //if (filename.endsWith('.jpg') || filename.endsWith('.png')) {
                    //  const file = await requestFile(src);
                    //  if (file) {
                    //    //const fullpath = pathlib.join(OUT_DIR, filename);
                    //   // console.log(fullpath);
                    //  //  fs.writeFileSync(fullpath, Buffer.from(file.arrayBuffer), { encoding: 'binary' });
                    //  }
                    //}
                    //console.log(joined);
                }
            });
        },
    });
    await crawler.crawl([
        "https://news.ycombinator.com/",
        "https://www.breakit.se/",
        "https://www.cnbc.com/world/?region=world",
        "https://www.marketwatch.com/",
        "https://www.reuters.com/markets/",
        "https://www.aftonbladet.se/",
        "https://www.gp.se/",
        "https://forum.placera.se/",
        "https://www.avanza.se/start",
        "https://www.di.se/",
        "https://www.msn.com/",
        "https://www.microsoft.com/",
        "https://www.volvo.com/en/",
        "https://www.tesla.com/",
        "https://bitcoin.org/",
        "https://ethereum.org/",
        "https://coinmarketcap.com/",
        "https://www.findex.se/",
        "https://www.svt.se/nyheter/ekonomi/",
        "https://efn.se/",
        "https://www.privataaffarer.se/",
        "https://www.investing.com/news/latest-news",
        "https://www.fi.se/",
        "https://www.thestreet.com/",
        "https://lobste.rs/",
        "https://www.bbc.com/",
        "https://www.intel.com/",
        "https://www.nvidia.com/",
        "https://lidkoping.se/",
        "https://www.gotene.se/",
        "https://stockholm.se/",
        "https://goteborg.se/",
        "https://www.netonnet.se/",
        "https://www.elgiganten.se/",
        "https://www.brogle.com/",
        "https://www.etsy.com/",
        "https://www.ebay.com/",
        "https://www.rolex.com/",
        "https://en.wikipedia.org/wiki/Investment",
        "https://www.flaticon.com/free-icons/cryptocurrency",
        "https://iconduck.com/sets/cryptocurrency-icons",
        "https://www.flaticon.com/",
        "https://iconduck.com/",
        "https://cryptofonts.com/",
        "https://www.freepik.com/",
        "https://www.swedbank.se/",
        "https://www.nordea.se/",
        "https://www.allabolag.se/",
        "https://www.brandsoftheworld.com/",
        "https://worldvectorlogo.com/",
        "https://www.fortnox.se/",
        "https://www.truecaller.com/",
        "https://bycloetta.se/",
        "https://www.castellum.se/",
        "https://rgnt-motorcycles.com/",
    ]);
};
main().catch((e) => console.error(e));
