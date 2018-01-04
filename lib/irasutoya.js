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
function parseXml(xml) {
    return cheerio.load(xml, { xmlMode: true });
}
async function fetchXml(url) {
    const xml = await node_fetch_1.default(url);
    return parseXml(await xml.text());
}
async function searchEntryUrls(query) {
    const url = `http://www.irasutoya.com/search?q=${encodeURIComponent(query)}`;
    const res = await node_fetch_1.default(url);
    const $ = cheerio.load(await res.text());
    return $(".boxim > a").toArray().map((e, i) => $(e).attr("href"));
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
async function totalImageCount() {
    const url = "http://www.irasutoya.com/feeds/posts/summary?max-results=0";
    const $ = await fetchXml(url);
    return +$("openSearch\\:totalResults").text();
}
async function randomImage() {
    const maxIndex = await totalImageCount() - 1;
    const index = Math.floor(Math.random() * maxIndex);
    const url = `http://www.irasutoya.com/feeds/posts/summary?start-index=${index}&max-results=1`;
    const $ = await fetchXml(url);
    const imageDetailUrl = $("entry link[rel='edit']").attr("href");
    return parseEntryDetailXml(imageDetailUrl);
}
exports.randomImage = randomImage;
async function parseEntryDetailXml(url) {
    const $ = await fetchXml(url);
    const $$ = parseXml($("content").text());
    const detail = new ImageDetail($("title").text().trim(), $$("div img").attr("src"), $$("div").last().text().trim());
    return detail;
}
//# sourceMappingURL=irasutoya.js.map