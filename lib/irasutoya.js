"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const node_fetch_1 = require("node-fetch");
var API;
(function (API) {
    const hostname = "www.irasutoya.com";
    const basePath = `http://${hostname}`;
    let Endpoint;
    (function (Endpoint) {
        Endpoint.DEFAULT = "/feeds/posts/default";
        Endpoint.SUMMARY = "/feeds/posts/summary";
    })(Endpoint = API.Endpoint || (API.Endpoint = {}));
    function buildUrl(endpoint, params) {
        return `${basePath}${endpoint}?alt=json&${Object.keys(params).map((e, i) => `${e}=${params[e]}`).join("&")}`;
    }
    API.buildUrl = buildUrl;
})(API || (API = {}));
class ImageDetail {
    constructor(title, imageUrl, description, categories) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.categories = categories;
    }
    static parseJsonEntry(entry) {
        const $ = parseXml(entry.content.$t);
        return new ImageDetail(entry.title.$t, $("img").attr("src"), $("div").last().text(), entry.category.map((e, i) => e.term));
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
    const url = API.buildUrl(API.Endpoint.DEFAULT, { q: encodeURIComponent(query), "start-index": 1, "max-results": 20 });
    const json = await fetchJson(url);
    const entries = json.feed.entry;
    return entries.map((e, i) => ImageDetail.parseJsonEntry(e));
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
    const url = API.buildUrl(API.Endpoint.SUMMARY, { "max-results": 0 });
    const json = await fetchJson(url);
    return +json.feed.openSearch$totalResults.$t;
}
exports.totalImageCount = totalImageCount;
async function randomImage() {
    const maxIndex = await totalImageCount() - 1;
    const index = Math.floor(Math.random() * maxIndex) + 1;
    const url = API.buildUrl(API.Endpoint.DEFAULT, { "start-index": index, "max-results": 1 });
    const json = await fetchJson(url);
    return ImageDetail.parseJsonEntry(json.feed.entry[0]);
}
exports.randomImage = randomImage;
//# sourceMappingURL=irasutoya.js.map