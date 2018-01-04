import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { checkServerIdentity } from "tls";

export class ImageDetail {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string,
    public categories: string[]
  ) {}
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
  const url = `http://www.irasutoya.com/feeds/posts/default?q=${encodeURIComponent(query)}&alt=json&start-index=1&max-results=20`;
  const json = await fetchJson(url);
  const entries = json.feed.entry;
  return entries.map((e, i) => {
    const $ = parseXml(e.content.$t);
    return new ImageDetail(
      e.title.$t,
      $("img").attr("src"),
      $("div").last().text(),
      e.category.map((e, i) => e.term)
    );
  });
}

export async function searchImage(query: string): Promise<ImageDetail> {
  const imageDetails = await search(query);
  const picked = imageDetails[Math.floor(Math.random() * (imageDetails.length - 1))];
  console.log(picked);
  return picked;
}

async function totalImageCount(): Promise<number> {
  const url = "http://www.irasutoya.com/feeds/posts/summary?max-results=0";
  const $ = await fetchXml(url);
  return +$("openSearch\\:totalResults").text();
}

export async function randomImage(): Promise<ImageDetail> {
  const maxIndex = await totalImageCount() - 1;
  const index = Math.floor(Math.random() * maxIndex) + 1;
  const url = `http://www.irasutoya.com/feeds/posts/summary?start-index=${index}&max-results=1`;
  const $ = await fetchXml(url);
  const imageDetailUrl = $("entry link[rel='edit']").attr("href");
  return parseEntryDetailXml(imageDetailUrl);
}

async function parseEntryDetailXml(url: string): Promise<ImageDetail> {
  const $ = await fetchXml(url);
  const $$ = parseXml($("content").text());
  const detail = new ImageDetail(
    $("title").text().trim(),
    $$("div img").attr("src"),
    $$("div").last().text().trim(),
    $("entry category").toArray().map((e, i) => $(e).attr("term"))
  );

  return detail;
}
