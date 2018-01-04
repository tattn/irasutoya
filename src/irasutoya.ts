import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { checkServerIdentity } from "tls";
import * as decode from "unescape";

export class ImageDetail {
  constructor(
    public title: string,
    public imageUrl: string,
    public description: string
  ) {}
}

function parseXml(xml: string): CheerioStatic {
  return cheerio.load(xml, {xmlMode: true});
}

async function fetchXml(url: string): Promise<CheerioStatic> {
  const xml = await fetch(url);
  return parseXml(await xml.text());
}

async function searchEntryUrls(query: string): Promise<string[]> {
  const url = `http://www.irasutoya.com/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const $ = cheerio.load(await res.text());
  return $(".boxim > a").toArray().map((e, i) => $(e).attr("href"));
}

async function fetchImageDetail(url: string): Promise<ImageDetail> {
  const entries = await fetch(url);
  const $ = cheerio.load(await entries.text());

  let detail = new ImageDetail(
    $(".title h2").text().trim(),
    $(".entry .separator a").attr("href"),
    $(".entry .separator").text().trim()
  );

  return detail;
}

export async function searchImage(query: string): Promise<ImageDetail> {
  try {
    const urls = await searchEntryUrls(query);
    if (urls.length === 0) {
      throw new Error("Not found");
    }

    const entryUrl = urls[Math.floor(Math.random() * urls.length)];
    const imageDetail = await fetchImageDetail(entryUrl);
    console.log(imageDetail);

    return imageDetail;
  } catch (error) {
    console.log(error);
  }
}

async function totalImageCount(): Promise<number> {
  const url = "http://www.irasutoya.com/feeds/posts/summary?max-results=0";
  const $ = await fetchXml(url);
  return +$("openSearch\\:totalResults").text();
}

export async function randomImage(): Promise<ImageDetail> {
  const maxIndex = await totalImageCount() - 1;
  const index = Math.floor(Math.random() * maxIndex);
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
    $$("div").last().text().trim()
  );

  return detail;
}
