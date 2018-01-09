import fetch from "node-fetch";
import * as model from "./model";

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

async function requestImageEntry(startIndex: number, results: number, query?: string): Promise<model.SummaryResuponse> {
  if (startIndex <= 0) { throw "startIndex must be greater than 0"; }
  let params: API.Parameter = {"start-index": startIndex, "max-results": results};
  if (query) { params["q"] = encodeURIComponent(query); }
  const url = API.buildUrl(API.Endpoint.SUMMARY, params);
  const json = await fetchJson(url);
  return model.SummaryResuponse.parseJson(json);
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  return res.json();
}

export async function search(query: string): Promise<model.ImageDetail[]> {
  return (await requestImageEntry(1, 20, query)).imageDetails;
}

export async function totalImageCount(): Promise<number> {
  return (await requestImageEntry(1, 0)).totalResults;
}

export async function randomImage(): Promise<model.ImageDetail> {
  const maxIndex = await totalImageCount() - 1;
  const index = Math.floor(Math.random() * maxIndex) + 1;
  return (await requestImageEntry(index, 1)).imageDetails[0];
}
