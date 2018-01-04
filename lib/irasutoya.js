"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const node_fetch_1 = require("node-fetch");
class ImageDetail {
    constructor(title, imageUrl, description, categories) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.categories = categories;
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
async function fetchJson(url) {
    const res = await node_fetch_1.default(url);
    return res.json();
}
async function search(query) {
    const url = `http://www.irasutoya.com/feeds/posts/default?q=${encodeURIComponent(query)}&alt=json&start-index=1&max-results=20`;
    const json = await fetchJson(url);
    const entries = json.feed.entry;
    return entries.map((e, i) => {
        const $ = parseXml(e.content.$t);
        return new ImageDetail(e.title.$t, $("img").attr("src"), $("div").last().text(), e.category.map((e, i) => e.term));
    });
}
exports.search = search;
async function searchImage(query) {
    const imageDetails = await search(query);
    const picked = imageDetails[Math.floor(Math.random() * (imageDetails.length - 1))];
    console.log(picked);
    return picked;
}
exports.searchImage = searchImage;
async function totalImageCount() {
    const url = "http://www.irasutoya.com/feeds/posts/summary?max-results=0";
    const $ = await fetchXml(url);
    return +$("openSearch\\:totalResults").text();
}
async function randomImage() {
    const maxIndex = await totalImageCount() - 1;
    const index = Math.floor(Math.random() * maxIndex) + 1;
    const url = `http://www.irasutoya.com/feeds/posts/summary?start-index=${index}&max-results=1`;
    const $ = await fetchXml(url);
    const imageDetailUrl = $("entry link[rel='edit']").attr("href");
    return parseEntryDetailXml(imageDetailUrl);
}
exports.randomImage = randomImage;
async function parseEntryDetailXml(url) {
    const $ = await fetchXml(url);
    const $$ = parseXml($("content").text());
    const detail = new ImageDetail($("title").text().trim(), $$("div img").attr("src"), $$("div").last().text().trim(), $("entry category").toArray().map((e, i) => $(e).attr("term")));
    return detail;
}
//# sourceMappingURL=irasutoya.js.map