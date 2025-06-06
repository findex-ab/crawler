import { WebCrawlerOptions } from "./crawler";
import { getFileName, urlJoin } from "./utils";
import fs from 'fs';
import sqlite from 'node:sqlite';
import { WebCrawlerPlugin } from "./plugin";
import { batchCrawl } from "./batch";

const OUT_DIR = './crawler_data';

const main = async () => {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, {
      recursive: true
    });
  }

  const db = new sqlite.DatabaseSync('./tmp.sqlite');
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT,
      filename TEXT
    ) STRICT
  `);

  const options: WebCrawlerOptions = {
    chunkSize: 10,
    requestTimeout: 3500,
    maxCrawlTime: 1000 * 10,
    verbose: true
  }

  const plugin: WebCrawlerPlugin = {
    run: async ($, url) => {
      const title = $("title").first().text();
      console.log(title, url);
      //$('img[src]').toArray().forEach(async (el) => {
      //  const src = $(el).attr('src');
      //  if (src) {
      //    const joined = urlJoin(url, src);
      //    const filename = getFileName(joined);

      //    const insert = db.prepare('INSERT INTO images (src, filename) VALUES (?, ?)');
      //    insert.run(joined, filename);
      //  //  console.log(filename);
      //    
      //    //if (filename.endsWith('.jpg') || filename.endsWith('.png')) {
      //    //  const file = await requestFile(src);
      //    //  if (file) {
      //    //    //const fullpath = pathlib.join(OUT_DIR, filename);
      //    //   // console.log(fullpath);
      //    //  //  fs.writeFileSync(fullpath, Buffer.from(file.arrayBuffer), { encoding: 'binary' });
      //    //  }
      //    //}
      //    //console.log(joined);
      //    
      //  }

      //})
    },
  }

  await batchCrawl([
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
  ], {
    options: options,
    numWorkers: 10,
    plugins: [plugin]
  });
};

main().catch((e) => console.error(e));
