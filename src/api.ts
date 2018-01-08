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

  export interface Parameter {
    [index: string]: any;
  }

  export function buildUrl(endpoint: Endpoint, params: Parameter): string {
    const keys = Object.keys(params);
    const queryParam = keys.length === 0 ? "" : `&${keys.map((e, i) => `${e}=${params[e]}`).join("&")}`;
    return `${basePath}${endpoint}?alt=json${queryParam}`;
  }
}

class SummaryResuponse {
  constructor(
    public totalResults: number,
    public imageDetails: ImageDetail[]
  ) {}

  static parseJson(json: any): SummaryResuponse {
    return new SummaryResuponse(
      +json.feed.openSearch$totalResults.$t,
      json.feed.entry.map((e, i) => ImageDetail.parseJsonEntry(e))
    );
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
    return new ImageDetail(
      entry.title.$t,
      entry.media$thumbnail.url.replace("/s72-c/", "/"),
      entry.summary.$t,
      entry.category.map((e, i) => e.term)
    );
  }

  static __parseJsonEntryForDefault(entry: any): ImageDetail {
    const $ = cheerio.load(entry.content.$t, {xmlMode: true});
    return new ImageDetail(
      entry.title.$t,
      $("img").attr("src"),
      $("div").last().text(),
      entry.category.map((e, i) => e.term)
    );
  }
}

async function requestImageEntry(startIndex: number, results: number, query?: string): Promise<SummaryResuponse> {
  let params: API.Parameter = {"start-index": startIndex, "max-results": results};
  if (query) { params["q"] = encodeURIComponent(query); }
  const url = API.buildUrl(API.Endpoint.SUMMARY, params);
  const json = await fetchJson(url);
  return SummaryResuponse.parseJson(json);
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  return res.json();
}

export async function search(query: string): Promise<ImageDetail[]> {
  return (await requestImageEntry(1, 20, query)).imageDetails;
}

export async function searchImage(query: string): Promise<ImageDetail> {
  const imageDetails = await search(query);
  const picked = imageDetails[Math.floor(Math.random() * (imageDetails.length - 1))];
  console.log(picked);
  return picked;
}

export async function totalImageCount(): Promise<number> {
  return (await requestImageEntry(0, 0)).totalResults;
}

export async function randomImage(): Promise<ImageDetail> {
  const maxIndex = await totalImageCount() - 1;
  const index = Math.floor(Math.random() * maxIndex) + 1;
  return (await requestImageEntry(index, 1))[0];
}
