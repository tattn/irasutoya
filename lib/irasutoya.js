"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const node_fetch_1 = require("node-fetch");
class ImageDetail {
    constructor(title, imageUrl, description) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}
exports.ImageDetail = ImageDetail;
async function searchEntryUrls(query) {
    const url = `http://www.irasutoya.com/search?q=${encodeURIComponent(query)}`;
    const res = await node_fetch_1.default(url);
    const $ = cheerio.load(await res.text());
    return $(".boxim > a").map((i, e) => $(e).attr("href"));
}
async function fetchImageDetail(url) {
    const entries = await node_fetch_1.default(url);
    const $ = cheerio.load(await entries.text());
    let detail = new ImageDetail($(".title h2").text().trim(), $(".entry .separator a").attr("href"), $(".entry .separator").text().trim());
    return detail;
}
async function searchImage(query) {
    try {
        const urls = await searchEntryUrls(query);
        if (urls.length === 0) {
            throw new Error("Not found");
        }
        const entryUrl = urls[Math.floor(Math.random() * urls.length)];
        const imageDetail = await fetchImageDetail(entryUrl);
        console.log(imageDetail);
        return imageDetail;
    }
    catch (error) {
        console.log(error);
    }
}
exports.searchImage = searchImage;
//# sourceMappingURL=irasutoya.js.map