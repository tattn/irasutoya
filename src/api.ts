import * as cheerio from "cheerio";
import fetch from "node-fetch";

namespace API {
  const hostname = "www.irasutoya.com";
  const basePath = `http://${hostname}`;

  type Endpoint = "/feeds/posts/default" | "/feeds/posts/summary";
  export namespace Endpoint {
    export const DEFAULT: Endpoint = "/feeds/posts/default";
    export const SUMMARY: Endpoint = "/feeds/posts/summary";
  }

  interface Parameter {
    [index: string]: any;
  }

  export function buildUrl(endpoint: Endpoint, params: Parameter): string {
    const keys = Object.keys(params);
    const queryParam = keys.length === 0 ? "" : `&${keys.map((e, i) => `${e}=${params[e]}`).join("&")}`;
    return `${basePath}${endpoint}?alt=json${queryParam}`;
  }
}

export class ImageDetail {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public categories: string[]
  ) {}

  static parseJsonEntry(entry: any): ImageDetail {
    const $ = parseXml(entry.content.$t);
    return new ImageDetail(
      entry.title.$t,
      $("img").attr("src"),
      $("div").last().text(),
      entry.category.map((e, i) => e.term)
    );
  }
}

function parseXml(xml: string): CheerioStatic {
  return cheerio.load(xml, {xmlMode: true});
}

async function fetchXml(url: string): Promise<CheerioStatic> {
  const xml = await fetch(url);
  return parseXml(await xml.text());
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  return res.json();
}

export async function search(query: string): Promise<ImageDetail[]> {
  const url = API.buildUrl(API.Endpoint.DEFAULT, {q: encodeURIComponent(query), "start-index": 1, "max-results": 20});
  const json = await fetchJson(url);
  const entries = json.feed.entry;
  return entries.map((e, i) => ImageDetail.parseJsonEntry(e));
}

export async function searchImage(query: string): Promise<ImageDetail> {
  const imageDetails = await search(query);
  const picked = imageDetails[Math.floor(Math.random() * (imageDetails.length - 1))];
  console.log(picked);
  return picked;
}

export async function totalImageCount(): Promise<number> {
  const url = API.buildUrl(API.Endpoint.SUMMARY, {"max-results": 0});
  const json = await fetchJson(url);
  return +json.feed.openSearch$totalResults.$t;
}

export async function randomImage(): Promise<ImageDetail> {
  const maxIndex = await totalImageCount() - 1;
  const index = Math.floor(Math.random() * maxIndex) + 1;
  const url = API.buildUrl(API.Endpoint.DEFAULT, {"start-index": index, "max-results": 1});
  const json = await fetchJson(url);
  return ImageDetail.parseJsonEntry(json.feed.entry[0]);
}
